// components/CustomModal.js
import React from 'react';
import Button from '@/components/adminButton';

const CustomModal = ({ show, onClose, title, children, confirmText, onConfirm }) => {
  if (!show) return null;

  return (
    <div className={`modal fade show `} tabIndex="-1" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>關閉</button>
            <Button text={confirmText} onClick={onConfirm} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
