import styles from "./detail.module.css";

export function DetailList({ children }) {
  return <dl className={styles.dl}>{children}</dl>;
}

export function DetailRow({ title, value }) {
  return (
    <div className={styles.row}>
      <dt className={styles.dt}>{title}</dt>
      <dd className={styles.dd}>{value}</dd>
    </div>
  );
}
