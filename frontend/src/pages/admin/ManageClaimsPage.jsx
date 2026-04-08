import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import adminService from '../../services/adminService';
import StatusBadge from '../../components/common/StatusBadge';
import { CLAIM_STATUSES } from '../../utils/constants';
import { formatDateTime } from '../../utils/helpers';
import { toast } from 'react-toastify';

import AdminClaimReviewModal from './AdminClaimReviewModal';

export default function ManageClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [reviewClaimId, setReviewClaimId] = useState(null);

  const load = () => {
    setLoading(true);
    const params = { page: 0, size: 50 };
    if (filter) params.status = filter;
    adminService.getClaims(params)
      .then(res => setClaims(res.data.data.content))
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    if (!confirm(`Are you sure you want to change status to ${status}?`)) return;
    try { await adminService.updateClaimStatus(id, status, null); toast.success('Claim updated'); load(); } catch (e) { toast.error('Failed to update claim securely'); }
  };

  const handleActionComplete = () => {
      setReviewClaimId(null);
      load();
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Manage <span>Claims</span></h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="">All Statuses</option>
          {CLAIM_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {loading ? <div className="loading-screen"><div className="spinner"></div></div> : claims.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📋</div><h3>No claims found</h3></div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Claimant</th><th>Item</th><th>Status</th><th>Submitted</th><th>Actions</th></tr></thead>
            <tbody>
              {claims.map(c => (
                <tr key={c.id}>
                  <td>{c.claimantName}</td>
                  <td>{c.foundItemTitle}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>{formatDateTime(c.createdAt)}</td>
                  <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button className="btn btn-sm btn-primary" onClick={() => setReviewClaimId(c.id)}>
                      Review Claim
                    </button>
                    {['APPROVED', 'HANDOVER_PENDING', 'FINDER_CONFIRMED', 'OWNER_CONFIRMED'].includes(c.status) && (
                      <>
                        <button className="btn btn-sm btn-success" onClick={() => updateStatus(c.id, 'RETURNED')}>Mark Returned</button>
                        <button className="btn btn-sm btn-outline" onClick={() => updateStatus(c.id, 'CLOSED')}>Close Case</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {reviewClaimId && <AdminClaimReviewModal claimId={reviewClaimId} onClose={() => setReviewClaimId(null)} onActionComplete={handleActionComplete} />}
    </DashboardLayout>
  );
}
