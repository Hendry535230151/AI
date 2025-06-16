import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./setting.module.css";

const ChangeProfile = ({ userId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleNameChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/users/${userId}/name`, { name });
      alert("Name updated!");
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Failed to update name.");
    }
  };

  const handleDescriptionChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/users/${userId}/description`, {
        description,
      });
      alert("Description updated!");
    } catch (error) {
      console.error("Error updating description:", error);
      alert("Failed to update description.");
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

      <div
        className={styles.setting_group_type}
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <h4 className={styles.setting_title_type}>Change Description</h4>
        <form
          onSubmit={handleDescriptionChange}
          className={styles.setting_form}
        >
          <label
            htmlFor="changeDescription"
            className={styles.setting_description_type}
          >
            Tell everybody that you want to let them know
          </label>
          <div className={styles.setting_input_container}>
            <textarea
              id="changeDescription"
              className={styles.setting_textarea}
              placeholder="New description here ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button type="submit" className={styles.description_button}>
              <i
                className={`fa-regular fa-paper-plane ${styles.change_request_icon}`}
              ></i>
            </button>
          </div>
        </form>
      </div>

      <div
        className={styles.setting_group_type}
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <h4 className={styles.setting_title_type}>Change Password</h4>
        <p className={styles.setting_description_type}>This is basic setting</p>
      </div>
    </>
  );
};

export default ChangeProfile;
