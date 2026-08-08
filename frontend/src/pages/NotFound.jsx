import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Building2, Search } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg, #FDFCFB)',
      padding: '0 var(--gutter, 24px)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%' }}>
        {/* Logo icon */}
        <div style={{
          width: '64px', height: '64px',
          background: 'var(--ink, #0F0E0B)',
          borderRadius: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px',
          color: '#fff',
        }}>
          <Building2 size={28} />
        </div>

        {/* 404 display */}
        <p style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
          fontSize: 'clamp(6rem, 18vw, 10rem)',
          fontWeight: 900,
          letterSpacing: '-0.06em',
          lineHeight: 1,
          color: 'var(--ink, #0F0E0B)',
          margin: '0 0 8px',
          opacity: 0.06,
          userSelect: 'none',
        }}>
          404
        </p>

        <h1 style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
          fontSize: 'clamp(1.4rem, 4vw, 2rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          marginBottom: '12px',
          color: 'var(--ink, #0F0E0B)',
          marginTop: '-32px',
        }}>
          Page Not Found
        </h1>

        <p style={{
          fontSize: '14px',
          color: 'var(--muted, #7A7264)',
          lineHeight: 1.7,
          marginBottom: '40px',
          maxWidth: '380px',
          margin: '0 auto 40px',
        }}>
          The page you're looking for doesn't exist or has been moved. Let us guide you back to our curated listings.
        </p>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px',
              background: 'var(--ink, #0F0E0B)', color: '#fff',
              border: 'none', borderRadius: '8px',
              fontSize: '13px', fontWeight: 700, letterSpacing: '.02em',
              textDecoration: 'none', cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            <Home size={16} /> Back to Homepage
          </Link>

          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px',
              background: 'transparent', color: 'var(--ink, #0F0E0B)',
              border: '1px solid var(--line, #E5E2DD)',
              borderRadius: '8px',
              fontSize: '13px', fontWeight: 700, letterSpacing: '.02em',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface, #F6F3EE)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>

        {/* Quick links */}
        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--line, #E5E2DD)' }}>
          <p style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, letterSpacing: '.06em', marginBottom: '16px' }}>
            QUICK LINKS
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Properties', to: '/properties' },
              { label: 'Projects', to: '/projects' },
              { label: 'Agents', to: '/agents' },
              { label: 'Contact', to: '/contact' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: '6px 14px',
                  border: '1px solid var(--line, #E5E2DD)',
                  borderRadius: '4px',
                  fontSize: '12px', fontWeight: 600,
                  color: 'var(--muted)', textDecoration: 'none',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.borderColor = 'var(--ink)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--line)'; }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
