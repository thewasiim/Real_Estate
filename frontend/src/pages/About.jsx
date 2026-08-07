import React from 'react';
import { ShieldCheck, Award, Compass, Key, Users, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const stats = [
  { value: '₹ 2,400 Cr+', label: 'Transactions Executed' },
  { value: '850+', label: 'HNW Families Advised' },
  { value: '18+', label: 'Cities of Presence' },
  { value: '14 Years', label: 'Market Authority' },
];

const values = [
  { icon: ShieldCheck, title: 'Absolute Discretion', desc: 'Every engagement is governed by strict confidentiality. We do not disclose client identities, acquisition targets, or deal structures.' },
  { icon: Award, title: 'Editorial Curation', desc: 'Our specialists personally visit every property before listing. Only residences meeting our architectural and investment merit threshold qualify.' },
  { icon: Compass, title: 'Informed Advisory', desc: 'Proprietary market intelligence, capital value trends, and micro-location data guide every recommendation we make.' },
  { icon: Key, title: 'Concierge Execution', desc: 'From legal title verification to post-possession interior design, we co-ordinate every step of your luxury real estate journey.' },
  { icon: Users, title: 'Institutional Trust', desc: 'Trusted by family offices, private wealth managers, and institutional investors across India and internationally.' },
  { icon: Globe, title: 'NRI Expertise', desc: 'A dedicated cross-border advisory desk ensures seamless compliance, FEMA guidance, and property management for non-resident clients.' },
];

const milestones = [
  { year: '2010', event: 'Founded in Mumbai as a boutique luxury advisory firm.' },
  { year: '2013', event: 'Launched the Private Concierge Desk for UHNI clientele.' },
  { year: '2016', event: 'Expanded to Delhi NCR and Goa with dedicated specialists.' },
  { year: '2019', event: 'Crossed ₹ 1,000 Cr in annual luxury transaction volume.' },
  { year: '2022', event: 'Launched F.B. Developer Digital Platform for pan-India estate discovery.' },
  { year: '2024', event: 'Introduced International Desk for NRI advisory across UAE, UK, and USA.' },
];

export default function About() {
  return (
    <main style={{ paddingTop: '80px' }}>
      {/* ── 1. Hero Banner ───────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: '480px', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1920&q=80"
          alt="F.B. Developer Headquarters"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #161616ee 0%, #16161680 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', padding: '0 var(--gutter)' }}>
          <div style={{ color: '#fff', maxWidth: '560px' }}>
            <p className="eyebrow light" style={{ marginBottom: '14px' }}>ABOUT F.B. DEVELOPER ESTATES</p>
            <h1 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.2, marginBottom: '16px' }}>
              India's Most Trusted Luxury Real Estate Advisors
            </h1>
            <p style={{ fontSize: '14px', opacity: 0.85, lineHeight: 1.75 }}>
              Founded on the belief that exceptional homes deserve exceptional counsel, F.B. Developer has curated over ₹2,400 Crore of luxury real estate transactions for India's most discerning families.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Stats Row ─────────────────────────────────────────────── */}
      <section style={{ background: 'var(--ink)', padding: '40px var(--gutter)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--color-accent)', fontWeight: 700, marginBottom: '6px' }}>{value}</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', letterSpacing: '.07em', fontWeight: 600 }}>{label.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Our Values ────────────────────────────────────────────── */}
      <section style={{ padding: '80px var(--gutter)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <p className="eyebrow">OUR PHILOSOPHY</p>
            <h2 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginTop: '8px' }}>
              What Sets F.B. Developer Apart
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ border: '1px solid var(--line)', borderRadius: '8px', padding: '28px 24px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: '#f4f0ec', display: 'grid', placeItems: 'center',
                  marginBottom: '18px',
                }}>
                  <Icon size={20} style={{ color: 'var(--color-accent)' }} />
                </div>
                <h3 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', fontSize: '1.1rem', marginBottom: '10px' }}>{title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.75 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Timeline / Milestones ─────────────────────────────────── */}
      <section style={{ padding: '60px var(--gutter) 80px', background: 'var(--wash)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow">OUR JOURNEY</p>
            <h2 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginTop: '8px' }}>
              Fourteen Years of Distinction
            </h2>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'var(--line)', transform: 'translateX(-50%)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {milestones.map(({ year, event }, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <div key={year} style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center',
                  }}>
                    {isLeft ? (
                      <>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', fontSize: '1.4rem', color: 'var(--color-accent)', fontWeight: 700 }}>{year}</p>
                          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.65 }}>{event}</p>
                        </div>
                        <div />
                      </>
                    ) : (
                      <>
                        <div />
                        <div style={{ textAlign: 'left' }}>
                          <p style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', fontSize: '1.4rem', color: 'var(--color-accent)', fontWeight: 700 }}>{year}</p>
                          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.65 }}>{event}</p>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CTA Banner ────────────────────────────────────────────── */}
      <section style={{ padding: '80px var(--gutter)', textAlign: 'center', background: 'var(--ink)' }}>
        <p className="eyebrow light" style={{ marginBottom: '14px' }}>BEGIN YOUR JOURNEY</p>
        <h2 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff', marginBottom: '16px' }}>
          Ready to Discover Your Estate?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', maxWidth: '460px', margin: '0 auto 32px', lineHeight: 1.7 }}>
          Connect with our Private Advisory Desk to begin a curated, confidential property search.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/contact">
            <Button dark>Book a Consultation</Button>
          </Link>
          <Link to="/properties">
            <button type="button" style={{
              padding: '14px 28px', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px', background: 'transparent', color: '#fff',
              fontSize: '12px', fontWeight: 700, letterSpacing: '.07em', cursor: 'pointer',
            }}>
              BROWSE ESTATES
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
