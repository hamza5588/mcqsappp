import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubjectQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    // Fetch questions from API
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/mcq-questions/');
        setQuestions(response.data.questions || []); // Ensure questions is an array
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();

    // Start timer
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    setTimer(timerId);

    return () => clearInterval(timerId); // Cleanup timer on component unmount
  }, []);

  const handleSubmit = () => {
    if (timeLeft <= 0) {
      alert('Time is up! Please try again.');
      return;
    }

    // Handle form submission
    // ...
  };

  if (!questions.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Subject Quiz</h1>
      <div>Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {questions.map((question, index) => (
          <div key={index}>
            <p>{question.question}</p>
            <div>
              {Object.keys(question.options).map((key) => (
                <div key={key}>
                  <input
                    type="radio"
                    id={`${index}-${key}`}
                    name={`question-${index}`}
                    value={key}
                  />
                  <label htmlFor={`${index}-${key}`}>{question.options[key]}</label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SubjectQuiz;
