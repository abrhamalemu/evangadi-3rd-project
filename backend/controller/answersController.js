// const db = require("../db/dbConfig");
// const { StatusCodes } = require("http-status-codes");

// const postAnswer = async (req, res) => {
//   // get necessary information from req
//   const { answer, questionid } = req.body;
//   const { userid } = req.user;

//   // return error if an empty field is returned for answer field
//   if (!answer) {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "please fill the answer field" });
//   }
//   try {
//     // getting question id from questions table and check whether that question is there
//     const [questions] = await db.query(
//       `select questionid from questions where questionid=?`,
//       [questionid]
//     );
//     if (questions.length === 0) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ msg: "this question is no more available" });
//     }

//     // post an answer
//     await db.query(
//       `insert into answers(userid,questionid,answer) values (?,?,?)`,
//       [userid, questionid, answer]
//     );
//     return res
//       .status(StatusCodes.CREATED)
//       .json({ msg: "answer posted successfully", data: { userid, answer } });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ msg: "Something goes wrong please try later" });
//   }
// };

// const getAnswer = async (req, res) => {
//   // get question id from req params
//   const { questionid } = req.params;

//   try {
//     // getting question id from questions table and check whether that question is there
//     const [questions] = await db.query(
//       `select questionid from questions where questionid=?`,
//       [questionid]
//     );
//     if (questions.length === 0) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ error: true, msg: "this question is no longer available" });
//     }
//     // fetching an answer for a specific question with a given question id
//     const [answers] = await db.query(
//       `select a.answerid,a.answer,a.created_at,u.username from answers a join users u on u.userid=a.userid where questionid=? ORDER BY a.created_at DESC`,
//       [questionid]
//     );
//     // console.log(answers);
//     return res.status(StatusCodes.ACCEPTED).json({ error: false, answers });
//   } catch (error) {
//     console.log(error.message);
//     res
//       .status(500)
//       .json({ error: true, msg: "Something goes wrong please try later" });
//   }
// };

// module.exports = { postAnswer, getAnswer };

const pool = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

// POST ANSWER
const postAnswer = async (req, res) => {
  const { answer, questionid } = req.body;
  const { userid } = req.user;

  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please fill the answer field" });
  }

  try {
    // Check if question exists
    const questionResult = await pool.query(
      "SELECT questionid FROM questions WHERE questionid = $1",
      [questionid]
    );
    const question = questionResult.rows[0];

    if (!question) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "This question is no longer available" });
    }

    // Insert answer
    const insertResult = await pool.query(
      "INSERT INTO answers(userid, questionid, answer) VALUES ($1, $2, $3) RETURNING answerid, answer, created_at",
      [userid, questionid, answer]
    );

    res.status(StatusCodes.CREATED).json({
      msg: "Answer posted successfully",
      data: { userid, ...insertResult.rows[0] },
    });
  } catch (error) {
    console.error("Error posting answer:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong, please try later",
      details: error.message,
    });
  }
};

// GET ANSWERS FOR A QUESTION
const getAnswer = async (req, res) => {
  const { questionid } = req.params;

  try {
    // Check if question exists
    const questionResult = await pool.query(
      "SELECT questionid FROM questions WHERE questionid = $1",
      [questionid]
    );
    const question = questionResult.rows[0];

    if (!question) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        msg: "This question is no longer available",
      });
    }

    // Fetch answers for the question
    const answersResult = await pool.query(
      `SELECT a.answerid, a.answer, a.created_at, u.username
       FROM answers a
       JOIN users u ON u.userid = a.userid
       WHERE a.questionid = $1
       ORDER BY a.created_at DESC`,
      [questionid]
    );

    res.status(StatusCodes.OK).json({
      error: false,
      answers: answersResult.rows,
    });
  } catch (error) {
    console.error("Error fetching answers:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true,
      msg: "Something went wrong, please try later",
      details: error.message,
    });
  }
};

module.exports = { postAnswer, getAnswer };
