import React from "react";
import styles from "./setting.module.css";

const ClearSetting = ({
    setClearDesition,
    setActiveConfirmPanel
}) => {
    const handleClick = (type) => {
        setClearDesition(type);
        setActiveConfirmPanel(true);
    };

    return (
        <div className={styles.setting_group_type}>
            <h4 className={styles.setting_title_type}>Clear Stuffs</h4>
            <div className={styles.setting_types}>
                <form className={styles.setting_form}>
                    <div className={styles.setting_form_inline}>
                        <label htmlFor="clearHistory" className={styles.setting_description_type}>
                        Clear all history data
                        </label>
                        <div className={styles.button_input_group}>
                            <button type="button" className={styles.clear_button} onClick={() => handleClick("history")}>
                                <span className={styles.clear_text}>clear history</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.setting_form_inline}>
                        <label htmlFor="clearDirectory" className={styles.setting_description_type}>
                        Clear all directory data
                        </label>
                        <div className={styles.button_input_group}>
                            <button id="clearDirectory" type="button" className={styles.clear_button} onClick={() => handleClick("directory")}>
                                <span className={styles.clear_text}>clear directory</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.setting_form_inline}>
                        <label htmlFor="clearFile" className={styles.setting_description_type} >
                            Clear all file data
                        </label>
                        <div className={styles.button_input_group}>
                            <button id="clearFile" type="button" className={styles.clear_button} onClick={() => handleClick("file")}>
                                <span className={styles.clear_text}>clear file</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ClearSetting;