import React, { useState } from 'react';

function AddTrueFalseModal({ isOpen, onClose, onAdd }) {
    const [newQuestion, setNewQuestion] = useState({
        question: '',
        correct_answer: true  // Default to True
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewQuestion((prev) => ({
            ...prev,
            [name]: value === 'true'
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
                <h2>Add New True/False Question</h2>
                <form>
                    <label>
                        Question Text:
                        <input
                            type="text"
                            name="question"
                            value={newQuestion.question}
                            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                        />
                    </label>
                    <label>
                        Correct Answer:
                        <select name="correct_answer" value={newQuestion.correct_answer} onChange={handleChange}>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </label>
                    <button type="button" onClick={handleAdd}>Add Question</button>
                    <button type="button" onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    );
}

export default AddTrueFalseModal;
