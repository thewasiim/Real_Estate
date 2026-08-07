import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useScrollNavbar } from '../hooks/useScrollNavbar';
import { useAuth } from '../context/AuthContext';
import BookVisitModal from '../components/shared/BookVisitModal';

const NAV_LINKS = [
  ['Home', '/'],
  ['Properties', '/properties'],
  ['Projects', '/projects'],
  ['Agents', '/agents'],
  ['About', '/about'],
  ['Blog', '/blog'],
  ['Contact', '/contact'],
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isScrolled = useScrollNavbar(40);
  const location = useLocation();
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showBookVisit, setShowBookVisit] = useState(false);

  // Home page has hero; non-hero pages must be solid by default (design.md §9)
  const isHomePage = location.pathname === '/';
  const isSolid = !isHomePage || isScrolled;

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className={`nav ${isSolid ? 'nav-solid' : ''}`}>
        {/* Brand */}
        <Link className="brand" to="/">
          F.B. Developer<i />
        </Link>

        {/* Desktop nav */}
        <nav>
          {NAV_LINKS.map(([label, to]) => (
            <NavLink key={label} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="nav-actions">
          {isLoggedIn ? (
            <div className="user-menu" style={{ position: 'relative' }}>
              <button
                className="user-avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="avatar-img" />
                ) : (
                  <span className="avatar-initials">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
                <span className="user-name">{user?.name?.split(' ')[0]}</span>
              </button>

              {dropdownOpen && (
                <div className="user-dropdown">
                  <Link to="/profile">Profile</Link>
                  <Link to="/favorites">Favorites</Link>
                  {isAdmin && <Link to="/admin">Admin Panel</Link>}
                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login">
              Login / Register
            </Link>
          )}
          <button
            className="btn btn-dark book-visit-nav"
            onClick={() => setShowBookVisit(true)}
          >
            Book Site Visit <ArrowRight size={15} />
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="mobile-nav"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {NAV_LINKS.map(([label, to]) => (
                <NavLink key={label} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
                  {label}
                </NavLink>
              ))}
              {isLoggedIn ? (
                <>
                  <Link to="/profile">Profile</Link>
                  <Link to="/favorites">Favorites</Link>
                  {isAdmin && <Link to="/admin">Admin Panel</Link>}
                  <button onClick={logout} className="btn btn-light">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-light">
                  Login / Register
                </Link>
              )}
              <button
                className="btn btn-dark"
                onClick={() => {
                  setMobileOpen(false);
                  setShowBookVisit(true);
                }}
              >
                Book Site Visit
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Book Site Visit Modal */}
      <BookVisitModal isOpen={showBookVisit} onClose={() => setShowBookVisit(false)} />
    </>
  );
}
