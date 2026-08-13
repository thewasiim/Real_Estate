import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Check } from 'lucide-react';
import Reveal from '../components/shared/Reveal';
import { leadsApi } from '../api/leadsApi';
import { validateEmail } from '../utils/validators';

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }
    setLoading(true);
    try {
      const res = await leadsApi.create({ type: 'NEWSLETTER', email: email.trim() });
      if (res.data?.success) {
        setSuccess(true);
        setEmail('');
      } else {
        setError('Failed to subscribe.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to subscribe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {success ? (
        <p style={{ color: '#38A169', fontSize: '13px', fontWeight: 600 }}>
          <Check size={14} style={{ display: 'inline', marginRight: '4px' }} /> Thank you for subscribing!
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="newsletter">
            <input
              placeholder="Your email address"
              aria-label="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              maxLength={100}
            />
            <button type="submit" aria-label="Subscribe" disabled={loading}>
              <ArrowRight size={16} />
            </button>
          </div>
          {error && <span style={{ color: '#e53e3e', fontSize: '11px', marginTop: '4px', display: 'block' }}>{error}</span>}
        </form>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="contact">
      <Reveal className="footer-reveal">
      <div className="footer-top">
        <div>
          <Link className="brand" to="/">
            F.B. Developer<i />
          </Link>
          <p>Extraordinary homes, thoughtfully found.</p>
          <div className="social">
            <span>IG</span>
            <span>FB</span>
            <MessageCircle />
          </div>
        </div>

        <div>
          <h4>Explore</h4>
          <Link to="/properties">Properties</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/blog">Journal</Link>
          <Link to="/about">About us</Link>
        </div>

        <div>
          <h4>Get in touch</h4>
          <a href="tel:+919876543210">+91 98765 43210</a>
          <a href="mailto:hello@fbdeveloper.in">hello@fbdeveloper.in</a>
          <p>
            83, Linking Road
            <br />
            Bandra West, Mumbai 400050
          </p>
        </div>

        <div>
          <h4>A note from F.B. Developer</h4>
          <p>Design, destinations and the homes in between.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 F.B. Developer. All rights reserved.</span>
        <span>
          Made by{' '}
          <a
            href="https://www.instagram.com/thewasiim?igsh=MWpqN3ZxMGVoOWlxaw=="
            target="_blank"
            rel="noopener noreferrer"
            className="footer-credit-link"
          >
            thewasiim
          </a>
        </span>
        <span>Privacy · Terms · RERA</span>
      </div>
      </Reveal>
    </footer>
  );
}
