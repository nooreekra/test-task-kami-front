import React from 'react';
import { Products } from './components/products/Products';
import { Routes, Route, Navigate } from "react-router-dom";
import './App.scss'
import { CreateOrEdit } from './components/create/CreateOrEdit';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<Navigate to="/products" replace />}/>
          <Route path="/products" element={<Products />}/>
          <Route path="/products/create" element={<CreateOrEdit />}/>
          <Route path="/products/edit/:id" element={<CreateOrEdit />}/>
        </Routes>
    </div>
  );
}

export default App;
