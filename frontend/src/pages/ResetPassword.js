import styles from "../css/Login.module.css";
import React, { useEffect, useState, useRef } from "react";
import ErrorMessage from "../components/ErrorMessage.js";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../utils/auth.js";

function ResetPassword() {
  const isAuthenticated = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSucess] = useState("");
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const resetForm = { password, passwordConfirm };
    console.log(token);

    try {
      const response = await axios.put(
        `http://localhost:3000/auth/reset-password?token=${token}`,
        resetForm
      );
      console.log("Reset successful:", response.data);

      setTimeout(() => {
        setSucess("Reset Success!");
        setError(false);
      }, 5000);

      setTimeout(() => {
        navigate("/login");
      }, 8000);
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
        <h1 className={styles.main_text}>Reset</h1>

        <form onSubmit={handleSubmit} className={styles.input_form}>
          <label className={styles.input_label} htmlFor="password">
            New Password
          </label>
          <input
            className={styles.input_field}
            id="password"
            type="password"
            placeholder="Input password here..."
            value={password}
            ref={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                passwordConfirmRef.current?.focus();
              }
            }}
          />
          <label className={styles.input_label} htmlFor="passwordConf">
            New Password confirm
          </label>
          <input
            className={styles.input_field}
            id="passwordConf"
            type="password"
            placeholder="Input password confirm here..."
            value={passwordConfirm}
            ref={passwordConfirmRef}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
              }
            }}
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
      </div>
    </div>
  );
}

export default ResetPassword;
