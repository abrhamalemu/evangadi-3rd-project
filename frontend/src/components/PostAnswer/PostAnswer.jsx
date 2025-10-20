import Layout from "../Layout/Layout";
import classes from "./PostAnswer.module.css";
import { useRef, useState } from "react";
import axios from "../../utils/axiosInstance";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostAnswer = ({ questionid }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const answer = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const answerValue = answer.current.value.trim();
    setLoading(true);
    if (!answerValue) {
      setError(true);
      setLoading(false);
      return;
    } else {
      setError(false);
    }
    const token =localStorage.getItem('token')
      
    try {
      const res = await axios.post(
        "/answer/post-answer",
        {
          questionid: questionid,
          answer: answerValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
       toast.success("Answer posted successfully!", res.data);

      answer.current.value = "";
    } catch (error) {
      alert(error.response || error.message);
      toast.error("Failed to post answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className={classes.answer_container}>
        <h2 className={classes.answer_title}>Answer The Top Question</h2>
        <a href="/" className={classes.question_link}>
          Go to Question page
        </a>
        <textarea
          ref={answer}
          className={`${classes.answer_textarea} ${error ? classes.error : ""}`}
          placeholder="Your Answer..."
        ></textarea>
        {error && (
          <small className={classes.error_text}>Please provide an answer</small>
        )}
        <button onClick={handleSubmit} className={classes.submit_btn}>
          {loading ? <ClipLoader size={18} color="#fff" /> : "Post Your Answer"}
        </button>
      </div>
      <ToastContainer position="top-center" autoClose={1000} />
    </>
  );
};

export default PostAnswer;
