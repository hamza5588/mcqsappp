import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function AddQAModal({ isOpen, onClose, onAdd }) {
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const handleAdd = () => {
    const questionData = {
      question: newQuestion,
      answer: newAnswer,
    };
    onAdd(questionData);
    setNewQuestion('');
    setNewAnswer('');
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Question and Answer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label htmlFor="new-question">Question</label>
          <input
            type="text"
            className="form-control"
            id="new-question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="new-answer">Answer</label>
          <textarea
            className="form-control"
            id="new-answer"
            rows="3"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAdd}>
          Add Question
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddQAModal;
