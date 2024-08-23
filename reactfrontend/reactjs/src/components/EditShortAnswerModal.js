import React, { useState, useEffect } from 'react';

function EditShortAnswerModal({ isOpen, onClose, question, onSave }) {
    const [updatedQuestion, setUpdatedQuestion] = useState({ ...question });

    useEffect(() => {
        setUpdatedQuestion({ ...question });
    }, [question]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedQuestion((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        onSave(updatedQuestion);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Short Answer Question</h2>
                <form>
                    <label>
                        Question Text:
                        <input
                            type="text"
                            name="question"
                            value={updatedQuestion.question || ''}
                            onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, question: e.target.value })}
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

export default EditShortAnswerModal;
