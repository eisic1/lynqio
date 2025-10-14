import '../styles/ConfirmModal.css';

function ConfirmModal({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) {
  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-modal-icon ${type}`}>
          {type === 'danger' && <i className="bi bi-exclamation-triangle-fill"></i>}
          {type === 'warning' && <i className="bi bi-exclamation-circle-fill"></i>}
          {type === 'info' && <i className="bi bi-info-circle-fill"></i>}
        </div>
        
        <h3>{title}</h3>
        <p>{message}</p>
        
        <div className="confirm-modal-actions">
          <button className="btn-modal-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`btn-modal-confirm ${type}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;