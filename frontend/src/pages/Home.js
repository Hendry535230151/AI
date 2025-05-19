import styles from '../css/Home.module.css';

function Home() {
    return (
        <div className={styles.container}>
            <div className={styles.max_navbar}> 
                <header className={styles.navbar}>
                    <div className={styles.logo}>AInizer</div>
                    <div className={styles.button_containers}>
                        <button className={styles.button}>Sign-in</button>
                        <button className={styles.button}>Sign-up</button>
                    </div>
                </header>
            </div>

            <div className={styles.hero}>
                <div className={styles.hero_wrapper}>
                    <img className={styles.hero_image} src="Main_image.png" alt="Hero visual" />
                    <div className={styles.hero_text}>
                        <h1 className={styles.hero_main_text}>[~]$ AInizer</h1>
                        <p className={styles.hero_description}>
                            It's time to work. Behind the scenes, an unseen intelligence ensures every piece of data is precisely stored and effortlessly retrieved. Always present, always ready—bringing order to information when it matters most.
                        </p>
                        <button className={styles.hero_button}>Get started</button>
                    </div>
                </div>
            </div>

            <div className={styles.features}>
                <div className={styles.feature_card}>
                    <h3 className={styles.sub_text}>AI</h3>
                    <p className={styles.description_text}>
                        Experience seamless interaction with AI—chat, collaborate, and let it assist you in managing your files effortlessly.
                    </p>
                </div>
                <div className={styles.feature_card}>
                    <h3 className={styles.sub_text}>Database</h3>
                    <p className={styles.description_text}>
                        Reliable and secure data storage solutions to keep your information organized and accessible anytime.
                    </p>
                </div>
                <div className={styles.feature_card}>
                    <h3 className={styles.sub_text}>UI</h3>
                    <p className={styles.description_text}>
                        Elevate your digital experience with our intuitive, elegant, and user-centric UI/UX design.
                    </p>
                </div>
            </div>
            
            <div className={styles.custom_section}>
                <div className={styles.custom_row}>
                    <div className={styles.text_box}>
                        <h2 className={styles.title}>Human 1</h2>
                        <p className={styles.paragraph}>
                            Designers use random text to fill spaces in a layout or design to see how the final product will look once the actual content is added.
                        </p>
                    </div>
                    <img src="icon1.png" alt="Icon 1" className={styles.icon_box} />
                </div>

                <div className={styles.custom_row}>
                    <img src="icon2.png" alt="Icon 2" className={styles.icon_box} />
                    <div className={styles.text_box}>
                        <h2 className={styles.title}>Human 2</h2>
                        <p className={styles.paragraph}>
                            Designers use random text to fill spaces in a layout or design to see how the final product will look once the actual content is added.
                        </p>
                    </div>
                </div>
            </div>
            <div className={styles.features_section}>
                <h2 className={styles.features_title}>Feature & Benefits</h2>
                
                <div className={styles.features_grid}>
                    <div className={styles.feature_benefit_card}>
                        <div className={styles.feature_icon}></div>
                        <p className={styles.feature_text}>
                            Designers use <span className={styles.highlight}>random text</span> to fill spaces in a layout or design to see how the final product will look once the actual content is added. This helps in visualizing the design without getting distracted by the actual content.
                        </p>
                    </div>

                    <div className={styles.feature_benefit_card}>
                        <div className={styles.feature_icon}></div>
                        <p className={styles.feature_text}>
                            Designers use <span className={styles.highlight}>random text</span> to fill spaces in a layout or design to see how the final product will look once the actual content is added. This helps in visualizing the design without getting distracted by the actual content.
                        </p>
                    </div>

                    <div className={styles.feature_benefit_card}>
                        <div className={styles.feature_icon}></div>
                        <p className={styles.feature_text}>
                            Designers use <span className={styles.highlight}>random text</span> to fill spaces in a layout or design to see how the final product will look once the actual content is added. This helps in visualizing the design without getting distracted by the actual content.
                        </p>
                    </div>

                    <div className={styles.feature_benefit_card}>
                        <div className={styles.feature_icon}></div>
                        <p className={styles.feature_text}>
                            Designers use <span className={styles.highlight}>random text</span> to fill spaces in a layout or design to see how the final product will look once the actual content is added. This helps in visualizing the design without getting distracted by the actual content.
                        </p>
                    </div>

                    <div className={styles.feature_benefit_card}>
                        <div className={styles.feature_icon}></div>
                        <p className={styles.feature_text}>
                            Designers use <span className={styles.highlight}>random text</span> to fill spaces in a layout or design to see how the final product will look once the actual content is added. This helps in visualizing the design without getting distracted by the actual content.
                        </p>
                    </div>

                    <div className={styles.feature_benefit_card}>
                        <div className={styles.feature_icon}></div>
                        <p className={styles.feature_text}>
                            Designers use <span className={styles.highlight}>random text</span> to fill spaces in a layout or design to see how the final product will look once the actual content is added. This helps in visualizing the design without getting distracted by the actual content.
                        </p>
                    </div>
                </div>
            </div>
            <div className={styles.auth_card}>
            <h3 className={styles.subs_text}>It's Time To Work</h3>
            
                <div className={styles.button_container}>
                    <button className={styles.auth_button}>
                    <span className={styles.icon}>📝</span>
                    Sign-up
                    </button>

                    <button className={styles.auth_button}>
                    <span className={styles.icon}>👤➕</span>
                    Sign-in
                    </button>
                </div>
            </div>
                
        </div>
        
    );
}

export default Home;
