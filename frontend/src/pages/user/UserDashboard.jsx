import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FiSearch, FiPackage, FiFileText, FiCheckCircle } from 'react-icons/fi';
import lostItemService from '../../services/lostItemService';
import foundItemService from '../../services/foundItemService';
import claimService from '../../services/claimService';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ lost: 0, found: 0, claims: 0 });

  useEffect(() => {
    Promise.all([
      lostItemService.getMine({ page: 0, size: 1 }),
      foundItemService.getMine({ page: 0, size: 1 }),
      claimService.getMine({ page: 0, size: 1 }),
    ]).then(([l, f, c]) => {
      setStats({
        lost: l.data.data.totalElements,
        found: f.data.data.totalElements,
        claims: c.data.data.totalElements,
      });
    }).catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Welcome, <span>{user?.fullName?.split(' ')[0]}</span> 👋</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}><FiSearch /></div>
          <div className="stat-info"><h3>{stats.lost}</h3><p>Lost Items</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}><FiPackage /></div>
          <div className="stat-info"><h3>{stats.found}</h3><p>Found Items</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}><FiFileText /></div>
          <div className="stat-info"><h3>{stats.claims}</h3><p>My Claims</p></div>
        </div>
      </div>

      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <FiCheckCircle style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: 12 }} />
        <h3 style={{ marginBottom: 8 }}>Quick Actions</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Use the sidebar to report items, view your listings, manage claims, or update your profile.</p>
      </div>
    </DashboardLayout>
  );
}
