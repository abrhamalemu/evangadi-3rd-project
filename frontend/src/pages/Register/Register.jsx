import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import styles from "./register.module.css";
import axiosBase from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const Register = () => {
  const firstnameDom = useRef();
  const lastnameDom = useRef();
  const emailDom = useRef();
  const usernameDom = useRef();
  const passwordDom = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword((s) => !s);

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      username: usernameDom.current.value,
      firstname: firstnameDom.current.value,
      lastname: lastnameDom.current.value,
      email: emailDom.current.value,
      password: passwordDom.current.value,
    };

    console.log("Submitting registration with:", payload);

    try {
      const res = await axiosBase.post("/user/register", payload);
      localStorage.setItem("token", res.data.token);
      console.log("Registration successful:", res.data);
      toast.success(`${res.data.message} Please login`);
      navigate("/login");
    } catch (error) {
      console.log(
        "Registration failed:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data.error ||
          error.response?.data.message ||
          error.message
      );
    }
  }

  return (
    <Layout>
      <section className={styles.container}>
        <div className={styles.card}>
          <div className={styles.left}>
            <h2 className={styles.title}>Join the network</h2>

            <p className={styles.topSignin}>
              Already have an account?{" "}
              <Link to={"/login"} className={styles.orangeLink}>
                Sign in
              </Link>
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                className={styles.input}
                ref={emailDom}
                required
              />

              <div className={styles.row}>
                <input
                  type="text"
                  placeholder="First Name"
                  className={`${styles.input} ${styles.half}`}
                  ref={firstnameDom}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className={`${styles.input} ${styles.half}`}
                  ref={lastnameDom}
                  required
                />
              </div>

              <input
                type="text"
                placeholder="User Name"
                className={styles.input}
                ref={usernameDom}
                required
              />

              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`${styles.input} ${styles.passwordInput}`}
                  ref={passwordDom}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className={styles.pwToggle}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    /* eye-off (simple svg) */
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 3l18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.58 10.58A3 3 0 0113.42 13.42"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.88 5.25C11.29 4.96 12.78 5 14.25 5.75c3 1.4 5.25 4.75 5.25 6.75 0 1-.7 2.8-2.47 4.69"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.6"
                      />
                    </svg>
                  ) : (
                    /* eye (simple svg) */
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <button type="submit" className={styles.button}>
                Agree and Join
              </button>

              <p className={styles.terms}>
                I agree to the{" "}
                <a href="/privacy" className={styles.orangeLink}>
                  privacy policy
                </a>{" "}
                and{" "}
                <a href="/terms" className={styles.orangeLink}>
                  terms of service
                </a>
                .
              </p>

              <p className={styles.bottomSignin}>
                Already have an account?{" "}
                <Link to={"/login"} className={styles.orangeLink}>
                  Sign In
                </Link>
              </p>
            </form>
          </div>

          <div className={styles.right}>
            <h3 className={styles.aboutLabel}>About</h3>
            <h2 className={styles.brand}>Evangadi Networks Q&A</h2>
            <p className={styles.aboutText}>
              Evangadi Networks Q&A is a place to connect, learn, and grow.
              Whether you're asking questions or sharing answers, you're part of
              a community that values knowledge and collaboration.
            </p>
            <button className={styles.howItWorks}>HOW IT WORKS</button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Register;
