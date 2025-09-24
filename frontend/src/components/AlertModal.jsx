import React from 'react';

/**
 * A custom, styled alert modal to replace the default browser alert.
 * It provides a consistent theme for all in-game notifications,
 * creating a more immersive user experience.
 */
function AlertModal({ message, onClose }) {
  return (
    // This is the semi-transparent background overlay.
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center animate-fade-in z-50">
      
      {/* This is the main modal window. */}
      <div className="bg-light-navy p-8 rounded-lg shadow-2xl border-2 border-accent/50 text-center max-w-sm w-full transform animate-bounce-in">
        
        {/* The message content. */}
        <h3 className="text-xl text-white mb-6">
          {message}
        </h3>
        
        {/* The confirmation button. */}
        <button
          onClick={onClose}
          className="bg-accent text-navy font-bold py-2 px-8 rounded-md text-lg
                     hover:bg-accent/80 transition-colors duration-300 w-full"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default AlertModal;