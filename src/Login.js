


import './LoginSignup.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import icon from './Assets/icon.png';
import login_svg from './Assets/login_svg.svg';
import eye_icon_open from './Assets/eye_open.png';
import eye_icon_close from './Assets/eye-off.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import Model from './Model'; // Import the modal component

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [loginResult, setLoginResult] = useState(null); // State for login result
  const navigate = useNavigate();
  const apiEndpoint = '/HPLSMSREP/rp-ss/UserManualApi/checkUsersManualLogin'; // Using relative URL
  
  useEffect(() => {
    // Check if user is already logged in
    const storedLoginResult = localStorage.getItem('loginResult');
    const storedRoute = localStorage.getItem('currentRoute');

    if (storedLoginResult) {
      const parsedLoginResult = JSON.parse(storedLoginResult);
      setLoginResult(parsedLoginResult);
      login();

      // Navigate to the last visited route
      if (storedRoute) {
        navigate(storedRoute, { state: { loginResult: parsedLoginResult } });
      } else {
        navigate('/Button_view', { state: { loginResult: parsedLoginResult } });
      }
    }
  }, [login, navigate]);

  const handleNameChange = (value) => {
    setName(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    const params = {
      mobile_no: name,
      password: password,
    };

    // Make a GET request to the relative API endpoint
    axios
      .get(apiEndpoint, { params: params })
      .then((response) => {
        console.log('Login successful:', response.data);
        if (response.data === 'Incorrect Password') {
          setError('Login failed. Please check your credentials.');
        } else {
          setError(''); // Clear the error message
          setLoginResult(response.data);
          localStorage.setItem('loginResult', JSON.stringify(response.data)); // Save login result to localStorage
          setShowModal(true); // Show the modal
        }
      })
      .catch((error) => {
        console.error('Login failed:', error);
        setError('Login failed. Please check your credentials.');
      });
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
    login();
    localStorage.setItem('currentRoute', '/Button_view'); // Save the route to localStorage
    navigate('/Button_view', { state: { loginResult: loginResult } }); // Navigate to the ButtonView route with loginResult
  };

  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <div className="sign-in-form">
            <img src={icon} className="imageLOGO" alt="Logo" />
            <h2 className="title">LOG IN</h2>
            <div className="input-field">
              <i className="fas fa-user"><FontAwesomeIcon icon={faUser} /></i>
              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"><FontAwesomeIcon icon={faLock} /></i>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
              <div className="eye-icon" onClick={togglePasswordVisibility}>
                <img
                  src={showPassword ? eye_icon_open : eye_icon_close}
                  alt={showPassword ? 'Open Eye' : 'Closed Eye'}
                />
              </div>
            </div>
            <input
              type="submit"
              value="Login"
              className="btn solid"
              onClick={handleLogin}
            />
            {error && <div style={{ color: 'red' }}>{error}</div>}
          </div>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>USER MANUAL APPLICATION</h3>
          </div>
          <img src={login_svg} className="image" alt="" />
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={require('./Assets/path_to_your_green_tick.gif')}
                alt="Green Tick"
                style={{ marginBottom: '10px', width: '50px', height: '50px' }}
              />
              <p>Login Successful !!!</p>
            </div>
            <div className="modal-footer">
              <button className="close-button" onClick={closeModal}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;

