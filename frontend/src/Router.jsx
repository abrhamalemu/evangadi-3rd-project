import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import PostQuestion from "./pages/PostQuestion/PostQuestion";
import Answers from "./pages/Answers/Answers";
import { createContext, useEffect, useState } from "react";
import axios from "./utils/axiosInstance.js";
import { MoonLoader } from "react-spinners";
import AskAI from "./pages/AskAi/AskAi.jsx";
import AiAnswers from "./pages/AiAnswers/AiAnswers.jsx";

export const AppContext = createContext();

const Router = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }
        setLoading(true);

        const { data } = await axios.get("/user/check", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data);
        setLoading(false);
      } catch (error) {
        const message = error?.response?.data?.error;

        // Handle expired or invalid token
        if (
          message === "Token expired" ||
          message === "Invalid authentication"
        ) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Unexpected error:", message);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);
  // console.log(user)

  return (
    <AppContext value={{ user }}>
      {loading ? (
        <MoonLoader />
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/post-question" element={<PostQuestion />} />
          <Route path="/answers/:questionid" element={<Answers />} />
          <Route path="/ask-ai" element={<AskAI />} />
          <Route path="/ai-history" element={<AiAnswers />} />
        </Routes>
      )}
    </AppContext>
  );
};

export default Router;
