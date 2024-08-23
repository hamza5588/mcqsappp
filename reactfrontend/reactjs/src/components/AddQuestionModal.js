import React, { useState } from 'react';

function AddQuestionModal({ isOpen, onClose, onAdd }) {
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    onAdd(newQuestion);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Question</h2>
        <form>
          <label>
            Question Text:
            <input
              type="text"
              name="question"
              value={newQuestion.question}
              onChange={handleChange}
            />
          </label>
          <label>
            Option A:
            <input
              type="text"
              name="option_a"
              value={newQuestion.option_a}
              onChange={handleChange}
            />
          </label>
          <label>
            Option B:
            <input
              type="text"
              name="option_b"
              value={newQuestion.option_b}
              onChange={handleChange}
            />
          </label>
          <label>
            Option C:
            <input
              type="text"
              name="option_c"
              value={newQuestion.option_c}
              onChange={handleChange}
            />
          </label>
          <label>
            Option D:
            <input
              type="text"
              name="option_d"
              value={newQuestion.option_d}
              onChange={handleChange}
            />
          </label>
          <label>
            Correct Answer:
            <input
              type="text"
              name="correct_answer"
              value={newQuestion.correct_answer}
              onChange={handleChange}
            />
          </label>
          <button type="button" onClick={handleAdd}>Add Question</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
}

export default AddQuestionModal;