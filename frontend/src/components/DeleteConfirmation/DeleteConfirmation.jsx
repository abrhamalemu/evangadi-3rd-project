import React, { useState } from 'react';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import classes from './DeleteConfirmation.module.css';

const DeleteConfirmation = ({ question, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `/question/delete-question/${question.questionid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.error === false) {
        onDelete(); // Notify parent about successful deletion
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContent}>
        <div className={classes.modalHeader}>
          <h2>Delete Question</h2>
          <button className={classes.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={classes.confirmationText}>
          <p>Are you sure you want to delete this question?</p>
          <div className={classes.questionPreview}>
            <strong>{question.title}</strong>
          </div>
          <p className={classes.warning}>This action cannot be undone.</p>
        </div>

        <div className={classes.modalActions}>
          <button 
            className={classes.cancelBtn}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className={classes.deleteConfirmBtn}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;