import { Routes, Route } from 'react-router-dom';
import Landing from './Landing.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Result from './Results.jsx';
import Availability from './Availability.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/results" element={<Result />} />
      <Route path="/availability" element={<Availability />} />
    </Routes>
  );
}

export default App;