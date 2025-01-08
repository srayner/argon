import React, { ReactNode } from "react";
import styles from "./modal.module.css";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  showCloseCross?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  children,
  showCloseCross = false,
}) => {
  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {showCloseCross && (
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
