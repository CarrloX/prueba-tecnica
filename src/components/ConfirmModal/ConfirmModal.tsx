import React from "react";
import "./ConfirmModal.css";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={handleBackdropClick}>
      <div className="confirm-modal-container" role="dialog" aria-modal="true">
        <div className="confirm-modal-header">
          <h2 className="confirm-modal-title">{title}</h2>
          <button
            className="confirm-modal-close-button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="#333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="confirm-modal-body">
          <p className="confirm-modal-message">{message}</p>
        </div>

        <div className="confirm-modal-footer">
          <button className="btn btn-cancel" onClick={handleCancel}>
            {cancelText}
          </button>
          <button className="btn btn-delete" onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
