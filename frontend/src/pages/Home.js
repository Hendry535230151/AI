import { useEffect } from "react";
import styles from "../css/Home.module.css";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.hero} data-aos="fade-up">
        <div className={styles.circle_rotate}>
          <img
            className={styles.hero_image}
            src="Logo_AInizer_Light-removebg-preview.png"
          />
        </div>
        <div className={styles.navbar_container}>
          <div className={styles.left_navbar}>
            <span className={styles.navbar_item}></span>
          </div>
          <div className={styles.right_navbar}>
            <a href="/login" className={styles.navbar_item}>
              Login
            </a>
            <a href="/register" className={styles.navbar_item}>
              Register
            </a>
          </div>
        </div>
      </div>

      <div className={styles.description_group} data-aos="fade-right">
        <div className={styles.quotes_icon}>
          <i className={`fa-solid fa-quote-left ${styles.big_icon}`}></i>
        </div>
        <div className={styles.quotes_text}>
          <h1 className={styles.description_title}>What is AInizer</h1>
          <p className={styles.main_description_text}>
            It's time to work. Behind the scenes, an unseen intelligence ensures
            every piece of data is precisely stored and effortlessly retrieved.
            Always present, always ready—bringing order to information when it
            matters most.
          </p>
        </div>
      </div>

      <div className={styles.offer_container} data-aos="fade-up">
        <h1 className={styles.offer_title}>What We Offer</h1>
        <p className={styles.offer_description}>
          Discover the powerful offers designed to elevate your digital journey...
        </p>
        <div className={styles.offer_group}>
          <div className={styles.offer_card} data-aos="zoom-in" data-aos-delay="100">
            <div className={styles.offer_image}>
              <img src="database.png" className={styles.offer_icon} />
            </div>
            <h3 className={styles.sub_text}>AI</h3>
            <p className={styles.description_text}>
              Experience seamless interaction with AI...
            </p>
          </div>
          <div className={styles.offer_card} data-aos="zoom-in" data-aos-delay="200">
            <div className={styles.offer_image}>
              <img src="artificial-intelligence.png" className={styles.offer_icon} />
            </div>
            <h3 className={styles.sub_text}>Database</h3>
            <p className={styles.description_text}>
              Reliable and secure data storage solutions...
            </p>
          </div>
          <div className={styles.offer_card} data-aos="zoom-in" data-aos-delay="300">
            <div className={styles.offer_image}>
              <img src="web-design.png" className={styles.offer_icon} />
            </div>
            <h3 className={styles.sub_text}>UI</h3>
            <p className={styles.description_text}>
              Elevate your digital experience...
            </p>
          </div>
        </div>
      </div>

      <div className={styles.feature_container} data-aos="fade-left">
        <h1 className={styles.feature_title}>Features That We Have</h1>
        <p className={styles.feature_description}>
          Discover a suite of features tailored to meet your needs...
        </p>
        <div className={styles.feature_list}>
          {[
            "Organize & group every file effortlessly.",
            "Easy access to everything you need.",
            "AI dedicated solely to file organization.",
            "Securely save everything in our database.",
            "Drag & drop files with ease.",
            "Safe and controlled user access.",
            "Chat with AI for quick assistance.",
          ].map((text, index) => (
            <div
              key={index}
              className={styles.feature_item}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>

      <h1 className={styles.video_text} data-aos="fade-up">How To Use</h1>
      <video controls className={styles.video_container} data-aos="zoom-in">
        <source src="video-saya.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className={styles.collab_container} data-aos="fade-up">
        <h1 className={styles.collab_title}>Join Our Team</h1>
        <p className={`${styles.collab_description} ${styles.center}`}>
          Ready to start your journey...
        </p>
        <div className={styles.collab_button_container}>
          {[1, 2].map((_, i) => (
            <div
              key={i}
              className={styles.collab_group}
              data-aos="fade-right"
              data-aos-delay={i * 200}
            >
              <div className={styles.collab_text}>
                <h3 className={styles.collab_description_title}>
                  {i === 0 ? "Ready to Get Started?" : "Join Our Community"}
                </h3>
                <p className={styles.collab_description_text}>
                  {i === 0
                    ? "Already part of our community?... Let’s continue this journey together."
                    : "New here? Register today and be part of an inspiring community..."}
                </p>
                <button
                  onClick={() => navigate(i === 0 ? "/login" : "/register")}
                  className={styles.collab_button}
                >
                  {i === 0 ? "Login" : "Register"}
                </button>
              </div>
              <div className={styles.collab_image}>
                <img src={`icon${i + 1}.png`} alt={`icon${i + 1}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.big_word_container} data-aos="zoom-in">
        <h1 className={styles.big_word}>Join With Us Now</h1>
      </div>

      <footer className={styles.footer_container} data-aos="fade-up">
        <div className={styles.footer_content}>
          <div className={styles.footer_section}>
            <h3 className={styles.footer_title}>Address</h3>
            <p className={styles.footer_description}>
              Fakultas Ilmu Komputer<br />
              Universitas XYZ<br />
              Jl. Pendidikan No. 123, Blok C<br />
              Kota ABC, Indonesia
            </p>
          </div>
          <div className={styles.footer_section}>
            <h3 className={styles.footer_title}>Contact Us</h3>
            <div className={styles.footer_description}>
              <p><i className={`fa-solid fa-phone ${styles.footer_icon}`}></i> 08xxxxxxxxxx</p>
              <p><i className={`fa-solid fa-envelope ${styles.footer_icon}`}></i> Someone@example.com</p>
            </div>
          </div>
          <div className={`${styles.footer_section} ${styles.feedback}`}>
            <h3 className={styles.footer_title}>We'd Love Your Feedback!</h3>
            <p className={styles.footer_description}>Let us know how we can improve</p>
            <div className={styles.footer_input_group}>
              <input type="text" className={styles.footer_input} placeholder="Type something here ..." />
              <button className={styles.footer_button}>Send ➤</button>
            </div>
          </div>
        </div>
        <div className={styles.last_footer}>
          <p className={styles.footer_company}>© 2025 Website. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
