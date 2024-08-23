import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function EditQAModal({ isOpen, onClose, question, onSave }) {
  const [editedQuestion, setEditedQuestion] = useState(question.question);
  const [editedAnswer, setEditedAnswer] = useState(question.answer);

  const handleSave = () => {
    const updatedQuestion = {
      ...question,
      question: editedQuestion,
      answer: editedAnswer,
    };
    onSave(updatedQuestion);
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Question and Answer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label htmlFor="edit-question">Question</label>
          <input
            type="text"
            className="form-control"
            id="edit-question"
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="edit-answer">Answer</label>
          <textarea
            className="form-control"
            id="edit-answer"
            rows="3"
            value={editedAnswer}
            onChange={(e) => setEditedAnswer(e.target.value)}
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditQAModal;
