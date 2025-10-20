import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import classes from "./answerDetail.module.css";
import { FaRegUserCircle } from "react-icons/fa";

const AnswersDetail = ({ questionid }) => {
  const [answers, setAnswers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const { data } = await axios.get(`/answer/get-answer/${questionid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAnswers(data?.answers);
      } catch (error) {
        console.log(error.response.data.msg || error.response.data.error);
        alert(error.response.data.msg || error.response.data.error);
      }
    };
    fetchAnswers();
  }, []);

  console.log(answers);
  return (
    <>
      {answers.length === 0 ? (
        <h1 style={{textAlign:'center',marginTop:'20px'}}>No answer available for this question yet</h1>
      ) : (
        <div className={classes.answersContainer}>
          <div className={classes.communityContainer}>
            <h2>Answer From The Community</h2>
            <div>
              {answers?.map((answer) => (
                <div key={answer.answerid} className={classes.answerRow}>
                  <div className={classes.profile}>
                    <FaRegUserCircle className={classes.avatar} />
                    <p className={classes.username}>{answer.username}</p>
                  </div>
                  <p className={classes.answer}>{answer.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnswersDetail;
