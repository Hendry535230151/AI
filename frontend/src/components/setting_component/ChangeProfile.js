import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./setting.module.css";

const ChangeProfile = ({ userId }) => {
  const [name, setName] = useState("");

  const handleNameChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/users/${userId}/name`,  { firstName: name });
      alert("Name updated!");
      window.location.reload()
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Failed to update name."); 
    }
  };


  return (
    <>
      <div className={styles.setting_group_type} data-aos="fade-up">
        <h4 className={styles.setting_title_type}>Change Name</h4>
        <form onSubmit={handleNameChange} className={styles.setting_form}>
          <label
            htmlFor="changeName"
            className={styles.setting_description_type}
          >
            Want to change name? Please enter your new name
          </label>
          <div className={styles.setting_input_container}>
            <input
              id="changeName"
              type="text"
              className={styles.setting_input}
              placeholder="New name here ..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className={styles.change_request_group}>
              <i
                className={`fa-regular fa-paper-plane ${styles.change_request_icon}`}
              ></i>
            </button>
          </div>
        </form>
      </div>

    </>
  );
};

export default ChangeProfile;
