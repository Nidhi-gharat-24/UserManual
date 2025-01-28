// App.js or your main component

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from './AuthContext';
import Protected from './Protected';
import ButtonView from './components/ButtonView';
import TreeView from './components/TreeView';


function App() {
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [selectedDeg, setSelectedDeg] = useState(null);

  const handleButtonClick = (type, deg1) => {
    // Handle the button click values
    setSelectedFileType(type);
    setSelectedDeg(deg1);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Login />} />
          <Route
            path="/Button_view"
            element={<Protected Cmp={ButtonView} onButtonClick={handleButtonClick} />}
          />
          <Route path="/TreeView" element={<Protected Cmp={TreeView} />} />
        </Routes>
      </Router>

      {/* Render TreeView with selectedFileType and selectedDeg */}
      {/* {selectedFileType && selectedDeg && <TreeView fileType={selectedFileType} deg={selectedDeg} />} */}
    </AuthProvider>
  );
}


export default App;