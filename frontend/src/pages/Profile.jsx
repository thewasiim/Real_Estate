import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, MessageSquare, Eye, Calendar, Settings, ShieldCheck, 
  LogOut, Bell, Camera, User, LayoutDashboard, ChevronRight, Save, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { favoritesApi } from '../api/favoritesApi';
import { propertiesApi } from '../api/propertiesApi';
import PropertyCard from '../components/property/PropertyCard';
import Skeleton from '../components/ui/Skeleton';
import { validateName, validateEmail, validatePhone, validatePassword } from '../utils/validators';

// Mock data for inqueries and appointments (backend doesn't support user-specific retrieval)
const mockInquiries = [
  {
    id: 'inq-1',
    property: 'The Sky Penthouse at Worli Sea Face',
    date: '2026-08-05',
    message: 'I would like to know about the maintenance charges and structure of the private pool area.',
    status: 'Answered',
  },
  {
    id: 'inq-2',
    property: 'Villa Solaris - Heritage Luxury Estate',
    date: '2026-08-01',
    message: 'Is there additional parking space available for guests or staff?',
    status: 'Pending',
  },
  {
    id: 'inq-3',
    property: 'Lumina Manor Sky Residence',
    date: '2026-07-28',
    message: 'Interested in booking a virtual layout tour of the 4 BHK penthouse.',
    status: 'Answered',
  }
];

const mockAppointments = [
  {
    id: 'apt-1',
    property: 'The Sky Penthouse at Worli Sea Face',
    date: '2026-08-15',
    time: '14:00',
    agent: 'Rohan Mehta',
    status: 'Confirmed',
  },
  {
    id: 'apt-2',
    property: 'Villa Solaris - Heritage Luxury Estate',
    date: '2026-08-22',
    time: '11:00',
    agent: 'Vikramaditya Roy',
    status: 'Pending',
  }
];

export default function Profile() {
  const { user, logout, isAdmin } = useAuth();
  const { recentIds } = useRecentlyViewed();
  const navigate = useNavigate();

  // Tab & Loading State
  const [activeTab, setActiveTab] = useState('Overview');
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);

  // Forms state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailUpdates: true,
    smsAlerts: false,
    whatsappAlerts: true,
  });

  // UI state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Sync profile values when user loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Load favorites from backend
  const loadFavorites = async () => {
    setFavoritesLoading(true);
    try {
      const res = await favoritesApi.getAll();
      if (res.data?.success) {
        setFavorites(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setFavoritesLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  // Resolve recently viewed properties
  useEffect(() => {
    async function loadRecent() {
      if (!recentIds || recentIds.length === 0) return;
      
      // If the array already contains full objects
      if (typeof recentIds[0] === 'object') {
        setRecentProperties(recentIds);
        return;
      }
      
      // If they are IDs, load properties and filter
      setRecentLoading(true);
      try {
        const res = await propertiesApi.getAll({ limit: 50 });
        if (res.data?.success) {
          const resolved = res.data.data.items.filter(p => recentIds.includes(p.id));
          setRecentProperties(resolved);
        }
      } catch (err) {
        console.error('Failed to load recent properties:', err);
      } finally {
        setRecentLoading(false);
      }
    }
    loadRecent();
  }, [recentIds]);

  // Show Toast Auto-dismiss
  const showToastMessage = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Profile update handler
  const handleProfileSave = (e) => {
    e.preventDefault();
    const nameErr = validateName(profileForm.name, 'Full Name');
    if (nameErr) {
      showToastMessage(nameErr, 'error');
      return;
    }
    const emailErr = validateEmail(profileForm.email);
    if (emailErr) {
      showToastMessage(emailErr, 'error');
      return;
    }
    if (profileForm.phone?.trim()) {
      const phoneErr = validatePhone(profileForm.phone, false);
      if (phoneErr) {
        showToastMessage(phoneErr, 'error');
        return;
      }
    }
    showToastMessage('Profile settings saved successfully');
  };

  // Password update handler
  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showToastMessage('All password fields are required', 'error');
      return;
    }
    const passErr = validatePassword(passwordForm.newPassword);
    if (passErr) {
      showToastMessage(passErr, 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToastMessage('New password and confirm password do not match', 'error');
      return;
    }
    showToastMessage('Password changed successfully');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Avatar upload simulator (immediate client-side preview)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToastMessage('Only image files are allowed', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        showToastMessage('Profile photo updated successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoutClick = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Saved Properties', icon: Heart, count: favorites.length },
    { name: 'Recently Viewed', icon: Eye, count: recentProperties.length },
    { name: 'My Inquiries', icon: MessageSquare, count: mockInquiries.length },
    { name: 'Scheduled Visits', icon: Calendar, count: mockAppointments.length },
    { name: 'Account Settings', icon: Settings },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
        <div className="text-center">
          <div className="spinner mb-4 mx-auto" />
          <p className="text-ink-muted text-sm font-semibold">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="profile-page min-h-screen pb-24">
      {/* Toast Alert */}
      {toast.show && (
        <div className={`toast-alert ${toast.type}`}>
          <Check size={16} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="mb-6 text-[11px] font-bold tracking-widest text-[#6E6E73] uppercase">
        <Link to="/" className="hover:text-[#1D1D1F] transition-colors">Home</Link>
        <span className="mx-2 text-[#D2D2D7]">/</span>
        <span className="text-[#1D1D1F]">Dashboard</span>
      </nav>

      <div className="profile-layout">
        {/* Left Sidebar Menu */}
        <aside className="profile-sidebar">
          {/* User Info / Avatar Card */}
          <div className="profile-card-mini">
            <div className="avatar-container">
              <div className="avatar-main">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={profileForm.name} />
                ) : user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} />
                ) : (
                  <span className="avatar-initials-large">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <label htmlFor="avatar-file-upload" className="avatar-upload-btn" title="Change photo">
                <Camera size={14} />
              </label>
              <input 
                type="file" 
                id="avatar-file-upload" 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarChange} 
              />
            </div>
            <h2>{profileForm.name || user.name}</h2>
            <p>{profileForm.email || user.email}</p>
            {user.role === 'ADMIN' && (
              <span className="mt-2 px-2 py-0.5 text-[10px] font-bold text-accent bg-[#0071E3]/10 rounded-full tracking-wider uppercase">
                Curator Mode
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="profile-nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`profile-nav-btn ${isActive ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  <span className="flex-1">{item.name}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-black/5 rounded-full text-ink">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            {isAdmin && (
              <Link 
                to="/admin" 
                className="profile-nav-btn text-[#0071E3] hover:bg-[#0071E3]/5"
              >
                <Settings size={16} />
                <span>Admin Console</span>
              </Link>
            )}

            <button onClick={handleLogoutClick} className="profile-logout-btn">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Right Content Area */}
        <section className="profile-content">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              {/* Stat Cards Row */}
              <div className="bento-overview-grid">
                <div className="bento-stat-card cursor-pointer" onClick={() => setActiveTab('Saved Properties')}>
                  <div className="bento-stat-icon-wrapper">
                    <Heart size={20} />
                  </div>
                  <div className="bento-stat-info">
                    <h3>Saved</h3>
                    <p>{favorites.length}</p>
                  </div>
                </div>

                <div className="bento-stat-card cursor-pointer" onClick={() => setActiveTab('Recently Viewed')}>
                  <div className="bento-stat-icon-wrapper">
                    <Eye size={20} />
                  </div>
                  <div className="bento-stat-info">
                    <h3>Viewed</h3>
                    <p>{recentProperties.length}</p>
                  </div>
                </div>

                <div className="bento-stat-card cursor-pointer" onClick={() => setActiveTab('My Inquiries')}>
                  <div className="bento-stat-icon-wrapper">
                    <MessageSquare size={20} />
                  </div>
                  <div className="bento-stat-info">
                    <h3>Inquiries</h3>
                    <p>{mockInquiries.length}</p>
                  </div>
                </div>

                <div className="bento-stat-card cursor-pointer" onClick={() => setActiveTab('Scheduled Visits')}>
                  <div className="bento-stat-icon-wrapper">
                    <Calendar size={20} />
                  </div>
                  <div className="bento-stat-info">
                    <h3>Visits</h3>
                    <p>{mockAppointments.length}</p>
                  </div>
                </div>
              </div>

              {/* Bento Grid layout details */}
              <div className="bento-grid-dashboard">
                {/* Large Welcome Card */}
                <div className="bento-card dark-theme bento-card-welcome">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest opacity-60 uppercase block mb-1">
                      F.B. Developer Private Office
                    </span>
                    <h2>Good Day, {user.name?.split(' ')[0]}</h2>
                    <p>
                      Your customized real estate portfolio management dashboard is loaded. 
                      Track favorited residences, request detailed brochures, or view live status updates on your scheduled property visits.
                    </p>
                  </div>
                  <Link to="/properties" className="cta-link text-white hover:opacity-80 flex items-center gap-1 mt-6 text-sm font-semibold">
                    Browse Portfolio <ChevronRight size={15} />
                  </Link>
                </div>

                {/* Next Appointment Card */}
                <div className="bento-card flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#6E6E73] uppercase block mb-1">
                      Upcoming Site Visit
                    </span>
                    <h2 className="mb-4">Next Scheduled Tour</h2>
                    {mockAppointments.length > 0 ? (
                      <div className="space-y-3">
                        <div>
                          <p className="font-bold text-ink text-sm leading-snug">{mockAppointments[0].property}</p>
                          <p className="text-xs text-ink-muted mt-0.5">{mockAppointments[0].date} at {mockAppointments[0].time}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                          <span className="text-[#6E6E73]">Specialist: <b>{mockAppointments[0].agent}</b></span>
                          <span className="status-badge confirmed">{mockAppointments[0].status}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-ink-muted">No scheduled visits. Request a site visit on any property page.</p>
                    )}
                  </div>
                  {mockAppointments.length > 0 && (
                    <button 
                      onClick={() => setActiveTab('Scheduled Visits')}
                      className="text-xs font-semibold text-accent mt-4 text-left hover:underline"
                    >
                      Manage appointments →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SAVED PROPERTIES */}
          {activeTab === 'Saved Properties' && (
            <div>
              <div className="mb-6">
                <p className="eyebrow">YOUR COLLECTION</p>
                <h1 className="text-2xl font-bold tracking-tight text-ink mt-1">Saved Properties</h1>
              </div>

              {favoritesLoading ? (
                <div className="property-grid">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="property-card" style={{ padding: '0', minHeight: '340px' }}>
                      <Skeleton style={{ height: '200px', width: '100%' }} />
                      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Skeleton style={{ height: '20px', width: '80%' }} />
                        <Skeleton style={{ height: '16px', width: '40%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-16 bg-white border border-border rounded-lg shadow-sm">
                  <Heart size={48} className="mx-auto text-ink-muted opacity-40 mb-4" />
                  <h3 className="font-bold text-base text-ink mb-1">Your collection is empty</h3>
                  <p className="text-xs text-ink-muted max-w-sm mx-auto mb-6">
                    Bookmark properties you love while browsing to access them easily from this dashboard.
                  </p>
                  <Link to="/properties" className="btn btn-dark inline-block">
                    Explore Properties
                  </Link>
                </div>
              ) : (
                <div className="property-grid">
                  {favorites.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RECENTLY VIEWED */}
          {activeTab === 'Recently Viewed' && (
            <div>
              <div className="mb-6">
                <p className="eyebrow">BROWSING HISTORY</p>
                <h1 className="text-2xl font-bold tracking-tight text-ink mt-1">Recently Viewed</h1>
              </div>

              {recentLoading ? (
                <div className="property-grid">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="property-card" style={{ padding: '0', minHeight: '340px' }}>
                      <Skeleton style={{ height: '200px', width: '100%' }} />
                      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Skeleton style={{ height: '20px', width: '80%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentProperties.length === 0 ? (
                <div className="text-center py-16 bg-white border border-border rounded-lg shadow-sm">
                  <Eye size={48} className="mx-auto text-ink-muted opacity-40 mb-4" />
                  <h3 className="font-bold text-base text-ink mb-1">No recently viewed items</h3>
                  <p className="text-xs text-ink-muted max-w-sm mx-auto mb-6">
                    Residences you view will appear here for quick access later.
                  </p>
                  <Link to="/properties" className="btn btn-dark inline-block">
                    Explore Properties
                  </Link>
                </div>
              ) : (
                <div className="property-grid">
                  {recentProperties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MY INQUIRIES */}
          {activeTab === 'My Inquiries' && (
            <div>
              <div className="mb-6">
                <p className="eyebrow">CONSULTATIONS</p>
                <h1 className="text-2xl font-bold tracking-tight text-ink mt-1">My Inquiries</h1>
              </div>

              <div className="list-container">
                {mockInquiries.map((inq) => (
                  <div key={inq.id} className="bento-card list-item-card">
                    <div className="list-item-header">
                      <div>
                        <h3 className="list-item-title">{inq.property}</h3>
                        <p className="list-item-subtitle">Submitted: {inq.date}</p>
                      </div>
                      <span className={`status-badge ${inq.status.toLowerCase()}`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted leading-relaxed bg-bg-alt p-3 rounded-md border border-border/30">
                      "{inq.message}"
                    </p>
                    <div className="flex justify-end gap-3 text-xs font-semibold pt-2">
                      <button className="text-ink-muted hover:text-ink">View Details</button>
                      <button className="text-accent hover:underline">Message Representative</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SCHEDULED VISITS */}
          {activeTab === 'Scheduled Visits' && (
            <div>
              <div className="mb-6">
                <p className="eyebrow">PROPERTY TOURS</p>
                <h1 className="text-2xl font-bold tracking-tight text-ink mt-1">Scheduled Site Visits</h1>
              </div>

              <div className="list-container">
                {mockAppointments.map((apt) => (
                  <div key={apt.id} className="bento-card list-item-card">
                    <div className="list-item-header">
                      <div>
                        <h3 className="list-item-title">{apt.property}</h3>
                        <p className="list-item-subtitle">Date: <b>{apt.date}</b> • Time: <b>{apt.time}</b></p>
                      </div>
                      <span className={`status-badge ${apt.status.toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
                      <span className="text-ink-muted">Assigned Specialist: <b>{apt.agent}</b></span>
                      <div className="flex gap-4">
                        <button className="text-red-600 font-semibold hover:underline">Cancel Tour</button>
                        <button className="text-accent font-semibold hover:underline">Reschedule</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ACCOUNT SETTINGS */}
          {activeTab === 'Account Settings' && (
            <div className="space-y-6">
              <div className="mb-2">
                <p className="eyebrow">MANAGEMENT</p>
                <h1 className="text-2xl font-bold tracking-tight text-ink mt-1">Account & Security</h1>
              </div>

              {/* Edit Profile Form */}
              <div className="bento-card">
                <h2 className="border-b border-border pb-3 mb-5">Profile Details</h2>
                <form onSubmit={handleProfileSave} className="settings-form-grid">
                  <div className="settings-group">
                    <label htmlFor="settings-name">Full Name</label>
                    <input 
                      type="text" 
                      id="settings-name"
                      className="settings-input"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                  </div>
                  <div className="settings-group">
                    <label htmlFor="settings-email">Email Address</label>
                    <input 
                      type="email" 
                      id="settings-email"
                      className="settings-input"
                      value={profileForm.email}
                      disabled
                    />
                    <span className="text-[10px] text-ink-muted mt-1">Email changes require support verification.</span>
                  </div>
                  <div className="settings-group">
                    <label htmlFor="settings-phone">Phone Number</label>
                    <input 
                      type="text" 
                      id="settings-phone"
                      className="settings-input"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end pt-2">
                    <button type="submit" className="btn btn-dark px-6 py-2.5 flex items-center gap-2">
                      <Save size={15} /> Save Changes
                    </button>
                  </div>
                </form>
              </div>

              {/* Password Change Form */}
              <div className="bento-card">
                <h2 className="border-b border-border pb-3 mb-5">Update Password</h2>
                <form onSubmit={handlePasswordSave} className="settings-form-grid">
                  <div className="settings-group">
                    <label htmlFor="settings-cur-pass">Current Password</label>
                    <input 
                      type="password" 
                      id="settings-cur-pass"
                      className="settings-input"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="settings-group">
                    <label htmlFor="settings-new-pass">New Password</label>
                    <input 
                      type="password" 
                      id="settings-new-pass"
                      className="settings-input"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="At least 6 characters"
                    />
                  </div>
                  <div className="settings-group">
                    <label htmlFor="settings-confirm-pass">Confirm New Password</label>
                    <input 
                      type="password" 
                      id="settings-confirm-pass"
                      className="settings-input"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end pt-2">
                    <button type="submit" className="btn btn-dark px-6 py-2.5 flex items-center gap-2">
                      <ShieldCheck size={15} /> Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* Notification Preferences */}
              <div className="bento-card">
                <h2 className="border-b border-border pb-3 mb-5">Notification Preferences</h2>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      className="mt-1"
                      checked={notificationPrefs.emailUpdates}
                      onChange={(e) => setNotificationPrefs({ ...notificationPrefs, emailUpdates: e.target.checked })}
                    />
                    <div>
                      <span className="block text-sm font-bold text-ink">Email Notifications</span>
                      <span className="block text-xs text-ink-muted mt-0.5">Receive newsletter, research reports, and portfolio updates.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      className="mt-1"
                      checked={notificationPrefs.smsAlerts}
                      onChange={(e) => setNotificationPrefs({ ...notificationPrefs, smsAlerts: e.target.checked })}
                    />
                    <div>
                      <span className="block text-sm font-bold text-ink">SMS Visit Reminders</span>
                      <span className="block text-xs text-ink-muted mt-0.5">Get automated reminder texts 2 hours before a scheduled site visit.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      className="mt-1"
                      checked={notificationPrefs.whatsappAlerts}
                      onChange={(e) => setNotificationPrefs({ ...notificationPrefs, whatsappAlerts: e.target.checked })}
                    />
                    <div>
                      <span className="block text-sm font-bold text-ink">WhatsApp Concierge Desk</span>
                      <span className="block text-xs text-ink-muted mt-0.5">Enable instant messaging with luxury specialists regarding your inquiries.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
