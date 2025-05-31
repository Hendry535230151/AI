import styles from "../css/Home.module.css";

function Home() {
  return (
    <div className={styles.container}>
        <div className={styles.hero}>
            <div className={styles.circle_rotate}>
                <p className={styles.hero_icon}>ICON</p>
                <p className={styles.hero_text}>Your File Buddy</p>
            </div>
            <div className={styles.navbar_container}>
                <div className={styles.left_navbar}>
                    <span className={styles.navbar_item}>LOGO</span>
                </div>
                <div className={styles.right_navbar}>
                    <a href="/halaman-lain" className={styles.navbar_item}>Login</a>
                    <a href="/halaman-lain" className={styles.navbar_item}>Register</a>
                </div>
            </div>
        </div>
        <div className={styles.description_group}>
            <div>
                <i className={`fa-solid fa-quote-left ${styles.big_icon}`}></i>
            </div>
            <div>
                <h1 className={styles.description_title}>What is AInizer</h1>
                <p className={styles.description_text}>It's time to work. Behind the scenes, an unseen intelligence ensures every piece of data is precisely stored and effortlessly retrieved. Always present, always ready—bringing order to information when it matters most.</p>
            </div>
        </div>
        <div className={styles.offer_container}>
            <h1 className={styles.offer_title}>What We Offer</h1>
            <p className={styles.offer_description}>Discover the powerful offers designed to elevate your digital journey. From intelligent AI that adapts to your workflow, to secure data management and intuitive design, our suite of tools empowers you to work smarter and stay ahead.</p>
            <div className={styles.offer_group}>
                <div className={styles.offer_card}>
                    <div className={styles.offer_image}>
                        <img src="database.png" className={styles.offer_icon} />
                    </div>
                    <h3 className={styles.sub_text}>AI</h3>
                    <p className={styles.description_text}>Experience seamless interaction wi th AI—chat, collaborate, and let it assist you in managing your files effortlessly.</p>
                </div>
                <div className={styles.offer_card}>
                    <div className={styles.offer_image}>
                        <img src="artificial-intelligence.png" className={styles.offer_icon} />
                    </div>
                    <h3 className={styles.sub_text}>Database</h3>
                    <p className={styles.description_text}> Reliable and secure data storage solutions to keep your information organized and accessible anytime.</p>
                </div>
                <div className={styles.offer_card}>
                    <div className={styles.offer_image}>
                        <img src="web-design.png" className={styles.offer_icon} />
                    </div>
                    <h3 className={styles.sub_text}>UI</h3>
                    <p className={styles.description_text}>Elevate your digital experience with our intuitive, elegant, and user-centric UI/UX design.
                    </p>
                </div>
            </div>
        </div>
        <div className={styles.feature_container}>
            <h1 className={styles.feature_title}>Features That We Have</h1>
            <p className={styles.feature_description}>  Discover a suite of features tailored to meet your needs. From cutting-edge AI that enhances your workflow, to secure databases that keep your data safe, and an intuitive user interface that makes every interaction seamless—everything you need to elevate your experience is here.</p>
            <div className={styles.feature_list}>
                <div className={styles.feature_item}>
                    <p>Organize & group every file effortlessly.</p>
                </div>
                <div className={styles.feature_item}>
                    <p>Easy access to everything you need.</p>
                </div>
                <div className={styles.feature_item}>
                    <p>AI dedicated solely to file organization.</p>
                </div>
                <div className={styles.feature_item}>
                    <p>Securely save everything in our database.</p>
                </div>
                <div className={styles.feature_item}>
                    <p>Drag & drop files with ease.</p>
                </div>
                <div className={styles.feature_item}>
                    <p>Safe and controlled user access.</p>
                </div>
                <div className={styles.feature_item}>
                    <p>Chat with AI for quick assistance.</p>
                </div>
            </div>
        </div>
        <h1 className={styles.video_text}>How To Use</h1>
        <video controls className={styles.video_container}>
            <source src="video-saya.mp4" type="video/mp4"/>
            Your browser does not support the video tag.
        </video>
        <div className={styles.collab_container}>
          <h1 className={styles.collab_title}>Join Our Team</h1>
          <p className={`${styles.collab_description} ${styles.center}`}>Ready to start your journey and create something extraordinary? Join us in a collaborative environment where your ideas can flourish and together we can make a real difference.</p>
          <div className={styles.collab_button_container}>
            <div className={styles.collab_group}>
              <div className={styles.collab_text}>
                <h3 className={styles.collab_description_title}>Ready to Get Started?</h3>
                <p className={styles.collab_description_text}>
                  Already part of our community? Log in to unlock your dashboard, collaborate with other members, and bring your ideas to life. Let’s continue this journey together.
                </p>
                <button className={styles.collab_button}>Login</button>
              </div>
              <div className={styles.collab_image}>

              </div>
            </div>
            <div className={styles.collab_group}>
              <div className={styles.collab_text}>
                <h3 className={styles.collab_description_title}>Join Our Community</h3>
                <p className={styles.collab_description_text}>
                  New here? Register today and be part of an inspiring community where ideas grow and collaborations happen. Take the first step towards your next great project.
                </p>
                <button className={styles.collab_button}>Register</button>
              </div>
              <div className={styles.collab_image}>

              </div>
            </div>
          </div>
        </div>
      {/* <div className={styles.custom_section}>
        <div className={styles.custom_row}>
          <div className={styles.text_box}>
            <h2 className={styles.title}>Human 1</h2>
            <p className={styles.paragraph}>
              Designers use random text to fill spaces in a layout or design to
              see how the final product will look once the actual content is
              added.
            </p>
          </div>
          <img src="/icon1.png" alt="Icon 1" className={styles.icon_box} />
        </div>

        <div className={styles.custom_row}>
          <img src="/icon2.png" alt="Icon 2" className={styles.icon_box} />
          <div className={styles.text_box}>
            <h2 className={styles.title}>Human 2</h2>
            <p className={styles.paragraph}>
              Designers use random text to fill spaces in a layout or design to
              see how the final product will look once the actual content is
              added.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.wave_wrapper}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#0f0f0f"
            fillOpacity="1"
            d="M0,32L0,224L130.9,224L130.9,64L261.8,64L261.8,288L392.7,288L392.7,128L523.6,128L523.6,0L654.5,0L654.5,288L785.5,288L785.5,192L916.4,192L916.4,224L1047.3,224L1047.3,32L1178.2,32L1178.2,160L1309.1,160L1309.1,224L1440,224L1440,320L1309.1,320L1309.1,320L1178.2,320L1178.2,320L1047.3,320L1047.3,320L916.4,320L916.4,320L785.5,320L785.5,320L654.5,320L654.5,320L523.6,320L523.6,320L392.7,320L392.7,320L261.8,320L261.8,320L130.9,320L130.9,320L0,320L0,320Z"
          ></path>
        </svg>
      </div>
      <div className={styles.features_section}>
        <h2 className={styles.features_title}>Feature & Benefits</h2>
        <div className={styles.features_grid}>
          <div className={styles.feature_benefit_card}>
            <div className={styles.feature_icon}></div>
            <p className={styles.feature_text}>
              Designers use{" "}
              <span className={styles.highlight}>random text</span> to fill
              spaces in a layout or design to see how the final product will
              look once the actual content is added. This helps in visualizing
              the design without getting distracted by the actual content.
            </p>
          </div>

          <div className={styles.feature_benefit_card}>
            <div className={styles.feature_icon}></div>
            <p className={styles.feature_text}>
              Designers use{" "}
              <span className={styles.highlight}>random text</span> to fill
              spaces in a layout or design to see how the final product will
              look once the actual content is added. This helps in visualizing
              the design without getting distracted by the actual content.
            </p>
          </div>

          <div className={styles.feature_benefit_card}>
            <div className={styles.feature_icon}></div>
            <p className={styles.feature_text}>
              Designers use{" "}
              <span className={styles.highlight}>random text</span> to fill
              spaces in a layout or design to see how the final product will
              look once the actual content is added. This helps in visualizing
              the design without getting distracted by the actual content.
            </p>
          </div>

          <div className={styles.feature_benefit_card}>
            <div className={styles.feature_icon}></div>
            <p className={styles.feature_text}>
              Designers use{" "}
              <span className={styles.highlight}>random text</span> to fill
              spaces in a layout or design to see how the final product will
              look once the actual content is added. This helps in visualizing
              the design without getting distracted by the actual content.
            </p>
          </div>

          <div className={styles.feature_benefit_card}>
            <div className={styles.feature_icon}></div>
            <p className={styles.feature_text}>
              Designers use{" "}
              <span className={styles.highlight}>random text</span> to fill
              spaces in a layout or design to see how the final product will
              look once the actual content is added. This helps in visualizing
              the design without getting distracted by the actual content.
            </p>
          </div>

          <div className={styles.feature_benefit_card}>
            <div className={styles.feature_icon}></div>
            <p className={styles.feature_text}>
              Designers use{" "}
              <span className={styles.highlight}>random text</span> to fill
              spaces in a layout or design to see how the final product will
              look once the actual content is added. This helps in visualizing
              the design without getting distracted by the actual content.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.wave_wrapper1}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#0f0f0f"
            fillOpacity="1"
            d="M0,32L0,224L130.9,224L130.9,64L261.8,64L261.8,288L392.7,288L392.7,128L523.6,128L523.6,0L654.5,0L654.5,288L785.5,288L785.5,192L916.4,192L916.4,224L1047.3,224L1047.3,32L1178.2,32L1178.2,160L1309.1,160L1309.1,224L1440,224L1440,320L1309.1,320L1309.1,320L1178.2,320L1178.2,320L1047.3,320L1047.3,320L916.4,320L916.4,320L785.5,320L785.5,320L654.5,320L654.5,320L523.6,320L523.6,320L392.7,320L392.7,320L261.8,320L261.8,320L130.9,320L130.9,320L0,320L0,320Z"
          ></path>
        </svg>
      </div>
      <div className={styles.auth_card}>
        <h3 className={styles.subs_text}>It's Time To Work</h3>
        <div className={styles.button_container}>
          <button className={styles.auth_button}>
            <span className={styles.icon}>
              <img src="/pencil.png" alt="Contoh" />
            </span>
            Sign-up
          </button>

          <button className={styles.auth_button}>
            <span className={styles.icon}>
              <img src="/profile.png" alt="Contoh" />
            </span>
            Sign-up
          </button>
        </div>
      </div>*/}
      <footer className={styles.footer_container}>
        <div className={styles.footer_content}>
          <div className={styles.footer_section}>
            <h3 className={styles.footer_title}>Address</h3>
            <p className={styles.footer_description}>
              Fakultas Ilmu Komputer
              <br />
              Universitas XYZ
              <br />
              Jl. Pendidikan No. 123, Blok C<br />
              Kota ABC, Indonesia
            </p>
          </div>

          <div className={styles.footer_section}>
            <h3 className={styles.footer_title}>Contact Us</h3>
            <div className={styles.footer_description}>
              <p>📞 08xxxxxxxxxx</p>
              <p>📧 Someone@example.com</p>
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
