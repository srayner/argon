import React, { ReactNode } from "react";
import { HiX } from "react-icons/hi";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  showCloseCross?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  children,
  showCloseCross = false,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[99]"
      onClick={onClose}
    >
      <div
        className="bg-white p-10 pb-5 rounded-md flex flex-col items-center gap-5 min-h-[150px] min-w-[400px] relative z-[100]"
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseCross && (
          <button
            className="
                absolute top-[10px] right-[10px] p-1
                bg-none text-[20px] cursor-pointer text-[#333]
                transition-all duration-200
                hover:bg-gray-200 hover:rounded
            "
            onClick={onClose}
          >
            <HiX size={20} />
          </button>
        )}
          {children}
      </div>
    </div>
  );
};

export default Modal;
