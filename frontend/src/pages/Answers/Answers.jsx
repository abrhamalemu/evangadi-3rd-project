import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import QuestionDetail from '../../components/QuestionDetail/QuestionDetail'
import AnswersDetail from '../../components/AnswerDetail/AnswersDetail'
import PostAnswer from '../../components/PostAnswer/PostAnswer'
import { useParams, useNavigate } from 'react-router-dom'

const Answers = () => {
  const { questionid } = useParams()
  const navigate = useNavigate()
  const [refreshKey, setRefreshKey] = useState(0)

  // Handle when a question is successfully updated
  const handleQuestionUpdate = (updatedQuestion) => {
    console.log('Question updated:', updatedQuestion)
    // Refresh the question details by triggering a re-render
    setRefreshKey(prev => prev + 1)
  }

  // Handle when a question is successfully deleted
  const handleQuestionDelete = (deletedQuestionId) => {
    console.log('Question deleted:', deletedQuestionId)

    
    // Redirect to home page after a short delay
    setTimeout(() => {
      navigate('/home')
    }, 1500)
  }

  return (
    <Layout>
      {/* Pass the refreshKey to force re-render when question updates */}
      <QuestionDetail 
        key={refreshKey} // This forces re-render when refreshKey changes
        questionid={questionid}
        onQuestionUpdate={handleQuestionUpdate}
        onQuestionDelete={handleQuestionDelete}
      />
      <AnswersDetail questionid={questionid} />
      <PostAnswer questionid={questionid} />
    </Layout>
  )
}

export default Answers