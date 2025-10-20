import Layout from "../../components/Layout/Layout";
import styles from "./Home.module.css";
import { FaChevronRight } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import axios from "../../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Router";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 7;
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  const handleAskQuestion = () => {
    navigate("/post-question");
  };

  // Fetch all questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        setLoading(true);
        const response = await axios.get("/question/all-questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);
        setQuestions(response.data.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // ✅ Filter questions by tag (case-insensitive)
  const filteredQuestions = questions.filter((q) =>
    q.tag?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  // Reset page when search changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className={styles.homeBody}>
        {/* Top Section */}
        <div className={styles.topSection}>
          <button className={styles.askBtn} onClick={handleAskQuestion}>
            Ask Question
          </button>
          <button className={styles.askBtn}>
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to={"/ask-ai"}
            >
              Ask Gemini
            </Link>
          </button>
          <h3>
            Welcome: <span className={styles.username}>{user.username}</span>
          </h3>
        </div>

        {/* 🔍 Search Box */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by tag..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchBox}
          />
        </div>

        {/* Question List */}
        <section className={styles.questionSection}>
          <h2>Questions</h2>

          {loading ? (
            <p className={styles.loading}>Loading questions...</p>
          ) : currentQuestions.length === 0 ? (
            <p className={styles.empty}>No questions found.</p>
          ) : (
            currentQuestions.map((q, i) => (
              <Link
                onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
                to={`/answers/${q.questionid}`}
                key={i}
                className={styles.questionCard}
              >
                <div className={styles.userInfo}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    alt="user"
                    className={styles.avatar}
                  />
                  <span className={styles.username}>{q.username}</span>
                </div>

                <div className={styles.questionContent}>
                  <p className={styles.questionText}>{q.title}</p>
                  {q.tag && <p className={styles.tagText}>#{q.tag}</p>}
                </div>

                <FaChevronRight className={styles.arrowIcon} />
              </Link>
            ))
          )}

          {/* ✅ Pagination Controls */}
          {filteredQuestions.length > questionsPerPage && (
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Home;
