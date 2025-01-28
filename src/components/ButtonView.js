// ButtonView.js

import React, { useState, useEffect } from 'react';
import './ButtonView.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import choice from '../Assets/choice.svg';

const ButtonView = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const loginResult = location.state && location.state.loginResult;
  const navigate = useNavigate();
  const [lang_id, setSelectedLanguage] = useState('1'); // Default language
  const [languages, setLanguages] = useState([]); // State to hold fetched languages
  let deg = loginResult.sf_desg_cd;
  let sal_fun = loginResult.sales_function;
  let user_type = loginResult.user_type;

  const inactivityTime = 600000; // 10 minutes
  let timer;

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('HPLSMSREP/rp-ss/Language/DisplayLang');

        if (!response.ok) {
          throw new Error('Failed to fetch languages');
        }

        const data = await response.json();
        setLanguages(data.Record); // Set the languages from the API response
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages(); // Fetch languages when component mounts

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleLogout(); // Call logout after inactivity
      }, inactivityTime);
    };

    // Listen for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    resetTimer(); // Start the timer

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, [loginResult, navigate]);

  const handleLogout = () => {
    // Clear the login result from localStorage
    localStorage.removeItem('loginResult');

    // Log out the user and navigate to the home page
    logout();
    navigate('/');
  };

  const handleButtonClick = (type, deg1, sal_fun, lang_id, user_type) => {
    // Navigate to the TreeView page and pass data through state
    navigate('/TreeView', { state: { fileType: type, designation: deg1, sales_function: sal_fun, lang_id: lang_id, user_type: user_type } });
  };

  return (
    <div className="Blue_panel">
      <div className="Plane3">
        <div className="panel4 left-panel1">
          <div className="Plane5">
            <div className="logout-icon" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </div>
            <div>
              {loginResult && (
                <div>
                  <div id='name'>Welcome {loginResult.sf_short_name}</div>
                </div>
              )}
            </div>
            <h3>Please Select Option</h3>
          </div>
          <img src={choice} className="btn_img" alt="" />
        </div>
      </div>

      <div className="Plane2">
        <div className="Plane1">
          {/* Language dropdown list commented out */}
          {/* 
          <select value={lang_id} onChange={(e) => setSelectedLanguage(e.target.value)}>
            {languages.map(language => (
              <option key={language.lang_id} value={language.lang_id}>
                {language.lang_name}
              </option>
            ))}
          </select>
           */}
          <div className="btn_title" onClick={() => handleButtonClick('MNL', deg, sal_fun, user_type)}>User Manual PDF</div>
          <div className="btn_title" onClick={() => handleButtonClick('VDO', deg, sal_fun, user_type)}>User Manual Video</div>
        </div>
      </div>
    </div>
  );
};

export default ButtonView;
