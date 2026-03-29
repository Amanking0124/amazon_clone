const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'amazon_clone.db');
const sqlPath = path.join(__dirname, '../database/init.sql');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Old database deleted.');
}

const db = new sqlite3.Database(dbPath);

const sql = fs.readFileSync(sqlPath, 'utf8');

db.exec(sql, (err) => {
  if (err) {
    console.error('Database init failed:', err.message);
  } else {
    console.log('Database initialized successfully.');
  }
  db.close();
});