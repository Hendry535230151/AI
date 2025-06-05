import React from "react";
import styles from "./setting.module.css";

const ChangeProfile = ({

}) => {
    const handleClick = () => {

    };

    return (
        <>
            <div className={styles.setting_group_type}>
                <h4 className={styles.setting_title_type}>Change Name</h4>
                <div className={styles.setting_types}>
                    <form className={styles.setting_form}>
                        <label htmlFor="changeName" className={styles.setting_description_type}>
                            Want to change name? Please enter your new name
                        </label>
                        <div className={styles.setting_input_container}>
                            <input id="changeName" type="text" className={styles.setting_input} placeholder="New name here ..."></input>
                            <button type="submit" className={styles.change_request_group}>
                                <i className={`fa-regular fa-paper-plane ${styles.change_request_icon}`}></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className={styles.setting_group_type}>
                <h4 className={styles.setting_title_type}>Change Description</h4>
                <form className={styles.setting_form}>
                    <label htmlFor="changeDescription" className={styles.setting_description_type}>
                        Tell everybody that you want to let them know
                    </label>
                    <div className={styles.setting_input_container}>
                        <textarea id="changeName" type="text" className={styles.setting_textarea} placeholder="New name here ..."></textarea>
                        <button type="submit" className={styles.description_button}>
                            <i className={`fa-regular fa-paper-plane ${styles.change_request_icon}`}></i>
                        </button>
                    </div>
                </form>
            </div>
            <div className={styles.setting_group_type}>
                <h4 className={styles.setting_titile_type}>
                    Change Password
                </h4>
                <p className={styles.setting_description_type}>
                    This is basic setting
                </p>
            </div>
        </>
    )
}

export default ChangeProfile;