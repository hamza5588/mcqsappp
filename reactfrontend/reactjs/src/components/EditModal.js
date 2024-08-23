import React, { useState, useEffect } from 'react';

function EditModal({ isOpen, onClose, question, onSave }) {
  const [updatedQuestion, setUpdatedQuestion] = useState({ ...question });

  useEffect(() => {
    setUpdatedQuestion({ ...question });
  }, [question]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving updated question:", updatedQuestion); // Debugging log
    onSave(updatedQuestion); // Call the parent component's save handler
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Question</h2>
        <form>
          <label>
            Question Text:
            <input
              type="text"
              name="question"
              value={updatedQuestion.question || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Option A:
            <input
              type="text"
              name="option_a"
              value={updatedQuestion.option_a || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Option B:
            <input
              type="text"
              name="option_b"
              value={updatedQuestion.option_b || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Option C:
            <input
              type="text"
              name="option_c"
              value={updatedQuestion.option_c || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Option D:
            <input
              type="text"
              name="option_d"
              value={updatedQuestion.option_d || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Correct Answer:
            <input
              type="text"
              name="correct_answer"
              value={updatedQuestion.correct_answer || ''}
              onChange={handleChange}
            />
          </label>
          <button type="button" onClick={handleSave}>Save</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
}

export default EditModal;