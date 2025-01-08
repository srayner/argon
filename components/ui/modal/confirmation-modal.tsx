import React from "react";
import Button from "@/app/ui/button/button";
import Modal from "./modal";
import styles from "./confirmation.modal.module.css";

interface ConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityName: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  entityName,
}) => {
  if (!isVisible) return null;

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
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
    </Modal>
  );
};

export default ConfirmationModal;
