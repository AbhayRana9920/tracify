import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import adminService from '../../services/adminService';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDateTime } from '../../utils/helpers';
import { toast } from 'react-toastify';

export default function ManageComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminService.getComplaints({ page: 0, size: 50 })
      .then(res => setComplaints(res.data.data.content))
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const respond = async (id, status) => {
    const response = prompt('Admin response:');
    if (response === null) return;
    try { await adminService.respondToComplaint(id, status, response); toast.success('Updated'); load(); } catch (e) { toast.error('Failed'); }
  };

  return (
    <DashboardLayout>
      <div className="page-header"><h1 className="page-title">Manage <span>Complaints</span></h1></div>
      {loading ? <div className="loading-screen"><div className="spinner"></div></div> : complaints.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🚩</div><h3>No complaints</h3></div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Reporter</th><th>Target</th><th>Reason</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c.id}>
                  <td>{c.reporterName}</td>
                  <td>{c.targetType} #{c.targetId}</td>
                  <td>{c.reason}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>{formatDateTime(c.createdAt)}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    {c.status === 'PENDING' && <><button className="btn btn-sm btn-success" onClick={() => respond(c.id, 'RESOLVED')}>Resolve</button><button className="btn btn-sm btn-secondary" onClick={() => respond(c.id, 'DISMISSED')}>Dismiss</button></>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
