import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { useToast } from '../components/toast/ToastContainer';
import '../styles/Register.css';

function Register() {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validacija username-a
    if (!formData.username || formData.username.length < 3) {
      toast.showError('Username must be at least 3 characters');
      return;
    }

    /*if (usernameAvailable === false) {
      toast.showError('Username is already taken. Please choose another.');
      return;
    }*/
    
    try {
      //formData['username'] = formData.email.split('@')[0];
      // Poziv backend API-ja
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName
      });

      if (response.success) {
        // Sačuvaj token i user
        //localStorage.setItem('token', response.data.token);
        //localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast.showSuccess('Registration successful!');
        console.log('DANAS JE DIVAN DAN')
        
        // Redirect na dashboard
        navigate('/login');
      }
    } catch (error) {
      console.log('REGISTRATION ERROR:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.showError(errorMessage);
    }
  };

  return (
    <div className="register-container">
      {/* Leva strana - Branding */}
      <div className="register-brand-side">
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
          <p className="brand-tagline">Join thousands of creators</p>
          <div className="brand-stats">
            <div className="stat-item">
              <h3>50K+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-item">
              <h3>1M+</h3>
              <p>Links Created</p>
            </div>
            <div className="stat-item">
              <h3>99.9%</h3>
              <p>Uptime</p>
            </div>
          </div>
          <div className="testimonial">
            <i className="bi bi-quote"></i>
            <p>"Lynqio transformed how I share my content. Simple, powerful, and beautiful!"</p>
            <span>- Sarah M., Content Creator</span>
          </div>
        </div>
        <div className="gradient-overlay"></div>
      </div>

      {/* Desna strana - Register Forma */}
      <div className="register-form-side">
        <div className="form-container">
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Start your journey with Lynqio today</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-at"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="yourusername"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  pattern="[a-z0-9-]{3,50}"
                  title="Username: 3-50 characters, lowercase letters, numbers, and hyphens only"
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
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
              <small className="text-muted">At least 8 characters</small>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-shield-check"></i>
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                required
              />
              <label className="form-check-label terms-label" htmlFor="terms">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100 register-btn">
              <span>Create Account</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          </form>

          {/*<div className="divider">
            <span>OR</span>
          </div>

          <div className="social-register">
            <button className="btn btn-outline-dark w-100 mb-3 social-btn">
              <i className="bi bi-google"></i>
              Sign up with Google
            </button>
            <button className="btn btn-outline-primary w-100 social-btn">
              <i className="bi bi-facebook"></i>
              Sign up with Facebook
            </button>
          </div>*/}

          <div className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;