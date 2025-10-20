import { useState } from "react";
import axios from "../../utils/axiosInstance";
import styles from "./askAi.module.css";
import Layout from "../../components/Layout/Layout";
import { Link } from "react-router-dom";

const AskAI = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnswer("");

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "/ai/ask",
        {
          question,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnswer(res.data.answer);
      setQuestion("");
    } catch (err) {
      console.error(err);
      setAnswer("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h2 className={styles.title}>Ask AI 🤖</h2>

        <form onSubmit={handleAsk} className={styles.form}>
          <textarea
            className={styles.textarea}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            required
          />

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </button>
        </form>

        {answer && (
          <div className={styles.output}>
            <h4>AI Answer:</h4>
            <p>{answer}</p>
          </div>
        )}
        <Link
          to={"/ai-history"}
          className={styles.chatHistory}
        >
          <p>See your chat history</p>
        </Link>
      </div>
    </Layout>
  );
};

export default AskAI;
