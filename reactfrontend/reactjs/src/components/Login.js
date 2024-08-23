// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import './style.css'; // Ensure this path is correct based on your file structure

// const Login = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [messages, setMessages] = useState([]);
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const payload = {
//             username,
//             password
//         };

//         try {
//             const response = await axios.post('http://127.0.0.1:8000/api/login/', payload);
//             console.log('User logged in successfully:', response.data);
//             navigate('/dashboard'); // Adjust the path as needed
//         } catch (error) {
//             console.error('There was an error!', error);
//             console.error('Error Response:', error.response);
//             setMessages(['Invalid username or password.']);
//         }
//     };

//     return (
//         <div className="container">
//             <h2 className="text-center">Login</h2>
//             <form onSubmit={handleSubmit}>
//                 {messages.length > 0 && (
//                     <div className="alert">
//                         {messages.map((message, index) => (
//                             <div key={index}>{message}</div>
//                         ))}
//                     </div>
//                 )}
//                 <div className="form-group">
//                     <input
//                         type="text"
//                         name="username"
//                         className="form-control"
//                         placeholder="Username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <input
//                         type="password"
//                         name="password"
//                         className="form-control"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <button type="submit" className="btn btn-primary">Login</button>
//             </form>
//             <p className="para">
//                 <Link to="/password-reset" className="accountlogin">Forgot your password?</Link>
//             </p>
//             <p className="para">or login by using</p>
//             <p className="para">Don't have an account? <Link to="/signup" className="accountlogin">Sign Up</Link></p>
//         </div>
//     );
// };

// export default Login;
