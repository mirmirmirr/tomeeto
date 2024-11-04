import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Results from './pages/Results.jsx';
import Availability from './pages/Availability.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/results" element={<Results />} />
        <Route path="/landing" element={<Availability />} />
      </Routes>
    </Router>
  );
}

export default App;
