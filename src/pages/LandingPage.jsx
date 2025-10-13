import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../styles/LandingPage.css';

function LandingPage() {
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: 'bi-link-45deg',
      title: 'Unlimited Links',
      description: 'Add as many links as you want. No restrictions, no limits. Share everything that matters.'
    },
    {
      icon: 'bi-graph-up-arrow',
      title: 'Advanced Analytics',
      description: 'Track clicks, views, and engagement. Understand your audience with detailed insights.'
    },
    {
      icon: 'bi-palette',
      title: 'Full Customization',
      description: 'Design your page exactly how you want. Customize colors, fonts, backgrounds, and more.'
    },
    {
      icon: 'bi-lightning-charge',
      title: 'Lightning Fast',
      description: 'Your page loads instantly. Optimized for speed and performance on all devices.'
    },
    {
      icon: 'bi-phone',
      title: 'Mobile Optimized',
      description: 'Looks perfect on every screen. Responsive design that works seamlessly everywhere.'
    },
    {
      icon: 'bi-shield-check',
      title: 'Secure & Reliable',
      description: '99.9% uptime guarantee. Your links are always accessible and protected.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Content Creator',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=667eea&color=fff',
      text: 'Lynqio completely transformed how I share my content. The customization options are endless, and my audience loves the clean, professional look!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Digital Marketer',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=764ba2&color=fff',
      text: 'The analytics feature is a game-changer. I can finally see which content resonates with my audience. Highly recommend!',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Small Business Owner',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=48bb78&color=fff',
      text: 'Setting up my Lynqio page took less than 5 minutes. It\'s now the hub for all my business links. Simple, elegant, effective.',
      rating: 5
    }
  ];

  const stats = [
    { number: '500K+', label: 'Active Users' },
    { number: '10M+', label: 'Links Created' },
    { number: '50M+', label: 'Monthly Clicks' },
    { number: '99.9%', label: 'Uptime' }
  ];

  const handleEarlyAccess = (e) => {
    e.preventDefault();
    console.log('Early access signup:', email);
    // Backend integracija kasnije
    alert('Thanks for your interest! We\'ll notify you soon.');
    setEmail('');
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">
              <svg width="35" height="35" viewBox="0 0 60 60" fill="none">
                <path d="M30 10L50 20V40L30 50L10 40V20L30 10Z" stroke="#667eea" strokeWidth="3"/>
                <circle cx="30" cy="30" r="8" fill="#667eea"/>
              </svg>
            </div>
            <span>Lynqio</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#pricing">Pricing</a>
            <Link to="/login" className="btn-nav-login">Login</Link>
            <Link to="/register" className="btn-nav-signup">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <i className="bi bi-stars"></i>
            <span>Trusted by 500,000+ creators worldwide</span>
          </div>
          
          <h1 className="hero-title">
            One Link.
            <span className="gradient-text"> Infinite Possibilities.</span>
          </h1>
          
          <p className="hero-subtitle">
            Share everything you create, curate, and sell online. All from one simple link in your bio.
          </p>

          <div className="hero-cta">
            <Link to="/register" className="btn-hero-primary">
              <span>Start For Free</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
            <a href="#demo" className="btn-hero-secondary">
              <i className="bi bi-play-circle"></i>
              <span>Watch Demo</span>
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <i className="bi bi-check-circle-fill"></i>
              <span>Free forever plan</span>
            </div>
            <div className="stat-item">
              <i className="bi bi-check-circle-fill"></i>
              <span>No credit card required</span>
            </div>
            <div className="stat-item">
              <i className="bi bi-check-circle-fill"></i>
              <span>Setup in 2 minutes</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Demo */}
        <div className="hero-demo">
          <div className="demo-container">
            <div className="demo-browser">
              <div className="browser-header">
                <div className="browser-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="browser-url">lynqio.com/yourusername</div>
              </div>
              <div className="browser-content">
                <img 
                  src="https://ui-avatars.com/api/?name=Alex+Smith&background=667eea&color=fff&size=80"
                  alt="Profile"
                  className="demo-avatar"
                />
                <h3>Alex Smith</h3>
                <p>Content Creator & Designer</p>
                <div className="demo-links">
                  <div className="demo-link">
                    <i className="bi bi-briefcase"></i>
                    <span>My Portfolio</span>
                  </div>
                  <div className="demo-link">
                    <i className="bi bi-instagram"></i>
                    <span>Instagram</span>
                  </div>
                  <div className="demo-link">
                    <i className="bi bi-youtube"></i>
                    <span>YouTube</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h2>{stat.number}</h2>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <span className="section-badge">Features</span>
          <h2>Everything you need to succeed</h2>
          <p>Powerful features that help you share your world</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <i className={`bi ${feature.icon}`}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-header">
          <span className="section-badge">Testimonials</span>
          <h2>Loved by creators worldwide</h2>
          <p>See what our users are saying</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill"></i>
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <img src={testimonial.avatar} alt={testimonial.name} />
                <div>
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-header">
          <span className="section-badge">Pricing</span>
          <h2>Choose your plan</h2>
          <p>Start free, upgrade when you're ready</p>
        </div>

        <div className="pricing-grid">
          {/* Free Plan */}
          <div className="pricing-card">
            <div className="plan-header">
              <h3>Free</h3>
              <div className="plan-price">
                <span className="price">$0</span>
                <span className="period">/month</span>
              </div>
              <p>Perfect to get started</p>
            </div>
            <ul className="plan-features">
              <li><i className="bi bi-check-lg"></i> Unlimited links</li>
              <li><i className="bi bi-check-lg"></i> Basic analytics</li>
              <li><i className="bi bi-check-lg"></i> Customizable themes</li>
              <li><i className="bi bi-check-lg"></i> Mobile optimized</li>
            </ul>
            <Link to="/register" className="btn-plan">Get Started</Link>
          </div>

          {/* Pro Plan */}
          <div className="pricing-card featured">
            <div className="popular-badge">Most Popular</div>
            <div className="plan-header">
              <h3>Pro</h3>
              <div className="plan-price">
                <span className="price">$9</span>
                <span className="period">/month</span>
              </div>
              <p>For serious creators</p>
            </div>
            <ul className="plan-features">
              <li><i className="bi bi-check-lg"></i> Everything in Free</li>
              <li><i className="bi bi-check-lg"></i> Advanced analytics</li>
              <li><i className="bi bi-check-lg"></i> Custom domain</li>
              <li><i className="bi bi-check-lg"></i> Remove Lynqio branding</li>
              <li><i className="bi bi-check-lg"></i> Priority support</li>
              <li><i className="bi bi-check-lg"></i> Scheduled links</li>
            </ul>
            <Link to="/register" className="btn-plan primary">Get Started</Link>
          </div>

          {/* Business Plan */}
          <div className="pricing-card">
            <div className="plan-header">
              <h3>Business</h3>
              <div className="plan-price">
                <span className="price">$29</span>
                <span className="period">/month</span>
              </div>
              <p>For teams and agencies</p>
            </div>
            <ul className="plan-features">
              <li><i className="bi bi-check-lg"></i> Everything in Pro</li>
              <li><i className="bi bi-check-lg"></i> Team collaboration</li>
              <li><i className="bi bi-check-lg"></i> Multiple users</li>
              <li><i className="bi bi-check-lg"></i> White-label solution</li>
              <li><i className="bi bi-check-lg"></i> API access</li>
              <li><i className="bi bi-check-lg"></i> Dedicated support</li>
            </ul>
            <Link to="/register" className="btn-plan">Get Started</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to amplify your bio?</h2>
          <p>Join 500,000+ creators who trust Lynqio to share their world</p>
          <form className="cta-form" onSubmit={handleEarlyAccess}>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">
              <span>Get Started Free</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          </form>
          <p className="cta-note">No credit card required • Free forever plan</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="brand-icon">
                <svg width="30" height="30" viewBox="0 0 60 60" fill="none">
                  <path d="M30 10L50 20V40L30 50L10 40V20L30 10Z" stroke="#667eea" strokeWidth="3"/>
                  <circle cx="30" cy="30" r="8" fill="#667eea"/>
                </svg>
              </div>
              <span>Lynqio</span>
            </div>
            <p>Your bio, amplified.</p>
            <div className="social-links">
              <a href="#"><i className="bi bi-twitter"></i></a>
              <a href="#"><i className="bi bi-instagram"></i></a>
              <a href="#"><i className="bi bi-linkedin"></i></a>
              <a href="#"><i className="bi bi-github"></i></a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#">Templates</a>
              <a href="#">Integrations</a>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>

            <div className="footer-column">
              <h4>Resources</h4>
              <a href="#">Help Center</a>
              <a href="#">Documentation</a>
              <a href="#">API</a>
              <a href="#">Status</a>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Lynqio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;