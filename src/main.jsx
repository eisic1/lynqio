import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import { ToastProvider } from './components/ToastContainer.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </ToastProvider>
  </StrictMode>,
)

