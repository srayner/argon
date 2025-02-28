import React, { ReactNode } from "react";

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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[99]">
      <div className="bg-white p-5 rounded-md flex flex-col items-center gap-5 min-h-[150px] min-w-[400px] relative z-[100]">
        {showCloseCross && (
          <button
            className="absolute top-[10px] right-[10px] bg-none border-none text-[20px] cursor-pointer text-[#333]"
            onClick={onClose}
          >
            X
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
