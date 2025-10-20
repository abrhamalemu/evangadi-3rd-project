import { useEffect } from 'react';
import axios from '../../utils/axiosInstance.js'
import classes from "./QuestionDetail.module.css";
import { useState } from 'react';
import { toast } from 'react-toastify'
import EditQuestionModal from '../EditQuestionModal/EditQuestionModal.jsx'; // We'll create this
import DeleteConfirmation from '../DeleteConfirmation/DeleteConfirmation.jsx'; // We'll create this

const QuestionDetail = ({ questionid, onQuestionUpdate, onQuestionDelete }) => {
  const [question, setQuestion] = useState({});
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const token = localStorage.getItem('token');
  
  // Get current user info
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('user');
      console.log('RAW user data from localStorage:', userData);
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('PARSED user data:', parsedUser);
        return parsedUser;
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const currentUser = getCurrentUser();
  console.log('CURRENT USER:', currentUser);

  useEffect(() => {
    fetchQuestion();
  }, [questionid]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/question/single-question/${questionid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('FETCHED QUESTION DATA:', data.data);
      setQuestion(data.data);
    } catch (error) {
      console.log('Error fetching question:', error);
      toast.error(error.response?.data?.error || "Failed to fetch question");
    } finally {
      setLoading(false);
    }
  };

  // Check ownership - with detailed logging
  const isOwner = currentUser && question.userid === currentUser.userid;
  console.log('OWNERSHIP CHECK:', {
    isOwner,
    currentUserId: currentUser?.userid,
    currentUsername: currentUser?.username,
    questionUserId: question?.userid, 
    questionUsername: question?.username,
    comparison: `currentUser.userid (${currentUser?.userid}) === question.userid (${question?.userid})`
  });

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleUpdateSuccess = (updatedQuestion) => {
    setQuestion(updatedQuestion);
    setShowEditModal(false);
    toast.success("Question updated successfully!");
    if (onQuestionUpdate) {
      onQuestionUpdate(updatedQuestion);
    }
  };

  const handleDeleteSuccess = () => {
    toast.success("Question deleted successfully!");
    if (onQuestionDelete) {
      onQuestionDelete(questionid);
    }
  };

  if (loading) {
    return <div className={classes.loading}>Loading question...</div>;
  }

  return (
    <div className={classes.questionContainer}>
      {/* Edit Question Modal */}
      {showEditModal && (
        <EditQuestionModal
          question={question}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmation
          question={question}
          onClose={() => setShowDeleteConfirm(false)}
          onDelete={handleDeleteSuccess}
        />
      )}

      <div className={classes.questionCard}>
        <div className={classes.questionHeader}>
          <h2 className={classes.questionTitle}>{question.title}</h2>
          
          {/* Edit/Delete Buttons - Only show to question owner */}
          {isOwner && (
            <div className={classes.actionButtons}>
              <button 
                className={classes.editBtn}
                onClick={handleEdit}
              >
                 Edit
              </button>
              <button 
                className={classes.deleteBtn}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <p className={classes.questionDescription}>{question.description}</p>

        <div className={classes.questionMeta}>
          <span className={classes.questionTag}>#{question.tag}</span>
          <span className={classes.questionUser}>
            Asked by <strong>{question.username}</strong>
          </span>
          <span className={classes.questionDate}>
            {question.created_at && new Date(question.created_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;