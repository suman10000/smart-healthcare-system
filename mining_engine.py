import mysql.connector
import pandas as pd
from mlxtend.frequent_patterns import apriori, fpgrowth, association_rules
import json
import os
import time
import threading

print("🚀 Launching Comparison Mining Engine with Apriori Failsafe...")

# Global variables to store Apriori results from the background thread
apriori_itemsets = None
apriori_error = False

def run_apriori_worker(basket):
    global apriori_itemsets, apriori_error
    try:
        # Failsafe threshold raised to 0.15 to keep it light
        apriori_itemsets = apriori(basket, min_support=0.15, use_colnames=True)
    except Exception:
        apriori_error = True

try:
    # 1. Connect to Docker MySQL
    db_connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",      
        database="healthcaredb"
    )

    query = "SELECT pat_id, disease_transaction FROM AggregationModel;"
    df = pd.read_sql(query, db_connection)
    db_connection.close()

    if df.empty:
        print("⚠️ Database view is empty.")
        exit()

    # 2. Build Binary Matrix
    all_diseases = set()
    transactions = {}
    for _, row in df.iterrows():
        pid = row['pat_id']
        raw_diseases = [d.strip() for d in row['disease_transaction'].split(',') if d.strip()]
        clean_diseases = list(set(raw_diseases))
        transactions[pid] = clean_diseases
        all_diseases.update(clean_diseases)

    all_diseases = sorted(list(all_diseases))
    binary_matrix_data = []
    patient_ids = []

    for pid, item_list in transactions.items():
        patient_ids.append(pid)
        row_values = [1 if disease in item_list else 0 for disease in all_diseases]
        binary_matrix_data.append(row_values)

    basket = pd.DataFrame(binary_matrix_data, columns=all_diseases, index=patient_ids).astype(bool)
    print(f"📐 Matrix Shape: {basket.shape} (Patients x Unique Diseases)")
    print("📋 First 3 transaction profiles in matrix:")
    print(basket.head(3))
 
 # ==========================================
    # SAFE BENCHMARK 1: APRIORI (WITH TIMEOUT)
    # ==========================================
    print("🧠 Running Apriori (with 1.5s Execution Limit)...")
    start_apriori = time.time()
    apriori_thread = threading.Thread(target=run_apriori_worker, args=(basket,))
    apriori_thread.start()
    apriori_thread.join(timeout=1.5) 

    apriori_rules_count = 0
    if apriori_thread.is_alive():
        apriori_time_str = "Timeout (>1500 ms)"
        apriori_status = "Inefficient / Halting"
    else:
        apriori_time_ms = (time.time() - start_apriori) * 1000
        apriori_time_str = f"{round(apriori_time_ms, 2)} ms"
        apriori_status = "Completed"
        if apriori_itemsets is not None and not apriori_itemsets.empty:
            # Lowered metric to catch rules from test data
            apriori_rules = association_rules(apriori_itemsets, metric="support", min_threshold=0.05)
            apriori_rules_count = len(apriori_rules)

    # ==========================================
    # BENCHMARK 2: FP-GROWTH ALGORITHM (FAST)
    # ==========================================
    print("🌲 Running FP-Growth...")
    start_fp = time.time()
    
    # SWEET SPOT: 0.05 support to extract patterns from sparse columns instantly
    fp_itemsets = fpgrowth(basket, min_support=0.05, use_colnames=True)
    fp_time_ms = (time.time() - start_fp) * 1000

    rules_list = []
    if not fp_itemsets.empty:
        fp_rules = association_rules(fp_itemsets, metric="support", min_threshold=0.05)
        for _, row in fp_rules.iterrows():
            rules_list.append({
                "antecedent": ", ".join(list(row['antecedents'])),
                "consequent": ", ".join(list(row['consequents'])),
                "support": round(row['support'], 4),
                "confidence": f"{round(row['confidence'] * 100, 1)}%",
                "lift": round(row['lift'], 2)
            })
    # ==========================================
    # SAVE SECURE UNIFIED METRICS
    # ==========================================
    output_data = {
        "metrics": {
            "total_patients_analyzed": len(basket),
            "apriori_execution_time": apriori_time_str,
            "apriori_status": apriori_status,
            "fpgrowth_execution_time_ms": round(fp_time_ms, 2),
            "apriori_rules_found": apriori_rules_count,
            "fpgrowth_rules_found": len(rules_list)
        },
        "association_rules": rules_list
    }

    output_path = os.path.join(os.path.dirname(__file__), 'mining_results.json')
    with open(output_path, 'w') as f:
        json.dump(output_data, f, indent=2)

    print("✅ Success! Clean metrics saved into mining_results.json")

except Exception as e:
    print(f"❌ Error: {str(e)}")