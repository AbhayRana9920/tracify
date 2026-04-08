import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';
import notificationService from '../../services/notificationService';
import { FILE_BASE_URL } from '../../utils/constants';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (user) {
      notificationService.getUnreadCount()
        .then(res => setUnread(res.data.data))
        .catch(() => {});
      const interval = setInterval(() => {
        notificationService.getUnreadCount()
          .then(res => setUnread(res.data.data))
          .catch(() => {});
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">🔍</span>
        <span>Tracify</span>
      </Link>
      <div className="navbar-content">
        <div className="navbar-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/lost-items" className={isActive('/lost-items')}>Lost Items</Link>
          <Link to="/found-items" className={isActive('/found-items')}>Found Items</Link>
          {user && <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>}
          {isAdmin && <Link to="/admin" className={isActive('/admin')}>Admin</Link>}
        </div>
        <div className="navbar-right">
          {user ? (
            <>
              <button className="nav-notification" onClick={() => navigate('/notifications')}>
                <FiBell />
                {unread > 0 && <span className="notification-badge">{unread > 9 ? '9+' : unread}</span>}
              </button>
              <div className="nav-user" onClick={() => navigate('/profile')}>
                <div className="nav-avatar">
                  {user.profilePhoto ? <img src={`${FILE_BASE_URL}${user.profilePhoto}`} alt="" /> : user.fullName?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user.fullName?.split(' ')[0]}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => { logout(); navigate('/'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
