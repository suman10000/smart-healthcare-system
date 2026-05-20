const express = require('express');
const router = express.Router();
const db1 = require('../db/db1'); // demohealth database connection
const db2 = require('../db/db2'); // healthcaredb database connection

// 1. Get all unique hospital names from 'pre'
router.get('/hospitals', (req, res) => {
  const sql = `SELECT DISTINCT name_hos FROM healthcaredb.pre ORDER BY name_hos`;
  db2.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch hospitals', details: err });
    res.json(rows);
  });
});

// 2. Get all unique diseases from 'p51'
router.get('/diseases', (req, res) => {
  const sql = `SELECT DISTINCT basic_diagnosis FROM demohealth.p51 ORDER BY basic_diagnosis`;
  db1.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch diseases', details: err });
    res.json(rows);
  });
});

// 3. Get patient IDs based on selected disease, hospital, and date range
router.get('/patients', (req, res) => {
  const { disease, hospital, startDate, endDate } = req.query;
  if (!disease || !hospital || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const sql = `
    SELECT DISTINCT pr.preid
    FROM healthcaredb.pre pr
    JOIN demohealth.p51 p ON pr.preid = p.preid
    WHERE TRIM(UPPER(p.basic_diagnosis)) = TRIM(UPPER(?))
      AND TRIM(UPPER(pr.name_hos)) = TRIM(UPPER(?))
      AND pr.entrydate BETWEEN ? AND ?
  `;

  db2.query(sql, [disease, hospital, startDate, endDate], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error fetching patients', details: err });
    res.json(rows);
  });
});

// 4. Get all diseases for a specific patient (by preid)
router.get('/patient-diseases', (req, res) => {
  const { preid } = req.query;
  if (!preid) return res.status(400).json({ error: 'Missing preid' });

  const sql = `
    SELECT DISTINCT basic_diagnosis AS disease
    FROM demohealth.p51
    WHERE preid = ?
  `;

  db1.query(sql, [preid], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error fetching patient diseases', details: err });
    res.json(rows);
  });
});

// 5. Get top N co-occurring diseases with counts and percentages
router.get('/cooccurring-diseases', (req, res) => {
  let { disease, hospital, startDate, endDate, limit } = req.query;
  if (!disease || !hospital || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  limit = parseInt(limit) || 3; // default limit 3 if not provided or invalid

  // Step 1: Get patient IDs matching filters
  const patientsSql = `
    SELECT DISTINCT pr.preid
    FROM healthcaredb.pre pr
    JOIN demohealth.p51 p ON pr.preid = p.preid
    WHERE TRIM(UPPER(p.basic_diagnosis)) = TRIM(UPPER(?))
      AND TRIM(UPPER(pr.name_hos)) = TRIM(UPPER(?))
      AND pr.entrydate BETWEEN ? AND ?
  `;

  db2.query(patientsSql, [disease, hospital, startDate, endDate], (err, patientRows) => {
    if (err) return res.status(500).json({ error: 'DB error fetching patients', details: err });

    const patientIds = patientRows.map(r => r.preid);
    if (patientIds.length === 0) return res.json([]); // no matching patients

    const placeholders = patientIds.map(() => '?').join(',');

    // Step 2: Get top N co-occurring diseases excluding main disease and 'OTHERS'
    const cooccurSql = `
      SELECT basic_diagnosis AS disease, COUNT(DISTINCT preid) AS count
      FROM demohealth.p51
      WHERE preid IN (${placeholders})
        AND TRIM(UPPER(basic_diagnosis)) != TRIM(UPPER(?))
        AND TRIM(UPPER(basic_diagnosis)) != 'OTHERS'
      GROUP BY basic_diagnosis
      ORDER BY count DESC
      LIMIT ?
    `;

    db1.query(cooccurSql, [...patientIds, disease, limit], (err2, cooccurRows) => {
      if (err2) return res.status(500).json({ error: 'DB error fetching co-occurrences', details: err2 });

      const totalPatients = patientIds.length;

      const results = cooccurRows.map(row => ({
        disease: row.disease,
        count: row.count,
        percentage: ((row.count / totalPatients) * 100).toFixed(2)
      }));

      res.json(results);
    });
  });
});

module.exports = router;
