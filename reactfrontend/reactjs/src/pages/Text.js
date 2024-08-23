import React, { useState } from 'react';
import '../components/styling/Prompt.css'; // Import the CSS used in Prompt.js
import MessageInput from '../components/styling/MessageInput.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Text = () => {
  // State to store form values
  const [text, setText] = useState('');
  const [numQuestions, setNumQuestions] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [language, setLanguage] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const navigate = useNavigate();
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object
    const formData = new FormData();
    formData.append('text', text);
    formData.append('num_questions', numQuestions);
    formData.append('question_type', questionType);
    formData.append('language', language);
    formData.append('difficulty_level', difficultyLevel);

    try {
      // Send a POST request with form data
      const response = await axios.post('http://127.0.0.1:8000/api/text/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Submitted text', response.data);

      if (questionType === 'mcq') {
        navigate('/BuildQuiz', { state: { questionType } });
      } else if (questionType === 'truefalse') {
        navigate('/BuildTrueFalseQuiz', { state: { questionType } });
      } else if (questionType === 'shortanswer') {
        navigate('/BuildShortAnswerQuiz');
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="Main-Section">
      {/* Main section styling */}
      <div className="main-hero-section">
        <div className="prompt-input-container">
          <MessageInput 
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
      {/* Sub-hero section styling */}
      <div className="sub-hero-section">
        <div className="form-div">
          <form className="select-options" onSubmit={handleSubmit}>
            <select
              id="noofquestions"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
            >
              <option value="">Number of Questions</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>

            <select
              id="questiontype"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            >
              <option value="">Type</option>
              <option value="mcq">Multiple Choice</option>
              <option value="truefalse">True/False</option>
              <option value="shortanswer">Short Answer</option>
              <option value="fill in the blanks">Fill in the Blanks</option>
            </select>

            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="">Select Language</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
            </select>

            <select
              id="difficultylevel"
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
            >
              <option value="">Difficulty Level</option>
              <option value="easy">Easy</option>
              <option value="hard">Hard</option>
            </select>

            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Text;