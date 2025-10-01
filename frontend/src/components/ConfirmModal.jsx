// frontend/src/components/ConfirmModal.jsx

/**
 * A custom modal for confirming actions. It has been upgraded to accept custom text
 * for its buttons and separate handlers for confirm and cancel actions, making it
 * more versatile for different scenarios, like the torpedo targeting choice.
 */
import React from "react";

function ConfirmModal({
  message,
  onConfirm,
  onClose, // Renamed to onClose for clarity, will function as "cancel"
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center animate-fade-in z-50">
      <div className="bg-light-navy p-8 rounded-lg shadow-2xl border-2 border-accent/50 text-center max-w-sm w-full transform animate-bounce-in">
        <h3 className="text-xl text-white mb-6">{message}</h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-slate/50 text-white font-bold py-2 px-8 rounded-md text-lg
                       hover:bg-slate/70 transition-colors duration-300 w-full"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="bg-accent text-navy font-bold py-2 px-8 rounded-md text-lg
                       hover:bg-accent/80 transition-colors duration-300 w-full"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
