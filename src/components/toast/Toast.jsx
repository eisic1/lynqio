import { useEffect } from 'react';
import './toast.css';

function Toast({ message, type, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    info: 'bi-info-circle-fill',
    warning: 'bi-exclamation-triangle-fill'
  };

  return (
    <div className={`toast-notification toast-${type}`}>
      <i className={`bi ${icons[type]}`}></i>
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>
        <i className="bi bi-x"></i>
      </button>
    </div>
  );
}

export default Toast;