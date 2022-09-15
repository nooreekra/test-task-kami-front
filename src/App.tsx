import React from 'react';
import { Products } from './components/products/Products';
import { Routes, Route, Navigate } from "react-router-dom";
import './App.scss'
import { CreateOrEdit } from './components/create/CreateOrEdit';

export enum ROUTES {
  CREATE = '/products/create',
  PRODUCTS = '/products',
  EDIT = '/products/edit/:id'
}


function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<Navigate to={ROUTES.PRODUCTS} replace />}/>
          <Route path={ROUTES.PRODUCTS} element={<Products />}/>
          <Route path={ROUTES.CREATE} element={<CreateOrEdit />}/>
          <Route path={ROUTES.EDIT} element={<CreateOrEdit />}/>
        </Routes>
    </div>
  );
}

export default App;
