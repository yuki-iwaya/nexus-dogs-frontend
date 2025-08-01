import React, { useState } from 'react';
import './Login.css';

const LOGIN_API_URL = process.env.REACT_APP_LOGIN_API_URL || 'http://localhost:8080/api/v1/login';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(LOGIN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      console.log('Status:', response.status);
      console.log('OK:', response.ok);

      // Try to parse JSON only if there is a body
      let result = null;
      const text = await response.text();
      if (text) {
        try {
          result = JSON.parse(text);
        } catch (jsonError) {
          console.warn('Response is not valid JSON:', jsonError);
        }
      } else {
        console.warn('Response body is empty');
      }
      console.log('Body:', response);

      if (response.ok && result.token) {
        console.log('Login successful:', result);
        localStorage.setItem('token', result.token); // 保存
        window.location.href = '/dashboard'; // ダッシュボードへ遷移
        // Here you can handle successful login (e.g., store token, redirect) 
      } else {
        console.error('Login failed:', result);
        alert('Login failed. Please check your email and password.');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form__group">
            <label className="form__label" htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form__input"
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form__group">
            <label className="form__label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form__input"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <div className="form__options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            {/* <a href="#" className="forgot-password">Forgot password?</a> */}
          </div>
          
          <button 
            type="submit"
            className={`button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <a href="/user/register">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
