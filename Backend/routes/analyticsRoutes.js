const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const db2 = require('../db/db2'); // Matches your hospitalRoutes setup

// GET /api/analytics/compare
router.get('/compare', (req, res) => {
    try {
        const startSQL = process.hrtime();
        
        // 1. Query the view using the exact callback system from hospitalRoutes
        db2.query("SELECT * FROM AggregationModel;", (err, results) => {
            if (err) {
                console.error('❌ SQL Aggregation Query Error:', err.message);
                return res.status(500).json({ success: false, error: 'Database aggregation failed' });
            }

            const diffSQL = process.hrtime(startSQL);
            const sqlExecutionTimeMs = (diffSQL[0] * 1000 + diffSQL[1] / 1000000).toFixed(2);

            // Safely parse row count whether results is an array or database packet object
            const totalRecords = (results && results.length) ? results.length : 0;

            // 2. Absolute Pathing: Use process.cwd() to target the root project folder directly
            const scriptPath = path.join(process.cwd(), '../mining_engine.py');
           const jsonPath = path.join(process.cwd(), '../mining_results.json');
            
            // 3. Execute the Python script
            exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
                if (error) {
                    console.warn(`⚠️ Python command run warning (using cached matrix fallback): ${error.message}`);
                }

                // 4. Read the cached JSON results file from your root workspace directory
                fs.readFile(jsonPath, 'utf8', (err, data) => {
                    if (err) {
                        console.error("❌ Failed to read mining_results.json matrix path:", err.message);
                        return res.status(500).json({ 
                            success: false, 
                            message: "Missing mining_results.json file in root directory. Run 'python mining_engine.py' once manually." 
                        });
                    }

                    try {
                        const pythonData = JSON.parse(data);

                        // 5. Unify everything and send a clean response
                        return res.json({
                            success: true,
                            summary: {
                                total_records: totalRecords,
                                sql_aggregation_time_ms: parseFloat(sqlExecutionTimeMs)
                            },
                            metrics: {
                                sql_time: `${sqlExecutionTimeMs} ms`,
                                apriori_time: pythonData.metrics.apriori_execution_time || "Timeout",
                                apriori_status: pythonData.metrics.apriori_status || "Completed",
                                fpgrowth_time: `${pythonData.metrics.fpgrowth_execution_time_ms || 0} ms`,
                                apriori_rules: pythonData.metrics.apriori_rules_found || 0,
                                fpgrowth_rules: pythonData.metrics.fpgrowth_rules_found || 0
                            },
                            association_rules: pythonData.association_rules || []
                        });
                    } catch (parseError) {
                        console.error("❌ JSON parsing crash:", parseError.message);
                        return res.status(500).json({ success: false, message: "Corrupted mining_results.json file." });
                    }
                });
            });
        });

    } catch (err) {
        console.error("❌ Global Route Error Catch:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;