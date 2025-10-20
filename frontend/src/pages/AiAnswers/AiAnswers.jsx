import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance.js";
import { toast } from "react-toastify";
import styles from "./aiAnswer.module.css";
import Layout from "../../components/Layout/Layout.jsx";
import { Link } from "react-router-dom";

const AiAnswers = ({ userId }) => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAiAnswer = async () => {
      try {
        const { data } = await axios.get(`/ai/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(data);
      } catch (error) {
        console.log(error.response.data || error.message);
        toast.error(error.response.data.message);
      }
    };
    fetchAiAnswer();
  }, [userId]);
  console.log(data);

  if (!data || data.length === 0) {
    return (
      <Layout>
        <p className={styles.empty}>No AI answers yet. <Link className={styles.askSomething} to={'/ask-ai'}>Ask something!</Link></p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <h2 className={styles.title}>AI Answers 💡</h2>
        <div className={styles.list}>
          {data.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.question}>
                <strong>Q:</strong> {item.question}
              </div>
              <div className={styles.answer}>
                <strong>A:</strong> {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AiAnswers;
