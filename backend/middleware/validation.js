// Email validation
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Username validation (lowercase, numbers, hyphens)
const validateUsername = (username) => {
  const regex = /^[a-z0-9-]{3,50}$/;
  return regex.test(username);
};

// Password strength validation
const validatePassword = (password) => {
  // Minimum 8 characters, at least one letter and one number
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return regex.test(password);
};

// URL validation
const validateURL = (url) => {
  const regex = /^https?:\/\/.+/;
  return regex.test(url);
};

// Registration validation middleware
const validateRegistration = (req, res, next) => {
  const { username, email, password, full_name } = req.body;

  // Check required fields
  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Username, email, and password are required.' 
    });
  }

  // Validate email
  if (!validateEmail(email)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid email format.' 
    });
  }

  // Validate username
  if (!validateUsername(username)) {
    return res.status(400).json({ 
      success: false,
      message: 'Username must be 3-50 characters, lowercase letters, numbers, and hyphens only.' 
    });
  }

  // Validate password
  if (!validatePassword(password)) {
    return res.status(400).json({ 
      success: false,
      message: 'Password must be at least 8 characters with at least one letter and one number.' 
    });
  }

  next();
};

// Login validation middleware
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Email and password are required.' 
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid email format.' 
    });
  }

  next();
};

module.exports = {
  validateEmail,
  validateUsername,
  validatePassword,
  validateURL,
  validateRegistration,
  validateLogin
};