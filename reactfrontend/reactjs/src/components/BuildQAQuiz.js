import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditQAModal from './EditQAModal';
import AddQAModal from './AddQAModal';
import './buildstyle.css';

function BuildQAQuiz() {
  const [qaQuestions, setQAQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isAddQAModalOpen, setIsAddQAModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/qa-questions/')
      .then((response) => {
        setQAQuestions(response.data || []);
        setLoading(false);
      })
      .catch((error) => {
        setError('There was an error fetching the Question and Answer questions!');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isQuizActive && startTime) {
      const interval = setInterval(() => {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        const timeLeft = qaQuestions.length * 60 - currentTime;

        if (timeLeft <= 0) {
          setIsQuizActive(false);
          setRemainingTime(0);
          clearInterval(interval);
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isQuizActive, startTime, qaQuestions]);

  const handleStartQuiz = () => {
    setIsQuizActive(true);
    setStartTime(Date.now());
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleEdit = (questionId) => {
    const question = qaQuestions.find((q) => q.id === questionId);
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleSave = (updatedQuestion) => {
    axios
      .put(`http://localhost:8000/api/question-answering/${updatedQuestion.id}/`, updatedQuestion)
      .then((response) => {
        setQAQuestions((prevQuestions) =>
          prevQuestions.map((q) => (q.id === response.data.id ? response.data : q))
        );
        alert('Question and Answer updated successfully!');
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error('Error updating Question and Answer:', error.response.data);
        alert('There was an error updating the Question and Answer.');
      });
  };

  const handleDelete = (questionId) => {
    axios
      .delete(`http://localhost:8000/api/question-answering/${questionId}/`)
      .then(() => {
        setQAQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q.id !== questionId)
        );
        alert('Question and Answer deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting Question and Answer:', error.response.data);
        alert('There was an error deleting the Question and Answer.');
      });
  };

  const handleAddQuestion = (newQuestion) => {
    axios
      .post('http://localhost:8000/api/question-answering/', newQuestion)
      .then((response) => {
        setQAQuestions((prevQuestions) => [...prevQuestions, response.data]);
        alert('Question and Answer added successfully!');
      })
      .catch((error) => {
        console.error('Error adding Question and Answer:', error.response.data);
        alert('There was an error adding the Question and Answer.');
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="build-quiz-container">
      <div className="main-content">
        <h2>Build Question and Answer Quiz</h2>
        {!isQuizActive && (
          <div className="start-quiz-section">
            <button className="btn btn-primary start-quiz-btn" onClick={handleStartQuiz}>
              Start Quiz
            </button>
          </div>
        )}
        {isQuizActive && (
          <div className="timer">
            <h3>Time Remaining: {formatTime(remainingTime)}</h3>
          </div>
        )}
        <div className="qa-section">
          <div className="qa-header">
            <h2>Question and Answer</h2>
          </div>
          <div className="qa-content">
            {qaQuestions.map((question, index) => (
              <div className="qa-card" key={question.id}>
                <div className="card-header">
                  <h5>{index + 1}</h5>
                </div>
                <div className="card-body">
                  <div className="question-header">
                    <p>{question.question}</p>
                    <div className="question-controls">
                      <FaEdit className="icon" onClick={() => handleEdit(question.id)} />
                      <FaTrash className="icon" onClick={() => handleDelete(question.id)} />
                    </div>
                  </div>
                  <div className="answer-section">
                    <textarea
                      className="form-control"
                      name={`answer_${question.id}`}
                      id={`answer_${question.id}`}
                      rows="3"
                      disabled={!isQuizActive}
                      defaultValue={question.answer}
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {!isQuizActive && (
          <div className="add-question-section">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAddQAModalOpen(true)}
            >
              Add Question and Answer
            </button>
          </div>
        )}
        {isQuizActive && (
          <div className="submit-section">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        )}
      </div>
      {isModalOpen && selectedQuestion && (
        <EditQAModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          question={selectedQuestion}
          onSave={handleSave}
        />
      )}
      {isAddQAModalOpen && (
        <AddQAModal
          isOpen={isAddQAModalOpen}
          onClose={() => setIsAddQAModalOpen(false)}
          onAdd={handleAddQuestion}
        />
      )}
    </div>
  );
}
export default BuildQAQuiz;
