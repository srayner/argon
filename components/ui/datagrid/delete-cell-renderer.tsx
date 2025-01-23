import React from "react";
import { MdDelete } from "react-icons/md";

interface DeleteCellRendererProps {
  node: any; // ag-Grid row node
  api: any; // ag-Grid API for operations like applyTransaction
  onDelete: (rowData: any) => void;
}

const DeleteCellRenderer: React.FC<DeleteCellRendererProps> = ({
  node,
  api,
  onDelete,
}) => {
  const handleDelete = async () => {
    try {
      await onDelete(node.data);
      api.applyTransaction({ remove: [node.data] });
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      style={{ border: "none", background: "transparent" }}
    >
      <MdDelete size={20} />
    </button>
  );
};

export default DeleteCellRenderer;
