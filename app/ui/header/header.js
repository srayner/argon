import styles from "./header.module.css";

export default function header({ children }) {
  return <h1 className={styles.header}>{children}</h1>;
}
