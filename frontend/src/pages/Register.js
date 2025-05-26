import styles from "../css/Register.module.css";
import ErrorMessage from "../components/ErrorMessage.js";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);
  const [success, setSucess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const registerForm = {
      email,
      password,
      passwordConfirm,
      firstName,
      lastName,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        registerForm
      );

      setSucess("Register Success!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
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
        <div className={styles.main_text_group}>
          {step === 2 && (
            <i
              className={`fa-solid fa-arrow-left ${styles.back_icon}`}
              onClick={() => setStep(1)}
            ></i>
          )}
          <h1 className={styles.main_text}>Ready to join?</h1>
        </div>

        {step === 1 && (
          <form
            className={styles.input_form}
            onSubmit={(e) => {
              e.preventDefault();
              emailRef.current?.focus();
              setStep(2);
            }}
          >
            <label className={styles.input_label} htmlFor="firstName">
              First Name
            </label>
            <input
              className={styles.input_field}
              id="firstName"
              type="text"
              placeholder="Your first name"
              value={firstName}
              ref={firstNameRef}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  lastNameRef.current?.focus();
                }
              }}
            />
            <label className={styles.input_label} htmlFor="lastName">
              Last Name
            </label>
            <input
              className={styles.input_field}
              id="lastName"
              type="text"
              placeholder="Your last name"
              value={lastName}
              ref={lastNameRef}
              onChange={(e) => setLastName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                }
              }}
            />
            <button type="submit" className={styles.input_button}>
              Continue
            </button>
          </form>
        )}

        {step === 2 && (
          <>
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
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    passwordRef.current?.focus();
                  }
                }}
              />
              <label className={styles.input_label} htmlFor="password">
                Password
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
                Password confirm
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
                <button type="submit" className={styles.input_button}>
                  Register
                </button>
              )}
            </form>
          </>
        )}
        <div className={styles.button_group}>
          <button className={styles.button} onClick={() => navigate("/login")}>
            Sign-in
          </button>
          <button className={`${styles.button} ${styles.active}`}>
            Sign-up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
