import React, { useState } from 'react';

function Header() {
  return (
    <header>
      <h1>Question Generator</h1>
    </header>
  );
}

function SubjectSelector() {
  const subjects = ['Math', 'Science', 'History'];
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  }

  return (
    <div className="subject-selector">
      <label htmlFor="subject">Subject:</label>
      <select id="subject" value={selectedSubject} onChange={handleSubjectChange}>
        {subjects.map((subject) => (
          <option key={subject} value={subject}>{subject}</option>
        ))}
      </select>
    </div>
  );
}

function QuestionTypeSelector() {
  const questionTypes = ['Multiple Choice', 'True/False', 'Open Ended'];
  const [selectedType, setSelectedType] = useState(questionTypes[0]);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  }

  return (
    <div className="question-type-selector">
      <label htmlFor="type">Question Type:</label>
      <select id="type" value={selectedType} onChange={handleTypeChange}>
        {questionTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
}

function DifficultySelector() {
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulties[0]);

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  }

  return (
    <div className="difficulty-selector">
      <label htmlFor="difficulty">Difficulty:</label>
      <select id="difficulty" value={selectedDifficulty} onChange={handleDifficultyChange}>
        {difficulties.map((difficulty) => (
          <option key={difficulty} value={difficulty}>{difficulty}</option>
        ))}
      </select>
    </div>
  );
}

function QuestionCountInput() {
  const [questionCount, setQuestionCount] = useState(10);

  const handleCountChange = (event) => {
    const newCount = parseInt(event.target.value, 10);
    if (!isNaN(newCount)) {
      setQuestionCount(newCount);
    }
  }

  return (
    <div className="question-count-input">
      <label htmlFor="count">Number of Questions:</label>
      <input type="number" id="count" value={questionCount} onChange={handleCountChange} />
    </div>
  );
}

function QuestionGenerator() {
  // Add logic to generate questions based on selected options
  // (subject, type, difficulty, count)

  return (
    <section className="question-generator">
      <h2>Generate Questions</h2>
      <SubjectSelector />
      <QuestionTypeSelector />
      <DifficultySelector />
      <QuestionCountInput />
      <button>Generate</button>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <p>&copy; 2024 Your Company Name</p>
    </footer>
  );
}

function App() {
  return (
    <div className="app">
      <Header />
      <QuestionGenerator />
      <Footer />
    </div>
  );
}

export default App;
