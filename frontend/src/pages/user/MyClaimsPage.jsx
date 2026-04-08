import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import claimService from '../../services/claimService';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDateTime } from '../../utils/helpers';

export default function MyClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    claimService.getMine({ page: 0, size: 50 })
      .then(res => setClaims(res.data.data.content))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleConfirmReceipt = async (id) => {
    if (!confirm('Confirm you have received your item?')) return;
    try {
      await claimService.ownerConfirmReceipt(id);
      // reload
      const res = await claimService.getMine({ page: 0, size: 50 });
      setClaims(res.data.data.content);
    } catch (e) { console.error(e); }
  };

  return (
    <DashboardLayout>
      <div className="page-header"><h1 className="page-title">My <span>Claims</span></h1></div>
      {loading ? <div className="loading-screen"><div className="spinner"></div></div> : claims.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📋</div><h3>No claims yet</h3><p>Submit a claim for a found item to see it here.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Item</th><th>Message</th><th>Finder Contact</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {claims.map(c => (
                <tr key={c.id}>
                  <td><Link to={`/found-items/${c.foundItemId}`} style={{ fontWeight: 600 }}>{c.foundItemTitle}</Link></td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.claimMessage}</td>
                  <td>
                    {c.finderEmail ? (
                      <div style={{ fontSize: '0.85rem' }}>
                        <div>📧 {c.finderEmail}</div>
                        {c.finderPhone && <div>📞 {c.finderPhone}</div>}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Hidden</span>
                    )}
                  </td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    {['APPROVED', 'HANDOVER_PENDING', 'FINDER_CONFIRMED'].includes(c.status) && !c.ownerConfirmedReceipt && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleConfirmReceipt(c.id)}>
                        Item Received
                      </button>
                    )}
                    {c.ownerConfirmedReceipt && <span style={{fontSize:'0.85rem', color:'var(--success)'}}>Receipt Confirmed</span>}
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
