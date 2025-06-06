import React from "react";
import styles from "./setting.module.css";

const ChangeTheme = ({
    isDarkMode,
    setIsDarkMode,
    updateTheme,
}) => {
    const handleClick = (checked) => {
        setIsDarkMode(checked);
        updateTheme(checked);
    };
    
    return (
        <div className={styles.setting_group_type}>
            <h4 className={styles.setting_title_type}>Change Theme</h4>
            <div className={styles.setting_types}>
                <form className={styles.setting_form_inline}>
                    <label
                        htmlFor="themeChange"
                        className={styles.setting_description_type}
                    >
                        Fell boring? change the theme now
                    </label>
                    <div className={styles.checkbox_group}>
                        <input
                            id="themeChange"
                            type="checkbox"
                            className={styles.checkbox}
                            checked={isDarkMode}
                            onChange={(e) => handleClick(e.target.checked)}
                        />
                        <span className={styles.slider}></span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangeTheme;