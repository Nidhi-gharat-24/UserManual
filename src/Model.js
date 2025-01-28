import React from 'react';
import './Model.css'

const Modal = ({ message, onClose }) => {
  return (
    <div className="modal">
  <div className="modal-content">
    <p>{message}</p>
    <div className="modal-footer">
      <button className="close-button" onClick={onClose}>OK</button>
    </div>
  </div>
</div>
  );
};

export default Modal;
