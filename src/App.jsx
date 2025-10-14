import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/main.css';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import PublicProfile from './pages/PublicProfile';
import Appearance from './pages/Appearance';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/:username" element={<PublicProfile />} />
        <Route path="/appearance" element={<Appearance />} />
      </Routes>
    </Router>
  );
}

export default App;