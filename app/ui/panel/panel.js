import styles from "./panel.module.css";

export default function Panel({ title, children }) {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.contents}>{children}</div>
    </div>
  );
}
