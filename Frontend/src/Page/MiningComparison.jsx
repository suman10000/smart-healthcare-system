import React, { useState, useEffect } from 'react';

const MiningComparison = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchComparisonData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:4000/api/analytics/compare');
            const data = await response.json();
            
            if (data.success) {
                setAnalytics(data);
            } else {
                setError('Failed to fetch processing matrix rules.');
            }
        } catch (err) {
            setError('Backend server connection dropped.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComparisonData();
    }, []);

    if (loading) return <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.2rem' }}>⚙️ Benchmarking Datasets Natively... Please wait...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>❌ Error: {error}</div>;

    const { metrics, association_rules, summary } = analytics;

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ marginBottom: '5px', color: '#2c3e50' }}>📈 Data Mining Methodologies Comparison</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '25px' }}>
                Analyzing <strong>{summary.total_records}</strong> grouped patient transaction baskets across clinical datasets.
            </p>

            {/* PERFORMANCE COMPARISON CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '35px' }}>
                
                {/* CARD 1: SQL */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #3498db' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#3498db' }}>1. Database Aggregation (SQL)</h4>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '5px 0', color: '#2c3e50' }}>{metrics.sql_time}</p>
                    <small style={{ color: '#95a5a6' }}>Capability: Frequency Counting Only</small>
                </div>

                {/* CARD 2: APRIORI */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #e74c3c' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#e74c3c' }}>2. Apriori Algorithm</h4>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '5px 0', color: '#2c3e50' }}>{metrics.apriori_time}</p>
                    <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                        <small style={{ color: '#95a5a6' }}>Status: {metrics.apriori_status}</small>
                    </div>
                </div>

                {/* CARD 3: FP-GROWTH */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #2ecc71' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#2ecc71' }}>3. FP-Growth (Our Core Improvement)</h4>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '5px 0', color: '#2c3e50' }}>{metrics.fpgrowth_time}</p>
                    <small style={{ color: '#27ae60', fontWeight: 'bold' }}>⚡ Found {metrics.fpgrowth_rules} Association Rules</small>
                </div>

            </div>

            {/* CLINICAL PATTERNS DATATABLE */}
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, color: '#2c3e50' }}>🌲 Extracted Clinical Correlative Rules (FP-Growth Core)</h3>
                    <button onClick={fetchComparisonData} style={{ padding: '8px 15px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>🔄 Recalculate Engine</button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f2f6', borderBottom: '2px solid #ced6e0' }}>
                                <th style={{ padding: '12px' }}>Antecedent (Condition A)</th>
                                <th style={{ padding: '12px' }}>Consequent (Associated Condition B)</th>
                                <th style={{ padding: '12px' }}>Support</th>
                                <th style={{ padding: '12px' }}>Confidence</th>
                                <th style={{ padding: '12px' }}>Lift Metric</th>
                            </tr>
                        </thead>
                        <tbody>
                            {association_rules.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#95a5a6' }}>No significant diagnostic correlations identified at this threshold support value.</td>
                                </tr>
                            ) : (
                                association_rules.map((rule, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f2f6', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td style={{ padding: '12px', color: '#c0392b', fontWeight: '500' }}>{rule.antecedent}</td>
                                        <td style={{ padding: '12px', color: '#27ae60', fontWeight: '500' }}>➡ {rule.consequent}</td>
                                        <td style={{ padding: '12px' }}>{rule.support}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#2c3e50' }}>{rule.confidence}</td>
                                        <td style={{ padding: '12px' }}><span style={{ backgroundColor: rule.lift > 1 ? '#e8f5e9' : '#ffebee', color: rule.lift > 1 ? '#2e7d32' : '#c62828', padding: '3px 8px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>{rule.lift}</span></td>
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

export default MiningComparison;