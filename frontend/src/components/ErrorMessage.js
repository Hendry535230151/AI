import styles from './ErrorMessage.module.css';

function ErrorMessage({ message, setMessage  }) {
    if (!message) return null;

    return (
        <div className={styles.error_container}>
            <div className={styles.error_title}>
                <span>Error</span>
                <i class="fa-solid fa-xmark" onClick={() => setMessage('')}></i>
            </div>
            <div className={styles.error_description}>
                { message }
            </div>
        </div>
    );
}

export default ErrorMessage;
