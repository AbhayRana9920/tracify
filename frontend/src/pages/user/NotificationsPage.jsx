import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import notificationService from '../../services/notificationService';
import { formatDateTime } from '../../utils/helpers';
import { FiCheck, FiCheckCircle } from 'react-icons/fi';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    notificationService.getAll({ page: 0, size: 50 })
      .then(res => setNotifications(res.data.data.content))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAll = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title"><span>Notifications</span></h1>
        <button className="btn btn-secondary btn-sm" onClick={markAll}><FiCheckCircle /> Mark All Read</button>
      </div>
      {loading ? <div className="loading-screen"><div className="spinner"></div></div> : notifications.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🔔</div><h3>No notifications</h3></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notifications.map(n => (
            <div key={n.id} className="card" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: n.isRead ? 0.6 : 1, borderLeft: n.isRead ? 'none' : '3px solid var(--primary)' }}>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>{n.title}</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{n.message}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDateTime(n.createdAt)}</span>
              </div>
              {!n.isRead && <button className="btn btn-ghost btn-sm btn-icon" onClick={() => markRead(n.id)}><FiCheck /></button>}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
