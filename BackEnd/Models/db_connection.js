
const mysql = require('mysql2');

// Create a connection to the database
const db_connection = mysql.createConnection({
  host: 'localhost',      
  user: 'root',           
  password: process.env.DB_PASS,
  database: 'school_dashboard'     
});

// Connect to the database
db_connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database!');
  // connection.end(); // Close connection when done
});

module.exports = db_connection;