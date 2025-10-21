require("dotenv").config();
// const mysql = require("mysql2");

// const dbConnection = mysql.createPool({
//   user: process.env.USER,
//   host: process.env.HOST,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
//   connectionLimit: 10,
// });

// module.exports = dbConnection.promise();
const mysql = require("mysql2/promise");

const dbConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = dbConnection;
