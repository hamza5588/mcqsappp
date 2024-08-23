import React from 'react';

const MCQCard = ({ questionNumber, questionInfo }) => {
  return (
    <div className="card mcq-card mb-4">
      <div className="card-header text-secondary">
        <h5 className="mb-0 text-white"> {questionNumber}</h5>
      </div>
      <div className="card-body">
        <p className="mb-3">{questionInfo.question_statement}</p>
        <div className="options">
          {questionInfo.options.map((option, index) => (
            <div className="option" key={index}>
              <input
                className="form-check-input"
                type="checkbox"
                name={`question_${questionNumber}`}
                id={`option_${questionNumber}_${index}`}
                value={option}
              />
              <label
                className="form-check-label"
                htmlFor={`option_${questionNumber}_${index}`}
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MCQCard;
