import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditModal from './EditModal';
import AddQuestionModal from './AddQuestionModal';
import { useNavigate } from 'react-router-dom';

function BuildQuiz() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/mcq-questions/')
      .then((response) => {
        setQuestions(response.data || []);
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
        const timeLeft = questions.length * 60 - currentTime;

        if (timeLeft <= 0) {
          handleSubmit();
          clearInterval(interval);
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isQuizActive, startTime, questions]);

  const handleStartQuiz = () => {
    setIsQuizActive(true);
    setStartTime(Date.now());
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleToggleAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  const handleAnswerChange = (questionId, selectedOptionIndex) => {
    const optionMap = ['a', 'b', 'c', 'd'];
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionMap[selectedOptionIndex],
    }));
    console.log("User Answers State Updated: ", userAnswers);
  };

  const calculateResult = () => {
    const correctAnswers = [];
    const studentAnswers = [];

    questions.forEach((question) => {
      const correctAnswer = question.correct_answer ? question.correct_answer.trim().toLowerCase() : null;
      const userAnswer = userAnswers[question.id] ? userAnswers[question.id].trim().toLowerCase() : null;

      correctAnswers.push(correctAnswer);
      studentAnswers.push(userAnswer);

      console.log(`Question: ${question.question}`);
      console.log(`Correct Answer: ${correctAnswer}`);
      console.log(`User Answer: ${userAnswer}`);
    });

    let correct = 0;
    let incorrect = 0;

    correctAnswers.forEach((answer, index) => {
      if (answer === studentAnswers[index]) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    console.log(`Final Result - Correct: ${correct}, Incorrect: ${incorrect}, Time Taken: ${timeTaken}`);
    
    return { correct, incorrect, timeTaken };
  };

  const navigate = useNavigate();

  const handleSubmit = () => {
    setIsQuizActive(false);
    setIsSubmitted(true);
    const quizResult = calculateResult();
    setResult(quizResult);
  
    const payload = {
      answers: userAnswers,
      quiz_id: 1,  // If you have a specific quiz ID, otherwise remove this line
      time_taken: quizResult.timeTaken,
    };
  
    axios
      .post('http://localhost:8000/api/submit-quiz/', payload)
      .then((response) => {
        console.log('Quiz submitted successfully:', response.data);
  
        navigate('/result', { state: quizResult });
      })
      .catch((error) => {
        console.error('Error submitting quiz:', error);
      });
  };

  const handleEdit = (questionId) => {
    const question = questions.find((q) => q.id === questionId);
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleSave = (updatedQuestion) => {
    axios
      .put(`http://localhost:8000/api/mcq-questions/${updatedQuestion.id}/`, updatedQuestion)
      .then((response) => {
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) => (q.id === updatedQuestion.id ? response.data : q))
        );
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error('Error updating question:', error);
      });
  };

  const handleDelete = (questionId) => {
    axios
      .delete(`http://localhost:8000/api/mcq-questions/${questionId}/`)
      .then(() => {
        setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== questionId));
      })
      .catch((error) => {
        console.error('Error deleting question:', error);
      });
  };

  const handleAddQuestion = (newQuestion) => {
    axios
      .post('http://localhost:8000/api/mcq-questions/', newQuestion)
      .then((response) => {
        setQuestions((prevQuestions) => [...prevQuestions, response.data]);
        setIsAddQuestionModalOpen(false);
      })
      .catch((error) => {
        console.error('Error adding new question:', error);
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
          style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#7161EF', color: '#fff', cursor: 'pointer', border: 'none', marginTop: '20px' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <aside style={{ width: '250px', backgroundColor: '#232946', color: 'white', padding: '20px' }}>
        <h3>Recent Quiz</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>MCQs</li>
        </ul>
        <button style={{ backgroundColor: '#4E97D8', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', marginTop: '20px', cursor: 'pointer' }}>
          Show More
        </button>
        <div style={{ marginTop: '20px' }}>
          <a href="#" style={{ color: '#a0a0a0', textDecoration: 'none' }}>My Quizzes</a>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '40px', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Build Quiz</h2>
          <h3>Title of Quiz</h3>
          {!isQuizActive && !isSubmitted && (
            <button style={{ backgroundColor: '#7161EF', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }} onClick={handleStartQuiz}>
              Start Quiz
            </button>
          )}
        </div>
        {isQuizActive && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', color: '#7161EF' }}>Time Remaining: {formatTime(remainingTime)}</h3>
          </div>
        )}
        <button style={{ backgroundColor: showAnswers ? '#6c757d' : '#5a5ae6', color: 'white', padding: '10px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginBottom: '20px' }} onClick={handleToggleAnswers}>
          {showAnswers ? 'Hide Answers' : 'Show Answers'}
        </button>
        <div>
          <h4>MCQs</h4>
          {questions.map((question, index) => (
            <div key={question.id} style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h5 style={{ fontSize: '18px' }}>{index + 1}</h5>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <FaEdit style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => handleEdit(question.id)} />
                  <FaTrash style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => handleDelete(question.id)} />
                </div>
              </div>
              <p style={{ marginBottom: '10px' }}>{question.question}</p>
              <div>
              {[question.option_a, question.option_b, question.option_c, question.option_d].map((option, optionIndex) => (
                <div key={optionIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value={option}
                    disabled={!isQuizActive}
                    onChange={() => handleAnswerChange(question.id, optionIndex)}
                    style={{ marginRight: '10px' }}
                  />
                  <label>{option}</label>
                </div>
              ))}
            </div>
              {showAnswers && <p style={{ marginTop: '10px', color: '#232946' }}>Answer: {question.correct_answer}</p>}
            </div>
          ))}
        </div>
        {!isQuizActive && !isSubmitted && (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#7161EF', color: '#fff', cursor: 'pointer', border: 'none' }}
              onClick={() => setIsAddQuestionModalOpen(true)}
            >
              Add MCQ Question
            </button>
          </div>
        )}
        {isQuizActive && (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSubmit}
              style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#7161EF', color: '#fff', cursor: 'pointer', border: 'none' }}
            >
              Submit
            </button>
          </div>
        )}
      </main>
      {isModalOpen && selectedQuestion && (
        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          question={selectedQuestion}
          onSave={(updatedQuestion) => handleSave(updatedQuestion)}
        />
      )}
      {isAddQuestionModalOpen && (
        <AddQuestionModal
          isOpen={isAddQuestionModalOpen}
          onClose={() => setIsAddQuestionModalOpen(false)}
          onAdd={(newQuestion) => handleAddQuestion(newQuestion)}
        />
      )}
    </div>
  );
}

export default BuildQuiz;
