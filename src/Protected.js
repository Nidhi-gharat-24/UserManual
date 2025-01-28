// Protected.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Protected(props) {
  const { Cmp } = props;
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to the login page if not authenticated
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return <div>{isAuthenticated && <Cmp />}</div>;
}

export default Protected;

