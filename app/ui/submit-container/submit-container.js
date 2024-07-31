import styles from "./submit-container.module.css";

export default function SubmitContainer({ children }) {
  return <div className={styles.container}>{children}</div>;
}
