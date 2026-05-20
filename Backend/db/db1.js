const mysql = require('mysql2');

const db1 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'demohealth' // Reverted back to your original choice
});

db1.connect((err) => {
  if (err) console.error('DB1 connection error:', err);
  else console.log('Connected to Database 1 (demohealth)');
});

module.exports = db1;