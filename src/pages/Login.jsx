import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { useToast } from '../components/toast/ToastContainer';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await authAPI.login({
        email: email,
        password: password
      });

      if (response.success) {
        // Sačuvaj token i user u localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect na dashboard
        toast.showSuccess('Login successful!');
        navigate('/dashboard'); // ako koristiš useNavigate
      }
    } catch (error) {
      console.log('ERROR', error)
      const errorMessage = 'Login failed';
      toast.showError(errorMessage);
    }
  };

  return (
    <div className="login-container">
      {/* Left side - Branding */}
      <div className="login-brand-side">
        <div className="brand-content">
          <div className="brand-logo">
            <div className="logo-icon">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <path d="M30 10L50 20V40L30 50L10 40V20L30 10Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="30" cy="30" r="8" fill="white"/>
              </svg>
            </div>
            <h1>Lynqio</h1>
          </div>
          <p className="brand-tagline">Your bio, amplified.</p>
          <div className="brand-features">
            <div className="feature-item">
              <i className="bi bi-link-45deg"></i>
              <span>Unlimited Links</span>
            </div>
            <div className="feature-item">
              <i className="bi bi-graph-up-arrow"></i>
              <span>Advanced Analytics</span>
            </div>
            <div className="feature-item">
              <i className="bi bi-palette"></i>
              <span>Custom Designs</span>
            </div>
          </div>
        </div>
        <div className="gradient-overlay"></div>
      </div>

      {/* Right side - Login Forma */}
      <div className="login-form-side">
        <div className="form-container">
          <div className="form-header">
            <h2>Welcome Back!</h2>
            <p>Login to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label" htmlFor="remember">
                  Remember me
                </label>
              </div>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="btn btn-primary w-100 login-btn">
              <span>Login</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="social-login">
            <button className="btn btn-outline-dark w-100 mb-3 social-btn">
              <i className="bi bi-google"></i>
              Continue with Google
            </button>
            <button className="btn btn-outline-primary w-100 social-btn">
              <i className="bi bi-facebook"></i>
              Continue with Facebook
            </button>
          </div>

          <div className="signup-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;