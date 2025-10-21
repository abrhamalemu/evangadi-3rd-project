require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const db = require("./db/dbConfig");

const pool = require("./db/dbConfig");

// Routers
const userRouter = require("./routes/userRoute");
const questionRouter = require("./routes/questionsRoute");
const answerRouter = require("./routes/answerRoute");
const aiRouter = require("./routes/aiRoute");
const authMiddlewares = require("./midllewares/authMiddleware");

const app = express();

// ✅ Render provides its own PORT via environment variable
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check route (important for Render)
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Server is running!" });
});

// ✅ Routes
app.use("/api/user", userRouter);
app.use("/api/question", authMiddlewares, questionRouter);
app.use("/api/answer", authMiddlewares, answerRouter);
app.use("/api/ai", authMiddlewares, aiRouter);

// ✅ Start server only after DB connection succeeds
const start = async () => {
  try {
    const result = await pool.query("SELECT 'databaseConnected' AS status");
    console.log(result[0][0].status);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

start();
