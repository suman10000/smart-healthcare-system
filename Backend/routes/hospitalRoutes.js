const express = require('express');
const router = express.Router();
const db1 = require('../db/db1'); // demohealth
const db2 = require('../db/db2'); // healthcaredb

// 1. Get distinct hospital names — only from healthcaredb.pre, so use db2
router.get('/hospitals', (req, res) => {
  const sql = `
    SELECT DISTINCT name_hos 
    FROM pre 
    WHERE name_hos IS NOT NULL AND TRIM(name_hos) != ''
    ORDER BY name_hos
  `;
  db2.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching hospitals:', err);
      return res.status(500).json({ error: 'Failed to fetch hospitals' });
    }
    res.json(results);
  });
});

// 2. Get grouped patient count by diagnosis with cross-db join (run on db2)
router.get('/grouped-patient-data', (req, res) => {
  const { hospital, from, to } = req.query;
  if (!hospital || !from || !to) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const sql = `
    SELECT p51.basic_diagnosis, COUNT(DISTINCT pre.pat_id) AS patient_count
    FROM pre
    JOIN demohealth.p51 AS p51 ON pre.preid = p51.preid
    WHERE pre.name_hos = ?
      AND (
        DATE(pre.entrydate) BETWEEN ? AND ?
        OR DATE(pre.apptdate) BETWEEN ? AND ?
      )
    GROUP BY p51.basic_diagnosis
    ORDER BY patient_count DESC
  `;

  db2.query(sql, [hospital, from, to, from, to], (err, results) => {
    if (err) {
      console.error('Error fetching grouped patient data:', err);
      return res.status(500).json({ error: 'Failed to fetch grouped patient data' });
    }
    res.json(results);
  });
});

// 3. Get patients by diagnosis + hospital + date range (cross-db join via db2)
router.get('/patients-by-diagnosis', (req, res) => {
  const { hospital, from, to, diagnosis } = req.query;
  if (!hospital || !from || !to || !diagnosis) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const sql = `
    SELECT pre.pat_id, p51.basic_diagnosis, p51.value, MIN(pre.preid) AS preid
    FROM pre
    JOIN demohealth.p51 AS p51 ON pre.preid = p51.preid
    WHERE pre.name_hos = ?
      AND p51.basic_diagnosis = ?
      AND (
        DATE(pre.entrydate) BETWEEN ? AND ?
        OR DATE(pre.apptdate) BETWEEN ? AND ?
      )
    GROUP BY pre.pat_id, p51.basic_diagnosis, p51.value
    ORDER BY MIN(pre.entrydate) DESC
  `;

  db2.query(sql, [hospital, diagnosis, from, to, from, to], (err, results) => {
    if (err) {
      console.error('Error fetching patients by diagnosis:', err);
      return res.status(500).json({ error: 'Failed to fetch patients by diagnosis' });
    }
    res.json(results);
  });
});

module.exports = router;
