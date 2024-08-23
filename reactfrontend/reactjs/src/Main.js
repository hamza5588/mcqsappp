import React from 'react';
import './Main.css'; // Make sure to create and import a CSS file for styling
import NavbarLinks from './components/NavbarLinks';

const Main = () => {
  return (
    <div className="container">
      <div className="left-sidebar">
        <div className="leftside-navbar-section">
          {/* Sidebar Content */}
          <div className="menu-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
            </svg>
          </div>
          <div className="create-new-quiz">
            <button>Create New Quiz</button>
          </div>
          <div className="recent-quiz">
            <h3>Recent Quiz</h3>
          </div>
          <div className="quiz-number">
            <h5>Quiz No #1</h5>
            <h5>Quiz No #2</h5>
            <h5>Quiz No #3</h5>
            <h5>Quiz No #4</h5>
          </div>
          <div className="show-more">
            <button>Show More</button>
          </div>
          <div className="my-quizzes">
            <h5>My Quizzes</h5>
            <h5>My Quizzes</h5>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="content-section">
          <div className="rightside-navbar">
            <nav className="navbar">
              <div className="logo">Logo</div>
              <div className="profile-photo">
                {/* <img src="https://via.placeholder.com/40" alt="Profile Photo" /> */}
              </div>
            </nav>
          </div>
        </div>
        <div className="content-section-h3">
          <div className="build-quiz-h3">
            <h3 className='building-quiz-heading'>Build Quiz</h3>
          </div>
        </div>
        <div className="content-section-last">
          <NavbarLinks /> {/* Ensure NavbarLinks is inside the content section if you want it to appear there */}
        </div>
      </div>
    </div>
  );
};

export default Main;
