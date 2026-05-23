const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); //Enable CORS so frontend (React, etc.) can talk to backend.........
app.use(express.json());//Allow server to read JSON data from requests.........................

// Import route modules
const percentageRoute = require('./routes/percentage');
const hospitalRoutes = require('./routes/hospitalRoutes');
const donorRoutes = require('./routes/donorRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
// Mount all API routes under /api prefix
app.use('/api', percentageRoute);
app.use('/api', hospitalRoutes);
app.use('/api', donorRoutes);
app.use('/api/analytics', analyticsRoutes);
// =====================================================================
// TRANSACTIONAL DATA API FOR ASSOCIATION RULE MINING
// This endpoint extracts grouped comorbidity groups from your View layer
// =====================================================================
// Note: We mount it on app directly using the common /api context path
app.get('/api/mining/transactions', (req, res) => {
    // Import your database connection dynamically
    const db2 = require('./db/db2');
    
    // We target the explicit SQL Aggregation view created 
    const query = `SELECT disease_transaction FROM AggregationModel`;

    db2.query(query, (err, results) => {
        if (err) {
            console.error("Error executing transactional mining pull:", err);
            return res.status(500).json({ error: "Database aggregation pull failed", details: err });
        }

        // Parse individual concatenated database strings into discrete item arrays
        // Formats data cleanly into: [ ["Fever", "Cough"], ["Asthma", "Chlamydia"] ]
        const transactionalDataset = results.map(row => {
            if (!row.disease_transaction) return [];
            return row.disease_transaction.split(',').map(item => item.trim());
        });

        res.json(transactionalDataset);
        
    });
});

// ---- Server ----
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));