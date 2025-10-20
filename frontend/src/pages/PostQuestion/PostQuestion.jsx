import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Classes from "./postQuestion.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../utils/axiosInstance";

const PostQuestion = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState({
    title: "",
    description: "",
    tag: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first to post a question.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "/question/post-question",
        {
          title: question.title,
          description: question.description,
          tag: question.tag,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      // Reset form
      setQuestion({
        title: "",
        description: "",
        tag: "",
      });

      // Redirect to home page
      toast.success("Question posted successfully!");

      setTimeout(() => {
        navigate("/home");
      }, 1500); 
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
        navigate("/login");
      } else {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to post question.");
      }
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Toast container for react-toastify */}
      <ToastContainer position="top-center" />

      <div className={Classes.outer_container}>
        <div className={Classes.steps_container}>
          <h2>Steps to write a good question.</h2>
          <ul className={Classes.lists}>
            <li>Summarize your problem in one-line title.</li>
            <li>Describe your problem in more detail.</li>
            <li>Describe what you tried and what you expected to happen.</li>
            <li>Review your question and post it to the site.</li>
          </ul>
        </div>

        <div className={Classes.question_container}>
          <h3 className={Classes.title}>Ask a Public Question</h3>
          <Link to="/home">Go to Question page</Link>

          <form onSubmit={handleSubmit} className={Classes.askform}>
            <input
              type="text"
              placeholder="Title"
              name="title"
              id="question_title"
              value={question.title}
              onChange={handleChange}
            />

            <textarea
              placeholder="Question Description ..."
              name="description"
              id="question_description"
              value={question.description}
              onChange={handleChange}
            />

            <input
              type="text"
              placeholder="Tag (optional)"
              name="tag"
              value={question.tag}
              onChange={handleChange}
            />

            {error && <p className={Classes.error}>{error}</p>}

            <button type="submit" className={Classes.askBtn} disabled={loading}>
              {loading ? "Posting..." : "Post Your Question"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PostQuestion;
