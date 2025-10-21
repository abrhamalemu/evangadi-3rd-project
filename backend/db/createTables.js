// const db = require("./dbConfig");

// async function createTables() {
//   try {
//     // Create users table
//     await db.execute(`
//       CREATE TABLE IF NOT EXISTS users (
//         userid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//         username VARCHAR(20) UNIQUE,
//         firstname VARCHAR(20) NOT NULL,
//         lastname VARCHAR(20) NOT NULL,
//         email VARCHAR(40) NOT NULL UNIQUE,
//         password VARCHAR(100) NOT NULL
//       ) ENGINE=InnoDB;
//     `);

//     // Create questions table
//     await db.execute(`
//         CREATE TABLE IF NOT EXISTS questions (
//           id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//           questionid INT NOT NULL AUTO_INCREMENT UNIQUE,
//           userid INT NOT NULL,
//           title VARCHAR(200) NOT NULL,
//           description VARCHAR(200) NOT NULL,
//           tag VARCHAR(255),
//           FOREIGN KEY(userid) REFERENCES users(userid)
//         ) ENGINE=InnoDB AUTO_INCREMENT=1;
//       `);

//     // Create answers table
//     await db.execute(`
//       CREATE TABLE IF NOT EXISTS answers (
//         answerid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//         userid INT NOT NULL,
//         questionid INT NOT NULL,
//         answer VARCHAR(200) NOT NULL,
//         FOREIGN KEY(questionid) REFERENCES questions(questionid),
//         FOREIGN KEY(userid) REFERENCES users(userid)
//       ) ENGINE=InnoDB;
//     `);

//     console.log("Tables created successfully!");
//     process.exit(0);
//   } catch (err) {
//     console.error("Error creating tables:", err);
//     process.exit(1);
//   }
// }

// createTables();

require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        userid SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        firstname VARCHAR(50) NOT NULL,
        lastname VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        questionid UUID DEFAULT gen_random_uuid() UNIQUE,
        userid INTEGER REFERENCES users(userid) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        tag VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS answers (
        answerid SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES users(userid) ON DELETE CASCADE,
        questionid UUID REFERENCES questions(questionid) ON DELETE CASCADE,
        answer TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ai_questions (
        id SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES users(userid) ON DELETE CASCADE,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Tables created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating tables:", err);
    process.exit(1);
  }
}

createTables();
