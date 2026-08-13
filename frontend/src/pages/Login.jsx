import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { validateEmail, validatePassword } from '../utils/validators';

export default function Login() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const validateForm = () => {
    const errors = {};
    const emailErr = validateEmail(email);
    if (emailErr) errors.email = emailErr;

    const passErr = validatePassword(password);
    if (passErr) errors.password = passErr;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const from = location.state?.from?.pathname || '/';
      const res = await login(email.trim(), password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-backdrop" />
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <p className="eyebrow">Welcome back</p>
          <h1>Log in to F.B. Developer</h1>
          <p className="auth-subheader">Manage your favorites, visits, and consultations.</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-icon-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null });
                }}
                placeholder="you@example.com"
                autoComplete="email"
                maxLength={100}
              />
            </div>
            {fieldErrors.email && <span style={{ color: '#e53e3e', fontSize: '11px', marginTop: '4px', display: 'block' }}>{fieldErrors.email}</span>}
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8125rem', color: '#0071E3' }}>
                Forgot password?
              </Link>
            </div>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                maxLength={100}
              />
            </div>
            {fieldErrors.password && <span style={{ color: '#e53e3e', fontSize: '11px', marginTop: '4px', display: 'block' }}>{fieldErrors.password}</span>}
          </div>

          <Button dark type="submit" disabled={loading} className="w-full auth-submit">
            {loading ? 'Logging in...' : 'Log In'} <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#111', fontWeight: 600, textDecoration: 'underline' }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

