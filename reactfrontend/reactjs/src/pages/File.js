import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/styling/File.css';
import SubjBtn from '../components/build quiz btn/SubjBtn';
import BtnText from '../components/build quiz btn/BtnText';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; // Import the spinner library
import NavbarLinks from '../components/NavbarLinks';

const Fileupload = () => {
  const [file, setFile] = useState(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [language, setLanguage] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show spinner when form is submitted

    // Create a FormData instance
    const formData = new FormData();
    formData.append('file', file);
    formData.append('number_of_questions', numberOfQuestions);
    formData.append('question_type', questionType);
    formData.append('language', language);
    formData.append('difficulty_level', difficultyLevel);

    try {
      // Perform POST request with FormData
      const response = await axios.post('http://localhost:8000/api/generate-questions/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Quiz created:', response.data);
      fetchQuizzes(); // Refresh the quiz list after creating a new one

      // Navigate based on the question type
      if (questionType === 'mcq') {
        navigate('/BuildQuiz', { state: { questionType } });
      } else if (questionType === 'truefalse') {
        navigate('/BuildTrueFalseQuiz', { state: { questionType } });
      } else if (questionType === 'shortanswer') {
        navigate('/BuildShortAnswerQuiz');
      }

    } catch (error) {
      console.error('Error creating quiz:', error);
    } finally {
      setLoading(false); // Hide spinner when response is received
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/generate-questions/');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  useEffect(() => {
    fetchQuizzes(); // Fetch quizzes when component mounts
  }, []);

  return (
    <div className="Main-Section">
      {/* <!--main-hero-section---> */}
      <div className="main-hero-section">
        <div className="message-input-container">
          <input type="file" className='file' onChange={handleFileChange} />
        </div>
      </div>
      {/* <!--sub-hero-section---> */}
      <div className="sub-hero-section">
        <div className="form-div">
          <form className="select-options" onSubmit={handleSubmit}>
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
              <option value="matching">Matching</option>
              <option value="mix">Mix</option>
            </select>

            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="">Select Language</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
            </select>

            <select id="difficultylevel" value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)}>
              <option value="">Difficulty Level</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? <ClipLoader size={24} color={"#fff"} /> : "Generate Quiz"}
            </button>
          </form>
        </div>
      </div>
      <div className="fileButton">
        <SubjBtn />
        <NavbarLinks />
        
      </div>
      <div className="quiz-list">
        <h2>Quiz List</h2>
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              <p>ID: {quiz.id}</p>
              <p>Number of Questions: {quiz.number_of_questions}</p>
              <p>Type: {quiz.question_type}</p>
              <p>Language: {quiz.language}</p>
              <p>Difficulty Level: {quiz.difficulty_level}</p>
              <p>Created At: {new Date(quiz.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Fileupload;
