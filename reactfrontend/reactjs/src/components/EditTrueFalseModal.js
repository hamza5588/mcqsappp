import React, { useState, useEffect } from 'react';

function EditTrueFalseModal({ isOpen, onClose, question, onSave }) {
    const [updatedQuestion, setUpdatedQuestion] = useState({ ...question });

    useEffect(() => {
        setUpdatedQuestion({ ...question });
    }, [question]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedQuestion((prev) => ({
            ...prev,
            [name]: value === 'true'
        }));
    };

    const handleSave = () => {
        onSave(updatedQuestion);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit True/False Question</h2>
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
                        <select name="correct_answer" value={updatedQuestion.correct_answer} onChange={handleChange}>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </label>
                    <button type="button" onClick={handleSave}>Save</button>
                    <button type="button" onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    );
}

export default EditTrueFalseModal;
