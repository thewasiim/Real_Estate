import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import Reveal from '../components/shared/Reveal';

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
          <div className="newsletter">
            <input placeholder="Your email address" aria-label="Email address" />
            <button aria-label="Subscribe">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 F.B. Developer. All rights reserved.</span>
        <span>Privacy · Terms · RERA</span>
      </div>
      </Reveal>
    </footer>
  );
}
