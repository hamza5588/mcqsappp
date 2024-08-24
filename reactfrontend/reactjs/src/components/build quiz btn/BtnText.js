import React from 'react';
import './SubjBtn'; // Assuming you intended to import the CSS file

function BtnText({ handleClick }) {
  return (
    <div>
      <button className="build-quiz-btn" onClick={handleClick}>
        Build Quiz
      </button>
    </div>
  );
}

export default BtnText;
