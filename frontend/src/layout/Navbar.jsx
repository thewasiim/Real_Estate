import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X, User, Heart, Settings, LogOut } from 'lucide-react';
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
  const userMenuRef = useRef(null);

  // Home page has hero; non-hero pages must be solid by default (design.md §9)
  const isHomePage = location.pathname === '/';
  const isSolid = !isHomePage || isScrolled;

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Click outside user menu to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            <div ref={userMenuRef} className="user-menu-container">
              <button
                className="user-avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                <div className="avatar-circle">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <span className="user-name hidden sm:inline">
                  {user?.name?.split(' ')[0]}
                </span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="user-dropdown"
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link to="/profile" className="dropdown-item">
                      <User size={15} /> Profile
                    </Link>
                    <Link to="/favorites" className="dropdown-item">
                      <Heart size={15} /> Favorites
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item">
                        <Settings size={15} /> Admin Panel
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button onClick={logout} className="dropdown-item text-red-600">
                      <LogOut size={15} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
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
                    <Link to="/profile" className="dropdown-item flex items-center">
                      <User className="mr-2 w-4 h-4"/> Profile
                    </Link>
                    <Link to="/favorites" className="dropdown-item flex items-center">
                      <Heart className="mr-2 w-4 h-4"/> Favorites
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item flex items-center">
                        <Settings className="mr-2 w-4 h-4"/> Admin Panel
                      </Link>
                    )}
                    <button onClick={logout} className="dropdown-item flex items-center logout-btn">
                      <LogOut className="mr-2 w-4 h-4"/> Logout
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
