import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiHome, FiSearch, FiPackage, FiFileText, FiUser, FiBell, FiFlag, FiUsers, FiBarChart2, FiPlus } from 'react-icons/fi';

export default function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-section-title">Dashboard</div>
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
          <FiHome className="link-icon" /> Overview
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Items</div>
        <NavLink to="/post-lost" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FiPlus className="link-icon" /> Report Lost Item
        </NavLink>
        <NavLink to="/post-found" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FiPlus className="link-icon" /> Report Found Item
        </NavLink>
        <NavLink to="/my-lost-items" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FiSearch className="link-icon" /> My Lost Items
        </NavLink>
        <NavLink to="/my-found-items" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FiPackage className="link-icon" /> My Found Items
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Claims</div>
        <NavLink to="/my-claims" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FiFileText className="link-icon" /> My Claims
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Account</div>
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FiUser className="link-icon" /> Profile
        </NavLink>
        <NavLink to="/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FiBell className="link-icon" /> Notifications
        </NavLink>
      </div>

      {isAdmin && (
        <div className="sidebar-section">
          <div className="sidebar-section-title">Admin</div>
          <NavLink to="/admin" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
            <FiBarChart2 className="link-icon" /> Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiUsers className="link-icon" /> Users
          </NavLink>
          <NavLink to="/admin/lost-items" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiSearch className="link-icon" /> Lost Items
          </NavLink>
          <NavLink to="/admin/found-items" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiPackage className="link-icon" /> Found Items
          </NavLink>
          <NavLink to="/admin/claims" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiFileText className="link-icon" /> Claims
          </NavLink>
          <NavLink to="/admin/complaints" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiFlag className="link-icon" /> Complaints
          </NavLink>
        </div>
      )}
    </aside>
  );
}
