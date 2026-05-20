const express = require('express');
const mysql = require('mysql2');

const router = express.Router();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'odisha_blood'
});

db.connect((err) => {
  if (err) console.error('❌ DB Connection Failed:', err);
  else console.log('✅ MySQL Connected for Donor Routes');
});

// Register Donor with updated location fields
router.post('/register-donor', (req, res) => {
  const { name, bloodGroup, state, district, locality, contact, password } = req.body;

  if (!name || !bloodGroup || !state || !district || !locality || !contact || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const sql = `
    INSERT INTO donors (name, blood_group, location_state, location_district, location_locality, contact, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, bloodGroup, state, district, locality, contact, password], (err) => {
    if (err) return res.status(500).json({ error: 'Insert Error', details: err });
    res.json({ success: true, message: 'Donor registered successfully' });
  });
});

// Donor Login
router.post('/login', (req, res) => {
  const { contact, password } = req.body;
  const sql = 'SELECT * FROM donors WHERE contact = ? AND password = ?';
  db.query(sql, [contact, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid contact or password' });
    }
    res.json({ success: true, message: 'Login successful', donor: results[0] });
  });
});

// Search donors by location (state, district, locality) and optional blood group
router.get('/search-donors', (req, res) => {
  const { location, bloodGroup } = req.query;

  let sql = 'SELECT * FROM donors';
  const params = [];

  if (location && location.trim() !== '') {
    sql += ' WHERE (location_state LIKE ? OR location_district LIKE ? OR location_locality LIKE ?)';
    params.push(`%${location}%`, `%${location}%`, `%${location}%`);
  }

  if (bloodGroup) {
    if (params.length === 0) {
      sql += ' WHERE blood_group = ?';
    } else {
      sql += ' AND blood_group = ?';
    }
    params.push(bloodGroup);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB Error', details: err });
    res.json(results);
  });
});

module.exports = router;
