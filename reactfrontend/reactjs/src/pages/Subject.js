import React, { useState } from 'react';
import axios from 'axios';
import '../components/styling/Subject.css';
import SubjBtn from '../components/build quiz btn/SubjBtn';
import { useNavigate } from 'react-router-dom';

const Subject = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [subTopic, setSubTopic] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [language, setLanguage] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('topic', topic);
    formData.append('sub_topic', subTopic);
    formData.append('number_of_questions', numberOfQuestions);
    formData.append('question_type', questionType);
    formData.append('language', language);
    formData.append('difficulty_level', difficultyLevel);
    
    try {
      const response = await axios.post('http://localhost:8000/api/subject-quizz/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Questions generated:', response.data);

      // Navigate to the appropriate page based on the quiz type
      if (questionType === 'mcq') {
        navigate('/BuildQuiz', { state: { questionType } });
      } else if (questionType === 'truefalse') {
        navigate('/BuildTrueFalseQuiz', { state: { questionType } });
      } else if (questionType === 'shortanswer') {
        navigate('/BuildShortAnswerQuiz', { state: { questionType } });
      } else if (questionType === 'fill in the blanks') {
        navigate('/FillInTheBlanksQuiz', { state: { questionType } });
      }

    } catch (error) {
      console.error('Error generating questions:', error);
    }
  };

  return (
    <div className="Main-Section">
      <div className="main-hero-section"></div>

      <div className="sub-hero-section">
        <div className="form-div">
          <form className="select-options" onSubmit={handleSubmit}>
            <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Select Subject</option>
              <option value="math">Mathematics</option>
              <option value="science">Science</option>
              <option value="history">Hwistory</option>
            </select>

            <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="">Select Topic</option>
              <option value="quadratic equation">Quadratic Equation</option>
              <option value="grammar">Grammar</option>
            </select>

            <select id="subtopic" value={subTopic} onChange={(e) => setSubTopic(e.target.value)}>
              <option value="">Enter Sub-topic</option>
              <option value="choice by own">Choice by Own</option>
            </select>

            <select id="noofquestions" value={numberOfQuestions} onChange={(e) => setNumberOfQuestions(e.target.value)}>
              <option value="">Number of Questions</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>

            <select id="questiontype" value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
              <option value="">Type</option>
              <option value="mcq">Multiple Choice</option>
              <option value="truefalse">True/False</option>
              <option value="shortanswer">Short Answer</option>
              <option value="fill in the blanks">Fill in the Blanks</option>
            </select>

            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="">Select Language</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
            </select>

            <div className="difficulty-level">
              <select id="difficultylevel" value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)}>
                <option value="" className="diff-btn">Difficulty Level</option>
                <option value="easy" className="diff-btn">Easy</option>
                <option value="hard" className="diff-btn">Hard</option>
              </select>
            </div>

            <button type="submit" className="submit-btn">Generate Questions</button>
          </form>
        </div>
      </div>

      <div className="subjButton">
        <SubjBtn />
      </div>
    </div>
  );
};

export default Subject;