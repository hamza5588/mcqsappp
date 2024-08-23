import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styling/MessagesInput.css';
import BtnText from '../build quiz btn/BtnText';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const maxWords = 200;
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const words = e.target.value.split(/\s+/).filter(word => word.length > 0);
    if (words.length <= maxWords) {
      setMessage(e.target.value);
    } else {
      setMessage(words.slice(0, maxWords).join(" "));
    }
  };

  const handleSubmit = async () => {
    const payload = {
      text: message,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/receive_text/', payload);
      console.log('Submitted text:', response.data);
      navigate('/BuildQuiz');
    } catch (error) {
      console.error('There was an error!', error);
      console.error('Error Response:', error.response);
    }
  };

  return (
    <div className='msg-div'>
      <div className='msg-div-2'>
        <div className="input-container">
          <textarea
            className="message-input"
            placeholder="Type your message here..."
            value={message}
            onChange={handleInputChange}
          />
        </div>
        <BtnText handleClick={handleSubmit} />
      </div>
    </div>
  );
};

export default MessageInput;
