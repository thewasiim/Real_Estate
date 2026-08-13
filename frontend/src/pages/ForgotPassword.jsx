import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Mail, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { authApi } from '../api/authApi';
import { validateEmail } from '../utils/validators';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    const emailError = validateEmail(email);
    setFieldError(emailError || '');
    if (emailError) return;
    setLoading(true);
    try {
      const response = await authApi.requestPasswordReset(email.trim());
      setSuccess(response.data.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to process your request. Please try again.');
    } finally { setLoading(false); }
  };

  return <main className="auth-page"><div className="auth-backdrop" /><div className="auth-card glass-panel">
    <div className="auth-header"><p className="eyebrow">Account recovery</p><h1>Reset your password</h1><p className="auth-subheader">Enter your email and we’ll send a secure reset link if an account is available.</p></div>
    {error && <div className="auth-error"><AlertCircle size={16} /><span>{error}</span></div>}
    {success && <div className="auth-success"><CheckCircle2 size={16} /><span>{success}</span></div>}
    {!success && <form onSubmit={handleSubmit} noValidate className="auth-form"><div className="form-group"><label htmlFor="email">Email Address</label><div className="input-icon-wrapper"><Mail size={18} className="input-icon" /><input id="email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setFieldError(''); }} placeholder="you@example.com" autoComplete="email" maxLength={100} /></div>{fieldError && <span className="field-error">{fieldError}</span>}</div><Button dark type="submit" disabled={loading} className="w-full auth-submit">{loading ? 'Sending link...' : 'Send reset link'} <ArrowRight size={16} style={{ marginLeft: '8px' }} /></Button></form>}
    <div className="auth-footer"><p>Remembered your password? <Link to="/login">Log in</Link></p></div>
  </div></main>;
}
