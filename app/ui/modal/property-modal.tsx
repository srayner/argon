import React from "react";
import styles from "@/components/ui/modal/confirmation.modal.module.css";
import PropertyAddForm from "@/components/form/property-add-form";

interface PropertyModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  categoryId: string;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  categoryId,
}) => {
  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Add New Property</h2>
        <PropertyAddForm
          categoryId={categoryId}
          onSubmitCallback={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default PropertyModal;
