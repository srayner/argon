import React from "react";
import Modal from "@/components/ui/modal/Modal";
import AddLocationStockForm from "./AddLocationStockForm";
import { Location } from "@/types/entities";

interface AddLocationStockModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  location: Location;
}

const AddLocationStockModal: React.FC<AddLocationStockModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  location,
}) => {
  if (!isVisible) return null;

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <h2>Add New Stock for {location.name}</h2>
      <AddLocationStockForm
        locationId={location.id}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default AddLocationStockModal;
