import React, { useState } from 'react';
import './TreeNode.css';
import Modal from './Modal'; // Import the modal component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFilm } from '@fortawesome/free-solid-svg-icons';
 
const TreeNode = ({ node, fileType }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
 
  const handleToggle = () => {
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  };
 
   const handlePlayButtonClick = () => {
    if (node.file_url) {
      if(fileType==='MNL')
      {
      const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(node.file_url)}&embedded=true`;
      window.open(googleDocsUrl, '_blank');
      }
      else if (fileType==='VDO')
      {
        window.open(node.file_url, '_blank');
      }
    }
     else
     {
      setShowModal(true); // Show the modal if no file URL is available
     }
   
  };
 
  const closeModal = () => {
    setShowModal(false); // Close the modal
  };
 
  return (
    <div className="tree-node">
      <div className="node-content">
        {node.ChildTaken && node.ChildTaken.length > 0 && (
          <button onClick={handleToggle}>
            {isExpanded ? '−' : '+'}
          </button>
        )}
        {node.CChildTaken && node.CChildTaken.length > 0 && (
          <button onClick={handleToggle}>
            {isExpanded ? '−' : '+'}
          </button>
        )}
        <span>{node.topic_name}</span>
        <div onClick={handlePlayButtonClick} className="play-icon" style={{ marginLeft: '10px', cursor: 'pointer' }}>
          {fileType === 'MNL' ? (
            <FontAwesomeIcon icon={faFilePdf} />
          ) : (
            <FontAwesomeIcon icon={faFilm} />
          )}
        </div>
      </div>
      {isExpanded && node.ChildTaken && node.ChildTaken.length > 0 && (
        <div className="child-taken">
          {node.ChildTaken.map((child) => (
            <TreeNode key={child.usr_train_dtl_seq} node={child} fileType={fileType} />
          ))}
        </div>
      )}
      {isExpanded && node.CChildTaken && node.CChildTaken.length > 0 && (
        <div className="cchild-taken">
          {node.CChildTaken.map((cChild) => (
            <TreeNode key={cChild.usr_train_dtl_seq} node={cChild} fileType={fileType} />
          ))}
        </div>
      )}
      {showModal && (
        <Modal message="No file available for this topic." onClose={closeModal} />
      )}
    </div>
  );
};
 
export default TreeNode;