import React from "react";
import styles from "./setting.module.css";
import ClearSetting from "./ClearSetting";
import ChangeTheme from "./ChangeTheme";
import ChangeProfile from "./ChangeProfile";

const ProfileDescription = ({
    setIsDarkMode,
    setClearDesition,
    setActiveConfirmPanel,
    setIsOpenSetting,
    updateTheme,
    setActiveSetting,
    isActiveSetting,
    handleLogout
}) => {
    return (
        <div className={styles.setting_wrapper}>
            <div className={styles.setting_card}>
                <div className={styles.setting_circle}>
                    <i className={`fa-solid fa-user ${styles.big_profile}`}></i>
                </div>
                <div className={styles.setting_profile}>
                    <h1 className={styles.setting_title}>Hello, Human</h1>
                    <p className={styles.setting_description}>lorem</p>
                </div>
                <div className={styles.setting_container}>
                    <div className={styles.setting_selection}>
                        <ul className={styles.setting_group}>
                            <li onClick={() => setActiveSetting("basic")} className={ isActiveSetting === "basic" ? styles.setting_active : "" }>
                                Basic Setting
                            </li>
                            <li onClick={() => setActiveSetting("theme")} className={ isActiveSetting === "theme" ? styles.setting_active : ""}>
                                Theme Setting
                            </li>
                            <li onClick={() => setActiveSetting("clear")} className={ isActiveSetting === "clear" ? styles.setting_active : "" }>
                                Clear Setting
                            </li>
                            <li onClick={handleLogout}>Logout</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.setting_content}>
                    {isActiveSetting === "basic" && (<ChangeProfile></ChangeProfile>)}
                    {isActiveSetting === "theme" && (<ChangeTheme setIsDarkMode={setIsDarkMode} updateTheme={updateTheme}/>)}
                    {isActiveSetting === "clear" && (<ClearSetting setClearDesition={setClearDesition} setActiveConfirmPanel={setActiveConfirmPanel}/>)}
                </div>
                <i className={`fa-solid fa-xmark ${styles.close_setting_icon}`} onClick={() => setIsOpenSetting(false)}></i>
            </div>
        </div>
    );
}

export default ProfileDescription;