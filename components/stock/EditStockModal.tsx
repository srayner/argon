import React from "react";
import Modal from "@/components/ui/modal/modal";
import EditStockForm from "./EditStockForm";
import { Product, Stock } from "@/types/entities";

interface EditStockModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  product: Product;
  stock: Stock;
}

const EditStockModal: React.FC<EditStockModalProps> = ({
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

export default EditStockModal;
