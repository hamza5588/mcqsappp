import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

function BuildShortAnswerQuiz() {
  const [saQuestions, setSAQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/short-answer-questions/')
      .then((response) => {
        setSAQuestions(response.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let timer;
    if (isQuizActive && timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    } else if (timeRemaining === 0) {
      handleSubmitQuiz(); // Automatically submit the quiz when time is up
    }
    return () => clearTimeout(timer);
  }, [isQuizActive, timeRemaining]);

  const handleStartQuiz = () => {
    const timePerQuestion = 60; // 1 minute per question
    const totalQuizTime = saQuestions.length * timePerQuestion; // Total time for the quiz
    setIsQuizActive(true);
    setStartTime(Date.now());
    setTimeRemaining(totalQuizTime); // Set the timer based on the number of questions
  };

  const handleAnswerChange = (e) => {
    const answer = e.target.value;
    setUserAnswers({
      ...userAnswers,
      [saQuestions[currentQuestionIndex].id]: answer,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < saQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = () => {
    const correctAnswers = saQuestions.filter((q) => {
      const userAnswer = userAnswers[q.id] ? userAnswers[q.id].toLowerCase() : '';
      const correctAnswer = q.answer ? q.answer.toLowerCase() : '';
      return userAnswer === correctAnswer;
    }).length;

    const totalQuestions = saQuestions.length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    setQuizResults({
      correctAnswers,
      incorrectAnswers,
      timeTaken,
    });

    setIsQuizActive(false);
    setTimeRemaining(null); // Clear the timer
  };

  const handleEdit = (questionId) => {
    const question = saQuestions.find((q) => q.id === questionId);
    setSelectedQuestion(question);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedQuestion) => {
    axios.put(`http://localhost:8000/api/short-answer-questions/${updatedQuestion.id}/`, updatedQuestion)
      .then((response) => {
        setSAQuestions((prevQuestions) =>
          prevQuestions.map((q) => (q.id === response.data.id ? response.data : q))
        );
        setIsEditModalOpen(false);
      })
      .catch((error) => {
        console.error('Error updating question:', error);
      });
  };

  const handleDelete = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      axios.delete(`http://localhost:8000/api/short-answer-questions/${questionId}/`)
        .then(() => {
          setSAQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== questionId));
        })
        .catch((error) => {
          console.error('Error deleting question:', error);
        });
    }
  };

  const handleAddQuestion = (newQuestion) => {
    axios
      .post('http://localhost:8000/api/short-answer-questions/', newQuestion)
      .then((response) => {
        setSAQuestions((prevQuestions) => [...prevQuestions, response.data]);  // Update the state with the new question
        alert('Question and Answer added successfully!');  // Show success alert
        setIsAddQuestionModalOpen(false);  // Close the modal
      })
      .catch((error) => {
        console.error('Error adding question:', error.response?.data || error.message);  // Log the error
        alert('There was an error adding the Question and Answer.');  // Show error alert
      });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isQuizActive && quizResults) {
    return (
      <div style={styles.quizResults}>
        <div style={styles.resultIcon}>
          <img src="/path/to/check-icon.png" alt="Check Icon" />
        </div>
        <p style={styles.resultText}>
          You answered {quizResults.correctAnswers} questions correctly out of {saQuestions.length}.
        </p>
        <p style={styles.resultText}>Time Taken: {formatTime(quizResults.timeTaken)}</p>
        <p style={styles.resultText}>Feedback generated with AI.</p>
      </div>
    );
  }

  return (
    <div style={styles.quizContainer}>
      {!isQuizActive ? (
        <div style={styles.quizStart}>
          <h2 style={styles.heading}>Welcome to the Quiz</h2>
          <button style={styles.startBtn} onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </div>
      ) : (
        <div style={styles.quizQuestion}>
          <div style={styles.questionHeader}>
            <span style={styles.questionNumber}>{currentQuestionIndex + 1} / {saQuestions.length}</span>
            <h3 style={styles.questionText}>{saQuestions[currentQuestionIndex].question}</h3>
            <p style={styles.timerText}>Time Remaining: {formatTime(timeRemaining)}</p> {/* Display the timer */}
          </div>
          <div style={styles.questionBody}>
            <input
              type="text"
              placeholder="Type your answer here"
              style={styles.answerInput}
              onChange={handleAnswerChange}
              value={userAnswers[saQuestions[currentQuestionIndex].id] || ''}
              disabled={!isQuizActive} // Disable input until quiz starts
            />
          </div>
          <div style={styles.questionFooter}>
            <button style={styles.nextBtn} onClick={handleNextQuestion}>
              {currentQuestionIndex < saQuestions.length - 1 ? 'Next' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      <div style={styles.questionList}>
        <h4>Questions</h4>
        {saQuestions.map((question, index) => (
          <div key={question.id} style={styles.questionItem}>
            <div style={styles.questionItemHeader}>
              <span>{index + 1}. {question.question}</span>
              <div style={styles.questionItemIcons}>
                <FaEdit onClick={() => handleEdit(question.id)} />
                <FaTrash onClick={() => handleDelete(question.id)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isQuizActive && (
        <button
          style={styles.addBtn}
          onClick={() => setIsAddQuestionModalOpen(true)}
        >
          Add Question
        </button>
      )}

      {isAddQuestionModalOpen && (
        <AddQuestionModal
          isOpen={isAddQuestionModalOpen}
          onClose={() => setIsAddQuestionModalOpen(false)}
          onAdd={handleAddQuestion}
        />
      )}

      {isEditModalOpen && selectedQuestion && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          question={selectedQuestion}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function AddQuestionModal({ isOpen, onClose, onAdd }) {
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    answer: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    if (newQuestion.question.trim() === '' || newQuestion.answer.trim() === '') {
      alert('Please fill in both the question and answer.');
      return;
    }
    onAdd(newQuestion);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Question</h2>
        <form>
          <label>
            Question:
            <input
              type="text"
              name="question"
              value={newQuestion.question}
              onChange={handleChange}
            />
          </label>
          <label>
            Answer:
            <input
              type="text"
              name="answer"
              value={newQuestion.answer}
              onChange={handleChange}
            />
          </label>
          <button type="button" onClick={handleAdd}>Add Question</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
}

function EditModal({ isOpen, onClose, question, onSave }) {
  const [updatedQuestion, setUpdatedQuestion] = useState({ ...question });

  useEffect(() => {
    setUpdatedQuestion({ ...question });
  }, [question]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(updatedQuestion);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Question</h2>
        <form>
          <label>
            Question:
            <input
              type="text"
              name="question"
              value={updatedQuestion.question || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Answer:
            <input
              type="text"
              name="answer"
              value={updatedQuestion.answer || ''}
              onChange={handleChange}
            />
          </label>
          <button type="button" onClick={handleSave}>Save</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  quizContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
    padding: '20px',
  },
  quizStart: {
    textAlign: 'center',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
  },
  startBtn: {
    padding: '1rem 2rem',
    fontSize: '1.25rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  quizQuestion: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    width: '80%',
    maxWidth: '800px',
  },
  questionHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  questionNumber: {
    fontSize: '1.25rem',
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  questionText: {
    fontSize: '1.75rem',
  },
  timerText: {
    fontSize: '1.25rem',
    color: '#ef4444', // Red color for urgency
  },
  questionBody: {
    marginBottom: '2rem',
  },
  answerInput: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.25rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  questionFooter: {
    textAlign: 'right',
  },
  nextBtn: {
    padding: '1rem 2rem',
    fontSize: '1.25rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  quizResults: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '2rem auto',
  },
  resultIcon: {
    marginBottom: '1.5rem',
  },
  resultText: {
    fontSize: '1.25rem',
    margin: '0.5rem 0',
  },
  questionList: {
    width: '100%',
    marginTop: '20px',
  },
  questionItem: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    marginBottom: '10px',
  },
  questionItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionItemIcons: {
    display: 'flex',
    gap: '10px',
  },
  addBtn: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default BuildShortAnswerQuiz;
