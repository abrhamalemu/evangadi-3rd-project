import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import Layout from "../../components/Layout/Layout";
import classes from "./Login.module.css";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Destructure form data for cleaner code
  const { email, password } = formData;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Store user data in localStorage
  const storeUserData = (responseData) => {
    const { token, data: userData } = responseData;
    // Store token and user data
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }
    
    setLoading(true);
    
    try {
      const { data } = await axios.post("/user/login", { email, password });
      console.log("Login response:", data);

      // Destructure the response
      const { token, message, error } = data;

      if (token) {
        // Store user data using destructured values
        storeUserData(data);
        toast.success(message || "Login Successful");
        navigate("/home", { replace: true });
      } else {
        toast.error(message || error || "Login failed");
      }
    } catch (error) {
      // Destructure error response
      const { response } = error;
      const errorMessage = response?.data?.error || "Server error";
      console.log("Login error:", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className={classes.auth_page}>
        <div className={classes.bg_shape}></div>
        <section className={classes.auth_grid}>
          {/* Login Card */}
          <div className={classes.auth_card}>
            <h2>Login your account</h2>
            <p className={classes.sub}>
              Don't have an account?{" "}
              <Link to={"/register"}>Create a new account</Link>
            </p>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className={classes.form_row}>
                <input
                  className={classes.input}
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              
              {/* Password */}
              <div className={`${classes.form_row} ${classes.input_with_icon}`}>
                <input
                  className={classes.input}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={handleChange}
                  disabled={loading}
                />

                <button
                  type="button"
                  className={classes.icon_btn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={classes.eye_icon}
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={classes.eye_icon}
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8s4-8-11-8a10.94 10.94 0 0 1 7.94 11.06" />
                      <path d="M1 1l22 22" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                className={classes.btn}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Submit"}
              </button>

              <div className={classes.alt_link}>
                <Link to={"/register"}>Create an account?</Link>
              </div>
            </form>
          </div>

          {/* Info Side */}
          <aside className={classes.info}>
            <small>About</small>
            <h3>Evangadi Networks Q&amp;A</h3>
            <p>
              Evangadi Networks Q&A is a place to connect, learn, and grow.
              Whether you're asking questions or sharing answers, you're part of
              a community that values knowledge and collaboration.
            </p>
            <button className={classes.cta}>HOW IT WORKS</button>
          </aside>
        </section>
      </main>
    </Layout>
  );
};

export default Login;