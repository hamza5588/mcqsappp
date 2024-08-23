import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditTrueFalseModal from './EditTrueFalseModal';
import AddTrueFalseModal from './AddTrueFalseModal';
import './buildstyle.css';
import { useNavigate } from 'react-router-dom';

function BuildTrueFalseQuiz() {
  const [tfQuestions, setTFQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isAddTFModalOpen, setIsAddTFModalOpen] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/true-false-questions/')
      .then((response) => {
        setTFQuestions(response.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isQuizActive && startTime) {
      const interval = setInterval(() => {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        const timeLeft = tfQuestions.length * 60 - currentTime;

        if (timeLeft <= 0) {
          handleSubmit();
          clearInterval(interval);
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isQuizActive, startTime, tfQuestions]);

  const handleStartQuiz = () => {
    setIsQuizActive(true);
    setStartTime(Date.now());
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
      return '00:00'; // Fallback in case of an invalid time
    }
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleToggleAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const calculateResult = () => {
    let correct = 0;
    let incorrect = 0;

    tfQuestions.forEach((question) => {
      const userAnswer = userAnswers[question.id];
      if (userAnswer !== undefined) {
        if (userAnswer === question.correct_option) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    return { correct, incorrect, timeTaken };
  };



  // Inside your BuildTrueFalseQuiz component
  const navigate = useNavigate();
  const handleSubmit = () => {
    setIsQuizActive(false);
    setIsSubmitted(true);
  
    const quizResult = calculateResult();
  
    // Calculate time taken
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
  
    const payload = {
      answers: userAnswers,
      quiz_id: 1,  // Optional: Include if you have multiple quizzes
      time_taken: timeTaken,  // Include time taken in seconds
    };
  
    axios.post('http://localhost:8000/api/submit-true-false-quiz/', payload)
      .then((response) => {
        console.log('Quiz submitted successfully:', response.data);
        navigate('/result', { state: response.data });
      })
      .catch((error) => {
        console.error('Error submitting quiz:', error);
      });
  
    setResult(quizResult);
  };
  const handleEdit = (questionId) => {
    const question = tfQuestions.find((q) => q.id === questionId);
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleSave = (updatedQuestion) => {
    axios
      .put(`http://localhost:8000/api/true-false-questions/${updatedQuestion.id}/`, updatedQuestion)
      .then((response) => {
        setTFQuestions((prevQuestions) =>
          prevQuestions.map((q) => (q.id === response.data.id ? response.data : q))
        );
        alert('True/False Question updated successfully!');
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error('Error updating True/False question:', error.response.data);
        alert('There was an error updating the True/False question.');
      });
  };

  const handleDelete = (questionId) => {
    axios
      .delete(`http://localhost:8000/api/true-false-questions/${questionId}/`)
      .then(() => {
        setTFQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q.id !== questionId)
        );
        alert('True/False Question deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting True/False question:', error.response.data);
        alert('There was an error deleting the True/False question.');
      });
  };

  const handleAddQuestion = (newQuestion) => {
    axios
      .post('http://localhost:8000/api/true-false-questions/', newQuestion)
      .then((response) => {
        setTFQuestions((prevQuestions) => [...prevQuestions, response.data]);
        alert('True/False Question added successfully!');
      })
      .catch((error) => {
        console.error('Error adding True/False question:', error.response.data);
        alert('There was an error adding the True/False question.');
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (isSubmitted && result) {
    return (
      <div style={{ padding: '40px' }}>
        <h2>Quiz Results</h2>
        <p>Correct Answers: {result.correct}</p>
        <p>Incorrect Answers: {result.incorrect}</p>
        <p>Time Taken: {formatTime(result.timeTaken)}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            borderRadius: '5px',
            backgroundColor: '#7161EF',
            color: '#fff',
            cursor: 'pointer',
            border: 'none',
            marginTop: '20px',
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="build-quiz-container">
      <div className="main-content">
        <h2>Build True/False Quiz</h2>
        {!isQuizActive && !isSubmitted && (
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
        <button
          style={{
            backgroundColor: showAnswers ? '#6c757d' : '#5a5ae6',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
          onClick={handleToggleAnswers}
        >
          {showAnswers ? 'Hide Answers' : 'Show Answers'}
        </button>
        <div className="tf-section">
          <div className="tf-header">
            <h2>True/False Questions</h2>
          </div>
          <div className="tf-content">
            {tfQuestions.map((question, index) => (
              <div className="tf-card" key={question.id}>
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
                  <div className="options">
                    <div className="option">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`question_${question.id}`}
                        id={`option_${question.id}_true`}
                        value="true"
                        disabled={!isQuizActive}
                        onChange={() => handleAnswerChange(question.id, 'true')}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`option_${question.id}_true`}
                      >
                        True
                      </label>
                    </div>
                    <div className="option">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`question_${question.id}`}
                        id={`option_${question.id}_false`}
                        value="false"
                        disabled={!isQuizActive}
                        onChange={() => handleAnswerChange(question.id, 'false')}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`option_${question.id}_false`}
                      >
                        False
                      </label>
                    </div>
                  </div>
                  {showAnswers && (
                    <div className="correct_answer">
                      Answer: {question.correct_answer}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {!isQuizActive && !isSubmitted && (
          <div className="add-question-section">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAddTFModalOpen(true)}
            >
              Add True/False Question
            </button>
          </div>
        )}
        {isQuizActive && (
          <div className="submit-section">
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Submit
            </button>
          </div>
        )}
      </div>
      {isModalOpen && selectedQuestion && (
        <EditTrueFalseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          question={selectedQuestion}
          onSave={handleSave}
        />
      )}
      {isAddTFModalOpen && (
        <AddTrueFalseModal
          isOpen={isAddTFModalOpen}
          onClose={() => setIsAddTFModalOpen(false)}
          onAdd={handleAddQuestion}
        />
      )}
    </div>
  );
}

export default BuildTrueFalseQuiz;
