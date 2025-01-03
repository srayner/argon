import Button from "../button/button";
import styles from "./conformation.modal.module.css";
import PropertyAddForm from "@/components/form/property-add-form";

export default function PropertyModal({
  isVisible,
  onClose,
  onSubmit,
  property = {},
}) {
  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Add New Property</h2>
        <PropertyAddForm categoryId={"somemadeupstring"} />
        <div className={styles.buttons}>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Add</Button>
        </div>
      </div>
    </div>
  );
}
