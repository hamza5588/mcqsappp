import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Main';
import BuildQuiz from './components/BuildQuiz';
import BuildTrueFalseQuiz from './components/BuildTrueFalseQuiz';
import BuildShortAnswerQuiz from './components/BuildShortAnswerQuiz';
import NavbarLinks from './components/NavbarLinks'; // Import NavbarLinks
import QuizResult from './components/QuizResult';
import FillInTheBlanksQuiz from './components/FillInTheBlanksQuiz'; 

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/BuildQuiz" element={<BuildQuiz />} />
        <Route path="/BuildTrueFalseQuiz" element={<BuildTrueFalseQuiz />} />
        <Route path="/BuildShortAnswerQuiz" element={<BuildShortAnswerQuiz />} />
        <Route path="/FillInTheBlanksQuiz" element={<FillInTheBlanksQuiz />} />
        
        <Route path="/result" element={<QuizResult />} />
      </Routes>
      <NavbarLinks /> {/* Ensure NavbarLinks is outside of the Routes */}
      {/* <Route path="/" element={<Main />} /> */}

    </Router>
  
    
    
  );
}

export default App;
