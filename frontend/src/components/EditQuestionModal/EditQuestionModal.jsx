import React, { useState } from 'react';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import classes from './EditQuestionModal.module.css';

const EditQuestionModal = ({ question, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: question.title || '',
    description: question.description || '',
    tag: question.tag || ''
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        `/question/update-question/${question.questionid}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.error === false) {
        onUpdate(data.data); // Pass updated question back
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContent}>
        <div className={classes.modalHeader}>
          <h2>Edit Question</h2>
          <button className={classes.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={classes.editForm}>
          <div className={classes.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter question title"
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter question description"
              rows="6"
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="tag">Tag (optional)</label>
            <input
              type="text"
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              placeholder="e.g., react, javascript"
            />
          </div>

          <div className={classes.modalActions}>
            <button 
              type="button" 
              className={classes.cancelBtn}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={classes.updateBtn}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestionModal;