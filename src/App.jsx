import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/main.css';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import PublicProfile from './pages/PublicProfile';
import Appearance from './pages/Appearance';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/:username" element={<PublicProfile />} />
        <Route path="/appearance" element={<Appearance />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;