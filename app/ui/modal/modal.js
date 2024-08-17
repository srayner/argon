export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full z-50 p-6">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
