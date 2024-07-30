import Button from "../button/button";
import styles from "./modal.module.css";

export default function Modal({ isVisible, onClose, onConfirm, entityName }) {
  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Are you sure?</h2>
        <p
          className={styles.question}
        >{`Do you really want to delete this ${entityName}?`}</p>
        <div className={styles.buttons}>
          <Button color="secondary" onClick={onClose}>
            No
          </Button>
          <Button onClick={onConfirm}>Yes</Button>
        </div>
      </div>
    </div>
  );
}
