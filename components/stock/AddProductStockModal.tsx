import React from "react";
import Modal from "@/components/ui/modal/Modal";
import AddStockForm from "./AddProductStockForm";
import { Product } from "@/types/entities";

interface AddProductStockModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  product: Product;
}

const AddProductStockModal: React.FC<AddProductStockModalProps> = ({
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

export default AddProductStockModal;
