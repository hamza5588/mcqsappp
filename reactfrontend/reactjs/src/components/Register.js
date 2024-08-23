// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './style.css'; // Ensure this path is correct based on your file structure

// const Register = () => {
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [phone, setPhone] = useState('');
//     const [password1, setPassword1] = useState('');
//     const [password2, setPassword2] = useState('');
//     const [messages, setMessages] = useState([]);
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (password1 !== password2) {
//             setMessages(['Passwords do not match']);
//             return;
//         }

//         const payload = {
//             username,
//             email,
//             phone,
//             password: password1,  // Correcting the key for password
//         };

//         try {
//             const response = await axios.post('http://127.0.0.1:8000/api/register/', payload, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//             console.log('User registered successfully:', response.data);
//             navigate('/login');
//         } catch (error) {
//             console.error('There was an error!', error);
//             console.error('Error Response:', error.response);
//             if (error.response && error.response.data) {
//                 const errorMessages = Object.values(error.response.data).flat();
//                 setMessages(errorMessages);
//             } else {
//                 setMessages(['An error occurred. Please try again.']);
//             }
//         }
//     };

//     return (
//         <div className="container">
//             <h2 className="text-center">Sign Up</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <input
//                         type="text"
//                         name="username"
//                         className="form-control"
//                         placeholder="Full Name"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <input
//                         type="email"
//                         name="email"
//                         className="form-control"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <input
//                         type="text"
//                         name="phone"
//                         className="form-control"
//                         placeholder="Phone (Optional)"
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group">
//                     <input
//                         type="password"
//                         name="password1"
//                         className="form-control"
//                         placeholder="Password"
//                         value={password1}
//                         onChange={(e) => setPassword1(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <input
//                         type="password"
//                         name="password2"
//                         className="form-control"
//                         placeholder="Confirm Password"
//                         value={password2}
//                         onChange={(e) => setPassword2(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <button type="submit" className="btn btn-primary float-left">Create Account</button>
//                 {messages.length > 0 && (
//                     <div className="alert">
//                         {messages.map((message, index) => (
//                             <div key={index}>{message}</div>
//                         ))}
//                     </div>
//                 )}
//             </form>
//             <p className="para">or sign up by using</p>
//             <p>Already have an account? <a className="accountlogin" href="/login">Login</a></p>
//         </div>
//     );
// };

// export default Register;
