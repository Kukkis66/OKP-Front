import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/reset.css'
import { ConfirmEmailPage } from './components/ConfirmEmailPage.jsx'
import { ResetPasswordPage } from './components/ResetPasswordPage.jsx'
import {Routes, Route } from "react-router-dom";

import { AuthProvider } from './context/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ForgotPasswordPage } from './components/ForgotPasswordPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<App /> }/>
          <Route path="/confirm-email" element={<ConfirmEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        </Routes>
      </BrowserRouter> */}
    </AuthProvider>
  </React.StrictMode>,
)
