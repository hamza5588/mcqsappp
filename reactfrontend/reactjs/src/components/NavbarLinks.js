// src/components/Navbar.js
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './NavbarLinks.css';
import Text from '../pages/Text';
import Subject from '../pages/Subject';
import File from '../pages/File';
import Prompt from '../pages/Prompt';
import URL from '../pages/URL';

const NavbarLinks = () => {
  return (
    <nav className="navbarlinks">
      <ul>
        <li><Link to="/text">Text</Link></li>
        <li><Link to="/subject">Subject</Link></li>
        <li><Link to="/file">File</Link></li>
        <li><Link to="/prompt">Prompt</Link></li>
        <li><Link to="/url">Link</Link></li>
      </ul>
      <Routes>
          <Route  path='/' element={<Text/>} Component={Text}/>
          <Route  path='/text' element={<Text/>} Component={Text}/>
          <Route path="/Subject" element={<Subject />} Component={Subject} />
          <Route path="/file" element={<File/>} Component={File} />
          <Route path="/prompt" element={<Prompt />} Component={Prompt} />
          <Route path="/url" element={<URL />} Component={URL}/>
        </Routes>
    </nav>
  );
};

export default NavbarLinks;
