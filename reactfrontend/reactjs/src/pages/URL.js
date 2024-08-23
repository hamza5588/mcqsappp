import React, { useState } from 'react';
import '../components/styling/URL.css';
import SubjBtn from '../components/build quiz btn/SubjBtn';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const URL = () => {
  // State to store form values
  const [url, setUrl] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [language, setLanguage] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object
    const formData = new FormData();
    formData.append('url', url);
    formData.append('number_of_questions', numberOfQuestions);
    formData.append('question_type', questionType);
    formData.append('language', language);
    formData.append('difficulty_level', difficultyLevel);

    try {
      // Send a POST request with form data
      const response = await axios.post('http://localhost:8000/api/url-quizz/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);

      if (questionType === 'mcq') {
        navigate('/BuildQuiz', { state: { questionType } });
      } else if (questionType === 'truefalse') {
        navigate('/BuildTrueFalseQuiz', { state: { questionType } });
      } else if (questionType === 'shortanswer') {
        navigate('/BuildShortAnswerQuiz');
      }
      // Handle successful response (e.g., show a success message or redirect)
    } catch (error) {
      console.error('Error:', error);
      // Handle error response (e.g., show an error message)
    }
  };

  return (
    <div className="Main-Section">
      {/* <!--main-hero-section--> */}
      <div className="url-input-container">
        <input
          type="url"
          className="url-input"
          placeholder="Enter your link here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      {/* <!--sub-hero-section--> */}
      <div className="sub-hero-section">
        <div className="form-div">
          <form className="select-options" onSubmit={handleSubmit}>
            <select
              id="noofquestions"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(e.target.value)}
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

            <button type="submit" className="submit-button">Generate Quiz</button>
          </form>
        </div>
      </div>
      {/* <!--submit-btn-section--> */}
      <div className="URLbtn">
        <SubjBtn />
      </div>
    </div>
  );
};

export default URL;
