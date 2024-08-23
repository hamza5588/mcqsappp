import React, { useState } from 'react';

function AddShortAnswerModal({ isOpen, onClose, onAdd }) {
    const [newQuestion, setNewQuestion] = useState({
        question: '',
        correct_answer: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewQuestion((prev) => ({
            ...prev,
            [name]: value
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
                <h2>Add New Short Answer Question</h2>
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

export default AddShortAnswerModal;