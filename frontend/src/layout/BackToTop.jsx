import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

    return (
      <button
        type="button"
        className={`backtop${visible ? ' backtop--visible' : ''}${hovered ? ' backtop--hovered' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { window.scrollTo({ top: 0, behavior: 'smooth' }); }}}
        aria-label="Back to top"
        tabIndex={visible ? 0 : -1}
      >
        <span className="backtop__track" aria-hidden="true" />
        <span className="backtop__icon">
          <ArrowUp size={16} strokeWidth={2.2} />
        </span>
      </button>
    );
}
