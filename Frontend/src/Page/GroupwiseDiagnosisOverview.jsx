import React, { useState, useEffect } from 'react';

const GroupwiseDiagnosisOverview = () => {
    // State management for both analytical branches
    const [aggregationData, setAggregationData] = useState([]);
    const [miningRules, setMiningRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Benchmarking counters to display performance criteria differences
    const [metrics, setMetrics] = useState({ sqlTime: 0, pythonTime: 0 });

    useEffect(() => {
        const fetchComparativeData = async () => {
            setLoading(true);
            try {
                // Track start execution times for comparison metrics
                const t0 = performance.now();
                
                // 1. Fetch Database Aggregation records (reuses your baseline project infrastructure)
                // Adjust the port if your backend runs on a different port config
                const aggResponse = await fetch('http://localhost:4000/api/percentage'); 
                const aggResult = await aggResponse.json();
                const t1 = performance.now();

                // 2. Fetch Live Association Rules computed from the Python engine script
                const rulesResponse = await fetch('http://localhost:4000/api/mining/rules');
                const rulesResult = await rulesResponse.json();
                const t2 = performance.now();

                setAggregationData(aggResult.slice(0, 10)); // Top 10 frequencies
                
                if (rulesResult.error) {
                    console.warn("Mining pipeline warning:", rulesResult.details);
                    setMiningRules([]);
                } else {
                    setMiningRules(rulesResult);
                }

                setMetrics({
                    sqlTime: (t1 - t0).toFixed(2),
                    pythonTime: (t2 - t1).toFixed(2)
                });

                setLoading(false);
            } catch (err) {
                console.error("Comparative network error tracking:", err);
                setError("Failed to stream analytical parameters from endpoints.");
                setLoading(false);
            }
        };

        fetchComparativeData();
    }, []);

    if (loading) return <div style={styles.center}>Executing Analytical Pipelines... Please wait...</div>;
    if (error) return <div style={{...styles.center, color: '#dc3545'}}>{error}</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Comparative Analysis Dashboard</h1>
                <p style={styles.subtitle}>Disease Co-Occurrence Modelling: Database Aggregation vs. Association Rule Mining</p>
            </header>

            {/* BENCHMARKING SCORECARD SUMMARY BANNER */}
            <div style={styles.metricsBanner}>
                <div style={styles.metricCard}>
                    <h3>Aggregation Speed (SQL View)</h3>
                    <span style={styles.metricValue}>{metrics.sqlTime} ms</span>
                </div>
                <div style={styles.metricCard}>
                    <h3>Mining Speed (Apriori Core)</h3>
                    <span style={styles.metricValue}>{metrics.pythonTime} ms</span>
                </div>
                <div style={styles.metricCard}>
                    <h3>Analysis Depth</h3>
                    <span style={styles.metricValue}>Multi-Dimensional</span>
                </div>
            </div>

            {/* SIDE-BY-SIDE COMPARATIVE ARTIFACT SYSTEM */}
            <div style={styles.grid}>
                
                {/* COLUMN 1: TRADITIONAL DATABASE AGGREGATION LOOKUP */}
                <div style={styles.column}>
                    <h2 style={styles.columnTitle}>Method 1: Database Aggregation (SQL)</h2>
                    <p style={styles.columnDesc}>Descriptive counting logic based on raw item occurrence configurations inside transaction blocks.</p>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.theadRow}>
                                <th style={styles.th}>Primary Condition</th>
                                <th style={styles.th}>Co-Occurring Condition</th>
                                <th style={styles.th}>Raw Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aggregationData.map((row, index) => (
                                <tr key={index} style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                                    <td style={styles.td}>{row.diagnosis || "Unknown Entry"}</td>
                                    <td style={styles.td}>{row.hospital || "Comorbidity Map"}</td>
                                    <td style={styles.td}>{row.disease_count || row.count || 1}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* COLUMN 2: MACHINE LEARNING ASSOCIATION RULE MINING COMPONENT */}
                <div style={styles.column}>
                    <h2 style={styles.columnTitle}>Method 2: Association Rule Mining (Python)</h2>
                    <p style={styles.columnDesc}>Predictive correlation models charting transactional patterns using support, confidence, and rule lift variables.</p>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.theadRow}>
                                <th style={styles.th}>Antecedent (If X)</th>
                                <th style={styles.th}>Consequent (Then Y)</th>
                                <th style={styles.th}>Confidence</th>
                                <th style={styles.th}>Lift Correlation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {miningRules.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={styles.noData}>No explicit dependency sets recorded above minimum support limits.</td>
                                </tr>
                            ) : (
                                miningRules.map((rule, index) => (
                                    <tr key={index} style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                                        <td style={{...styles.td, color: '#0d6efd', fontWeight: 'bold'}}>{rule.antecedents.join(', ')}</td>
                                        <td style={{...styles.td, color: '#198754', fontWeight: 'bold'}}>{rule.consequents.join(', ')}</td>
                                        <td style={styles.td}>{(rule.confidence * 100).toFixed(1)}%</td>
                                        <td style={{...styles.td, fontWeight: 'bold'}}>
                                            <span style={rule.lift > 1 ? styles.badgeSuccess : styles.badgeNormal}>
                                                {rule.lift.toFixed(2)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

// Clean UI design stylesheet object rules mapping layout styles
const styles = {
    container: { padding: '30px', fontFamily: 'Segoe UI, Helvetica, Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' },
    center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontSize: '1.2rem', fontWeight: '600', color: '#495057' },
    header: { textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #dee2e6', paddingBottom: '20px' },
    title: { color: '#212529', fontSize: '2.5rem', margin: '0' },
    subtitle: { color: '#6c757d', fontSize: '1.1rem', marginTop: '10px' },
    metricsBanner: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' },
    metricCard: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #e9ecef' },
    metricValue: { fontSize: '1.8rem', fontWeight: 'bold', color: '#0d6efd', display: 'block', marginTop: '5px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
    column: { backgroundColor: '#ffffff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e9ecef' },
    columnTitle: { fontSize: '1.4rem', color: '#343a40', margin: '0 0 10px 0' },
    columnDesc: { color: '#6c757d', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.4' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    theadRow: { backgroundColor: '#212529', color: '#ffffff' },
    th: { padding: '12px 15px', textAlign: 'left', fontSize: '0.9rem', uppercase: 'true' },
    td: { padding: '12px 15px', borderBottom: '1px solid #dee2e6', fontSize: '0.9rem', color: '#212529' },
    tableRowEven: { backgroundColor: '#ffffff' },
    tableRowOdd: { backgroundColor: '#f8f9fa' },
    noData: { textAlign: 'center', padding: '30px', color: '#6c757d', italic: 'true' },
    badgeSuccess: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '4px' },
    badgeNormal: { backgroundColor: '#eee', color: '#333', padding: '4px 8px', borderRadius: '4px' }
};

export default GroupwiseDiagnosisOverview;