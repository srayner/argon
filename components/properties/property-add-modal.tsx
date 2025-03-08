import React from "react";
import PropertyAddForm from "@/components/properties/PropertyAddForm";
import Modal from "@/components/ui/modal/Modal";

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
