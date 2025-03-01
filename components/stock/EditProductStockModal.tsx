import React from "react";
import Modal from "@/components/ui/modal/Modal";
import EditStockForm from "./EditProductStockForm";
import { Product, Stock } from "@/types/entities";

interface EditProductStockModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  product: Product;
  stock: Stock;
}

const EditProductStockModal: React.FC<EditProductStockModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  product,
  stock,
}) => {
  if (!isVisible) return null;

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <h2>Add New Stock for {product.name}</h2>
      <EditStockForm
        productId={product.id}
        stock={stock}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default EditProductStockModal;
