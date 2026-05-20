import sys
import json
import os
import requests
import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules

def analytical_mining_pipeline(min_support=0.01, min_confidence=0.3):
    try:
        # 1. Fetch live transaction streams from your Node.js endpoint
        backend_url = os.environ.get("BACKEND_URL", "http://localhost:4000")
        API_URL = f"{backend_url}/api/mining/transactions"
        response = requests.get(API_URL)
        
        if response.status_code != 200:
            return {"error": f"Backend communication failed with status code {response.status_code}"}
            
        dataset = response.json()
        
        if not dataset or len(dataset) == 0:
            return {"error": "No sufficient transactional records found to map dependencies."}

        # 2. Apply One-Hot Encoding transformation matrices
        te = TransactionEncoder()
        te_ary = te.fit(dataset).transform(dataset)
        df = pd.DataFrame(te_ary, columns=te.columns_)

        # 3. Apply Apriori Algorithm to isolate Frequent Itemsets
        frequent_itemsets = apriori(df, min_support=min_support, use_colnames=True)

        if frequent_itemsets.empty:
            return {"error": "No frequent disease items found. Lower the minimum support threshold parameters."}

        # 4. Extract Association Rules using Support, Confidence, and Lift calculations
        rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=min_confidence)
        
        if rules.empty:
            return {"error": "No distinct behavioral association rules detected among records."}

        # Clean rules dataframe parameters for easy data transmission over JSON arrays
        rules["antecedents"] = rules["antecedents"].apply(lambda x: list(x))
        rules["consequents"] = rules["consequents"].apply(lambda x: list(x))
        
        # Sort values primarily on rule strength ("Lift" index value indicator)
        top_rules = rules.sort_values(by="lift", ascending=False).head(20)
        
        return top_rules.to_dict(orient="records")

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Execute analytical pipeline run and broadcast standard JSON out string data 
    analysis_results = analytical_mining_pipeline()
    print(json.dumps(analysis_results))