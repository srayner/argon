import React from "react";
import styles from "@/components/ui/modal/confirmation.modal.module.css";
import PropertyAddForm from "@/components/form/property-add-form";
import Modal from "@/components/ui/modal/modal";

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
    <Modal isVisible={isVisible} onClose={onClose}>
      <h2>Add New Property</h2>
      <PropertyAddForm
        categoryId={categoryId}
        onSubmitCallback={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default PropertyModal;
