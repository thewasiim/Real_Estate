import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import { authApi } from '../api/authApi';
import { validatePassword } from '../utils/validators';

const INVALID_LINK = 'This password reset link is invalid, expired, or has already been used.';

function PasswordField({ id, label, value, onChange, visible, onToggle, error }) {
  return <div className="form-group"><label htmlFor={id}>{label}</label><div className="input-icon-wrapper"><Lock size={18} className="input-icon" /><input id={id} type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} placeholder="••••••••" autoComplete="new-password" maxLength={100} /><button type="button" className="password-visibility-toggle" onClick={onToggle} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} aria-pressed={visible}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{error && <span className="field-error">{error}</span>}</div>;
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) { setError(INVALID_LINK); setChecking(false); return; }
      try { await authApi.verifyPasswordResetToken(token); } catch { setError(INVALID_LINK); } finally { setChecking(false); }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault(); setError('');
    const errors = {};
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;
    setLoading(true);
    try {
      const response = await authApi.resetPassword({ token, password, confirmPassword });
      setSuccess(response.data.data.message); setPassword(''); setConfirmPassword('');
    } catch (err) { setError(err.response?.data?.error || 'Unable to reset your password. Please request another link.'); } finally { setLoading(false); }
  };

  return <main className="auth-page"><div className="auth-backdrop" /><div className="auth-card glass-panel">
    <div className="auth-header"><p className="eyebrow">Account recovery</p><h1>Choose a new password</h1><p className="auth-subheader">Your new password must be at least 6 characters long.</p></div>
    {checking && <p className="auth-status">Validating your secure reset link…</p>}
    {error && <div className="auth-error"><AlertCircle size={16} /><span>{error}</span></div>}
    {success && <div className="auth-success"><CheckCircle2 size={16} /><span>{success}</span></div>}
    {!checking && !error && !success && <form onSubmit={handleSubmit} noValidate className="auth-form"><PasswordField id="new-password" label="New Password" value={password} onChange={(value) => { setPassword(value); setFieldErrors((errors) => ({ ...errors, password: null })); }} visible={showPassword} onToggle={() => setShowPassword((visible) => !visible)} error={fieldErrors.password} /><PasswordField id="confirm-password" label="Confirm Password" value={confirmPassword} onChange={(value) => { setConfirmPassword(value); setFieldErrors((errors) => ({ ...errors, confirmPassword: null })); }} visible={showConfirmation} onToggle={() => setShowConfirmation((visible) => !visible)} error={fieldErrors.confirmPassword} /><Button dark type="submit" disabled={loading} className="w-full auth-submit">{loading ? 'Resetting password...' : 'Reset password'} <ArrowRight size={16} style={{ marginLeft: '8px' }} /></Button></form>}
    <div className="auth-footer"><p><Link to="/login">Back to log in</Link></p></div>
  </div></main>;
}
