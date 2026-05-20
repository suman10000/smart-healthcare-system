const mysql = require('mysql2');

const db2 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'healthcaredb' 
});

db2.connect((err) => {
  if (err) console.error('DB2 connection error:', err);
  else console.log('Connected to Database 2 (healthcaredb)');
});

module.exports = db2;