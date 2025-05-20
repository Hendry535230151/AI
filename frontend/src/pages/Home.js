import styles from '../css/Home.module.css';

function Home() {
    return (
        <div className={styles.container}>
            <div className={styles.max_navbar}> 
                <header className={styles.navbar}>
                    <div className={styles.logo}>AInizer</div>
                    <div className={styles.button_container}>
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
        </div>
    );
}

export default Home;
