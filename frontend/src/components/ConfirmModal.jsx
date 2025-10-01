import React from "react";

function ConfirmModal({ message, onConfirm, onClose }) {
  return (
    // Semi-transparent background overlay
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center animate-fade-in z-50">
      {/* The main modal window */}
      <div className="bg-light-navy p-8 rounded-lg shadow-2xl border-2 border-accent/50 text-center max-w-sm w-full transform animate-bounce-in">
        <h3 className="text-xl text-white mb-6">{message}</h3>

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-slate/50 text-white font-bold py-2 px-8 rounded-md text-lg
                           hover:bg-slate/70 transition-colors duration-300 w-full"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-accent text-navy font-bold py-2 px-8 rounded-md text-lg
                           hover:bg-accent/80 transition-colors duration-300 w-full"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
