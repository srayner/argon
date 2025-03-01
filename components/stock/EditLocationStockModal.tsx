import React from "react";
import Modal from "@/components/ui/modal/Modal";
import EditStockForm from "./EditLocationStockForm";
import { Location, Stock } from "@/types/entities";

interface EditLocationStockModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  location: Location;
  stock: Stock;
}

const EditLocationStockModal: React.FC<EditLocationStockModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  location,
  stock,
}) => {
  if (!isVisible) return null;

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <h2>Add New Stock for {location.name}</h2>
      <EditStockForm
        locationId={location.id}
        stock={stock}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default EditLocationStockModal;
