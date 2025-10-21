// const crypto = require("crypto");
// const db = require("../db/dbConfig");
// const { StatusCodes } = require("http-status-codes");

// const postQuestion = async (req, res) => {
//   const { username, userid } = req.user;
//   // const userid = 6; // temporary for testing without auth
//   try {
//     //extract data from request body
//     const { title, description, tag } = req.body;
//     //validation
//     if (!title || !description) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         error: true,
//         message: "Title and description are required",
//       });
//     }
//     //later this will be replaced by actual user id

//     // Generate UUID using crypto module modern method
//     const questionid = crypto.randomUUID();
//     const query = `
//             INSERT INTO questions (userid, questionid, title, description, tag)
//             VALUES (?, ?, ?, ?, ?)
//         `;
//     //execute query
//     const [result] = await db.execute(query, [
//       userid,
//       questionid,
//       title,
//       description,
//       tag || null,
//     ]);

//     res.status(StatusCodes.CREATED).json({
//       error: false,
//       message: "Question posted successfully",
//       data: {
//         questionid: questionid,
//         title: title,
//         description: description,
//         tag: tag,
//         userid: userid,
//       },
//     });
//   } catch (error) {
//     console.error("Error posting question:", error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       error: true,
//       message: "Internal server error",
//       details: error.message,
//     });
//   }
// };

// const getAllQuestions = async (req, res) => {
//   try {
//     // SQL query to get all questions with user information
//     const query = `
//             SELECT
//                 q.questionid,
//                 q.title,
//                 q.description,
//                 q.tag,
//                 q.id,
//                 q.created_at,
//                 u.userid,
//                 u.username,
//                 u.firstname,
//                 u.lastname
//             FROM questions q
//             JOIN users u ON q.userid = u.userid
//             ORDER BY q.id DESC
//         `;
//     //destructure the result to get only the rows
//     const [questions] = await db.execute(query);

//     // Check if questions exist
//     if (questions.length === 0) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         error: true,
//         message: "No questions found",
//         data: [],
//       });
//     }

//     res.status(StatusCodes.OK).json({
//       error: false,
//       message: "Questions retrieved successfully",
//       data: questions,
//       count: questions.length,
//     });
//   } catch (error) {
//     console.error("Error fetching questions:", error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       error: true,
//       message: "Internal server error",
//       details: error.message,
//     });
//   }
// };

// const getSingleQuestion = async (req, res) => {
//   try {
//     // Extract questionid from request parameters
//     const { questionid } = req.params;

//     // Validate questionid parameter
//     if (!questionid) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         error: true,
//         message: "Question ID is required",
//       });
//     }

//     // SQL query to get single question with user information
//     const query = `
//             SELECT
//                 q.questionid,
//                 q.title,
//                 q.description,
//                 q.tag,
//                 q.id,
//                 q.created_at,
//                 u.userid,
//                 u.username,
//                 u.firstname,
//                 u.lastname
//             FROM questions q
//             JOIN users u ON q.userid = u.userid
//             WHERE q.questionid = ?
//         `;

//     const [questions] = await db.execute(query, [questionid]);

//     // Check if question exists
//     if (questions.length === 0) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         error: true,
//         message: "Question not found",
//         data: null,
//       });
//     }

//     // Return the single question
//     res.status(StatusCodes.OK).json({
//       error: false,
//       message: "Question retrieved successfully",
//       data: questions[0], // Return the first (and only) result
//     });
//   } catch (error) {
//     console.error("Error fetching single question:", error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       error: true,
//       message: "Internal server error",
//       details: error.message,
//     });
//   }
// };
// const updateQuestion = async (req, res) => {
//   const { userid } = req.user;
//   try {
//     // Extract questionid from request parameters and data from body
//     const { questionid } = req.params;
//     const { title, description, tag } = req.body;

//     // Validate questionid parameter
//     if (!questionid) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         error: true,
//         message: "Question ID is required",
//       });
//     }

//     // Validate at least one field to update
//     if (!title && !description && !tag) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         error: true,
//         message: "At least one field (title, description, or tag) is required to update",
//       });
//     }

//     // First, check if the question exists and belongs to the user
//     const checkQuery = `
//       SELECT questionid, userid
//       FROM questions
//       WHERE questionid = ?
//     `;
//     const [questions] = await db.execute(checkQuery, [questionid]);

//     // Check if question exists
//     if (questions.length === 0) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         error: true,
//         message: "Question not found",
//       });
//     }

//     // Check if the question belongs to the authenticated user
//     if (questions[0].userid !== userid) {
//       return res.status(StatusCodes.FORBIDDEN).json({
//         error: true,
//         message: "You are not authorized to update this question",
//       });
//     }

//     // Build dynamic update query based on provided fields
//     let updateFields = [];
//     let updateValues = [];

//     if (title) {
//       updateFields.push("title = ?");
//       updateValues.push(title);
//     }
//     if (description) {
//       updateFields.push("description = ?");
//       updateValues.push(description);
//     }
//     if (tag !== undefined) {
//       updateFields.push("tag = ?");
//       updateValues.push(tag);
//     }

//     // Add questionid and userid to values array
//     updateValues.push(questionid, userid);

//     const updateQuery = `
//       UPDATE questions
//       SET ${updateFields.join(", ")}
//       WHERE questionid = ? AND userid = ?
//     `;

//     // Execute update query
//     const [result] = await db.execute(updateQuery, updateValues);

//     // Check if any rows were affected
//     if (result.affectedRows === 0) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         error: true,
//         message: "Question not found or you are not authorized to update it",
//       });
//     }

//     res.status(StatusCodes.OK).json({
//       error: false,
//       message: "Question updated successfully",
//       data: {
//         questionid: questionid,
//         title: title,
//         description: description,
//         tag: tag,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating question:", error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       error: true,
//       message: "Internal server error",
//       details: error.message,
//     });
//   }
// };

// const deleteQuestion = async (req, res) => {
//   const { userid } = req.user;
//   try {
//     // Extract questionid from request parameters
//     const { questionid } = req.params;

//     // Validate questionid parameter
//     if (!questionid) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         error: true,
//         message: "Question ID is required",
//       });
//     }

//     // First, check if the question exists and belongs to the user
//     const checkQuery = `
//       SELECT questionid, userid
//       FROM questions
//       WHERE questionid = ?
//     `;
//     const [questions] = await db.execute(checkQuery, [questionid]);

//     // Check if question exists
//     if (questions.length === 0) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         error: true,
//         message: "Question not found",
//       });
//     }

//     // Check if the question belongs to the authenticated user
//     if (questions[0].userid !== userid) {
//       return res.status(StatusCodes.FORBIDDEN).json({
//         error: true,
//         message: "You are not authorized to delete this question",
//       });
//     }

//     // Delete the question
//     const deleteQuery = `
//       DELETE FROM questions
//       WHERE questionid = ? AND userid = ?
//     `;

//     const [result] = await db.execute(deleteQuery, [questionid, userid]);

//     // Check if any rows were affected
//     if (result.affectedRows === 0) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         error: true,
//         message: "Question not found or you are not authorized to delete it",
//       });
//     }

//     res.status(StatusCodes.OK).json({
//       error: false,
//       message: "Question deleted successfully",
//       data: {
//         questionid: questionid,
//       },
//     });
//   } catch (error) {
//     console.error("Error deleting question:", error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       error: true,
//       message: "Internal server error",
//       details: error.message,
//     });
//   }
// };

// // Make sure this export statement is at the VERY END of the file
// module.exports = {
//   postQuestion,
//   getAllQuestions,
//   getSingleQuestion,
//   updateQuestion,
//   deleteQuestion
// };

const crypto = require("crypto");
const db = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

// POST QUESTION
const postQuestion = async (req, res) => {
  const { username, userid } = req.user;

  try {
    const { title, description, tag } = req.body;
    if (!title || !description) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        message: "Title and description are required",
      });
    }

    const questionid = crypto.randomUUID();
    const query = `
      INSERT INTO questions (userid, questionid, title, description, tag) 
      VALUES ($1, $2, $3, $4, $5)
    `;
    await db.query(query, [
      userid,
      questionid,
      title,
      description,
      tag || null,
    ]);

    res.status(StatusCodes.CREATED).json({
      error: false,
      message: "Question posted successfully",
      data: { questionid, title, description, tag, userid },
    });
  } catch (error) {
    console.error("Error posting question:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true,
      message: "Internal server error",
      details: error.message,
    });
  }
};

// GET ALL QUESTIONS
const getAllQuestions = async (req, res) => {
  try {
    const query = `
      SELECT 
        q.questionid,
        q.title,
        q.description,
        q.tag,
        q.id,
        q.created_at,
        u.userid,
        u.username,
        u.firstname,
        u.lastname
      FROM questions q
      JOIN users u ON q.userid = u.userid
      ORDER BY q.id DESC
    `;
    const result = await db.query(query);
    const questions = result.rows;

    if (questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: true,
        message: "No questions found",
        data: [],
      });
    }

    res.status(StatusCodes.OK).json({
      error: false,
      message: "Questions retrieved successfully",
      data: questions,
      count: questions.length,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true,
      message: "Internal server error",
      details: error.message,
    });
  }
};

// GET SINGLE QUESTION
const getSingleQuestion = async (req, res) => {
  try {
    const { questionid } = req.params;
    if (!questionid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        message: "Question ID is required",
      });
    }

    const query = `
      SELECT 
        q.questionid,
        q.title,
        q.description,
        q.tag,
        q.id,
        q.created_at,
        u.userid,
        u.username,
        u.firstname,
        u.lastname
      FROM questions q
      JOIN users u ON q.userid = u.userid
      WHERE q.questionid = $1
    `;
    const result = await db.query(query, [questionid]);
    const question = result.rows[0];

    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: true,
        message: "Question not found",
        data: null,
      });
    }

    res.status(StatusCodes.OK).json({
      error: false,
      message: "Question retrieved successfully",
      data: question,
    });
  } catch (error) {
    console.error("Error fetching single question:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true,
      message: "Internal server error",
      details: error.message,
    });
  }
};

// UPDATE QUESTION
const updateQuestion = async (req, res) => {
  const { userid } = req.user;
  try {
    const { questionid } = req.params;
    const { title, description, tag } = req.body;

    if (!questionid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        message: "Question ID is required",
      });
    }

    if (!title && !description && tag === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        message:
          "At least one field (title, description, or tag) is required to update",
      });
    }

    // Check ownership
    const checkQuery =
      "SELECT questionid, userid FROM questions WHERE questionid = $1";
    const checkResult = await db.query(checkQuery, [questionid]);
    const question = checkResult.rows[0];

    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: true,
        message: "Question not found",
      });
    }

    if (question.userid !== userid) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: true,
        message: "You are not authorized to update this question",
      });
    }

    // Build dynamic update query
    const fields = [];
    const values = [];
    let idx = 1;

    if (title) {
      fields.push(`title = $${idx++}`);
      values.push(title);
    }
    if (description) {
      fields.push(`description = $${idx++}`);
      values.push(description);
    }
    if (tag !== undefined) {
      fields.push(`tag = $${idx++}`);
      values.push(tag);
    }

    values.push(questionid, userid); // for WHERE clause
    const updateQuery = `
      UPDATE questions
      SET ${fields.join(", ")}
      WHERE questionid = $${idx++} AND userid = $${idx}
      RETURNING *
    `;
    const result = await db.query(updateQuery, values);

    res.status(StatusCodes.OK).json({
      error: false,
      message: "Question updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true,
      message: "Internal server error",
      details: error.message,
    });
  }
};

// DELETE QUESTION
const deleteQuestion = async (req, res) => {
  const { userid } = req.user;
  try {
    const { questionid } = req.params;
    if (!questionid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        message: "Question ID is required",
      });
    }

    // Check ownership
    const checkQuery =
      "SELECT questionid, userid FROM questions WHERE questionid = $1";
    const checkResult = await db.query(checkQuery, [questionid]);
    const question = checkResult.rows[0];

    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: true,
        message: "Question not found",
      });
    }

    if (question.userid !== userid) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: true,
        message: "You are not authorized to delete this question",
      });
    }

    const deleteQuery =
      "DELETE FROM questions WHERE questionid = $1 AND userid = $2 RETURNING *";
    const result = await db.query(deleteQuery, [questionid, userid]);

    res.status(StatusCodes.OK).json({
      error: false,
      message: "Question deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true,
      message: "Internal server error",
      details: error.message,
    });
  }
};

module.exports = {
  postQuestion,
  getAllQuestions,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
};
