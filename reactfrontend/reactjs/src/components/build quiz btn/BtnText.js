import React from 'react';
import './SubjBtn';


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