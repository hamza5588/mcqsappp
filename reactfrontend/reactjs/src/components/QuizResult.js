import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function QuizResult() {
  const location = useLocation();
  const { correct, incorrect, timeTaken } = location.state || {};
  const navigate = useNavigate();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Quiz Results</h2>
      <p>Correct Answers: {correct}</p>
      <p>Incorrect Answers: {incorrect}</p>
      <p>Time Taken: {formatTime(timeTaken)}</p>
      <button
        onClick={() => navigate('/')}
        style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#7161EF', color: '#fff', cursor: 'pointer', border: 'none', marginTop: '20px' }}
      >
        Go to Home
      </button>
    </div>
  );
}

export default QuizResult;