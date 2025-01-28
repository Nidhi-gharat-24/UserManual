// NextPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from './AuthContext';


function NextPage() {
  const { logout } = useAuth();
  const location = useLocation();
  const loginResult = location.state && location.state.loginResult;
  const navigate = useNavigate(); // Import useNavigate and use it here

  const handleLogout = () => {
    logout(); // Set authentication status to false
    navigate('/'); // Navigate to the login page
  };

  return (
    <div>
      <h2>Next Page</h2>
      {loginResult && (
        <div>
          <strong>Login Result:</strong>
          <div>Name: {loginResult.sf_short_name}</div>
          <div>Designation: {loginResult.sf_desg_cd}</div>
          <button onClick={handleLogout}>Logout</button>
          {/* Add more properties as needed */}
        </div>
      )}
    </div>
  );
}

export default NextPage;
