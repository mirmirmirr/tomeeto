import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './resources/ThemeContext';

import App from './App.jsx';
import Landing from './Landing.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import CreateEvent from './CreateEvent.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CreateEvent />
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
