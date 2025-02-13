import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";

interface ActionCellRendererProps {
  node: any; // ag-Grid row node
  api: any; // ag-Grid API for operations like applyTransaction
  onDelete: (rowData: any) => void;
  onEdit: (rowData: any) => void;
}

const ActionCellRenderer: React.FC<ActionCellRendererProps> = ({
  node,
  api,
  onDelete,
  onEdit,
}) => {
  const handleDelete = async () => {
    try {
      await onDelete(node.data);
      api.applyTransaction({ remove: [node.data] });
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await onEdit(node.data);
      //api.applyTransaction({ remove: [node.data] }); //what to do here?
    } catch (error) {
      console.error("Error editing row:", error);
    }
  };

  return (
    <>
      <button
        onClick={handleEdit}
        style={{ border: "none", background: "transparent" }}
      >
        <MdEdit className="text-blue-400 hover:text-blue-600" size={20} />
      </button>
      <button
        onClick={handleDelete}
        style={{ border: "none", background: "transparent" }}
      >
        <MdDelete className="text-red-400 hover:text-red-600" size={20} />
      </button>
    </>
  );
};

export default ActionCellRenderer;
