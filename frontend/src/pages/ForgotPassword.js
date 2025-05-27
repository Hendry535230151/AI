import styles from "../css/Login.module.css";
import React, { useEffect, useState } from "react";
import ErrorMessage from "../components/ErrorMessage.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../utils/auth.js";

function ForgotPassword() {
  const isAuthenticated = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSucess] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const resetForm = { email };

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/request-reset-password",
        resetForm
      );
      console.log("Request sent successful:", response.data);

      setSucess("Please check your email to reset your password!");
      setIsLoading(false);
      setError(false);
    } catch (err) {
      setTimeout(() => {
        setIsLoading(false);
        if (err.response) {
          setError(err.response.data.message);
        } else if (err.request) {
          setError("No response from server.");
        } else {
          setError(err.message);
        }
      }, 3000);
    }
  };

  return (
    <div className={styles.main_container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>AInizer</h1>
      </header>
      <div className={styles.card_container}>
        <h1 className={styles.main_text}>Forgot?</h1>

        <form onSubmit={handleSubmit} className={styles.input_form}>
          <label className={styles.input_label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input_field}
            id="email"
            type="text"
            placeholder="Input email here..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error ? (
            <>
              <span className={styles.error_message}>
                <i
                  className={`${styles.error_icon} fa-solid fa-circle-exclamation`}
                ></i>
                {error}
              </span>
            </>
          ) : (
            <></>
          )}

          {success ? (
            <span className={styles.success_message}>
              <i
                className={`${styles.success_icon} fa-solid fa-circle-check`}
              ></i>
              {success}
            </span>
          ) : null}

          {isLoading ? (
            <div className={styles.input_button}>
              <div className={styles.spinner}></div>
            </div>
          ) : (
            <button
              type="submit"
              className={styles.input_button}
              disabled={isLoading}
            >
              Reset
            </button>
          )}
        </form>

        <span className={styles.sub_text}>
          Back to login?{" "}
          <a
            className={styles.forgot_password}
            onClick={() => navigate("/login")}
          >
            Login{" "}
          </a>
        </span>

        <div className={styles.button_group}>
          <button className={`${styles.button} ${styles.active}`}>
            Sign-in
          </button>
          <button
            className={styles.button}
            onClick={() => navigate("/register")}
            disabled={isLoading}
          >
            Sign-up
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
