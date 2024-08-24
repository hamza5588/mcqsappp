import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Main from './Main';
import NavbarLinks from './components/NavbarLinks';
import BuildQuiz from './components/BuildQuiz';
import BuildTrueFalseQuiz from './components/BuildTrueFalseQuiz';
import BuildShortAnswerQuiz from './components/BuildShortAnswerQuiz';
import QuizResult from './components/QuizResult';
import FillInTheBlanksQuiz from './components/FillInTheBlanksQuiz'; 
import Subject from './pages/Subject';
function App() {
  const location = useLocation();

  // Check if the current path is the root path
  const isRootPath = location.pathname === '/';

  return (
    <div>
      {isRootPath && <Main />} {/* Render Main only if the current path is '/' */}
      {isRootPath && <NavbarLinks />}
      

      <Routes>
      <Route path="/Subject" element={<Subject />} Component={Subject} />
   
        <Route path="/BuildQuiz" element={<BuildQuiz />} />
        <Route path="/BuildTrueFalseQuiz" element={<BuildTrueFalseQuiz />} />
        <Route path="/BuildShortAnswerQuiz" element={<BuildShortAnswerQuiz />} />
        <Route path="/FillInTheBlanksQuiz" element={<FillInTheBlanksQuiz />} />
        <Route path="/result" element={<QuizResult />} />
      
      </Routes>
    </div>

  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;