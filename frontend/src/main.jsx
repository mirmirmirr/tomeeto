import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Landing from './Landing.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Signup />
  </StrictMode>
);
