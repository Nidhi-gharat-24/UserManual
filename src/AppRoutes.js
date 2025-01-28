import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ButtonView from './ButtonView';
import TreeView from './TreeView';
import NextPage from './NextPage';
import Protected from './Protected';
 
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Button_view" element={<Protected Cmp={ButtonView} />} />
      <Route path="/TreeView" element={<Protected Cmp={TreeView} />} />
      <Route path="/NextPage" element={<Protected Cmp={NextPage} />} />
    </Routes>
  );
}
 
export default AppRoutes;