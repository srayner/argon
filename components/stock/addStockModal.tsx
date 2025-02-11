import React from "react";
import Modal from "@/components/ui/modal/modal";
import AddStockForm from "./addStockForm";
import { Product } from "@/types/entities";

interface PropertyModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  product: Product;
}

const AddStockModal: React.FC<PropertyModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  product,
}) => {
  if (!isVisible) return null;

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <h2>Add New Stock for {product.name}</h2>
      <AddStockForm
        productId={product.id}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default AddStockModal;
