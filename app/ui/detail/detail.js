import styles from "./detail.module.css";

export function DetailList({ children }) {
  return <dl className={styles.dl}>{children}</dl>;
}

export function DetailRow({ title, value, formatter }) {
  let formattedValue = value;
  if (typeof formatter === "function") {
    formattedValue = formatter(value);
  }

  return (
    <div className={styles.row}>
      <dt className={styles.dt}>{title}</dt>
      <dd className={styles.dd}>{formattedValue}</dd>
    </div>
  );
}
