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
// //////////////////////////////////////////////
// const mysql = require("mysql2/promise");

// const db = mysql.createPool({
//   host: process.env.DB_HOST, // your Render DB host
//   user: process.env.DB_USER, // your Render DB username
//   password: process.env.DB_PASSWORD, // your Render DB password
//   database: process.env.DB_NAME, // your Render DB name
//   port: process.env.DB_PORT || 3306, // optional
//   ssl: {
//     rejectUnauthorized: true, // Render’s MySQL requires SSL
//   },
// });

// (async () => {
//   try {
//     const connection = await db.getConnection();
//     console.log("✅ Database connected successfully");
//     connection.release();
//   } catch (err) {
//     console.error("❌ Database connection failed:", err.message);
//   }
// })();

// module.exports = db;
////////////////////////////////////////////////////
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Render requires SSL
});

pool
  .connect()
  .then(() => console.log("✅ PostgreSQL database connected successfully"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

module.exports = pool;

/////////////////////////////////////////////////

// Update your backend queries (if you were using MySQL)

// If your previous code used db.execute(...) or db.query(...) from MySQL2, you’ll need to change them slightly for PostgreSQL.

// Old MySQL style:
