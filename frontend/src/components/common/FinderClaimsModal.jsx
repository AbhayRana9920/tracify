import { useState, useEffect } from 'react';
import claimService from '../../services/claimService';
import StatusBadge from './StatusBadge';
import { toast } from 'react-toastify';

export default function FinderClaimsModal({ foundItemId, onClose }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadClaims = async () => {
    try {
      const res = await claimService.getForItem(foundItemId, { page: 0, size: 50 });
      setClaims(res.data.data.content);
    } catch (e) {
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, [foundItemId]);

  const handleConfirmHandover = async (id) => {
    if (!confirm('Confirm you have handed over this item?')) return;
    try {
      await claimService.finderConfirmHandover(id);
      toast.success('Handover confirmed!');
      loadClaims();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to confirm handover');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 800 }}>
        <h2>Review Claims</h2>
        {loading ? <p>Loading...</p> : claims.length === 0 ? <p>No claims found.</p> : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Claimant</th>
                  <th>Message</th>
                  <th>Contact Info</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {c.claimantProfilePhoto && <img src={c.claimantProfilePhoto} alt="profile" style={{ width: 24, height: 24, borderRadius: '50%' }} />}
                        {c.claimantName}
                      </div>
                    </td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.claimMessage}</td>
                    <td>
                      {c.claimantEmail ? (
                        <div style={{ fontSize: '0.85rem' }}>
                          <div>📧 {c.claimantEmail}</div>
                          {c.claimantPhone && <div>📞 {c.claimantPhone}</div>}
                        </div>
                      ) : <span style={{ color: 'var(--text-muted)' }}>Hidden</span>}
                    </td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      {['APPROVED', 'HANDOVER_PENDING', 'OWNER_CONFIRMED'].includes(c.status) && !c.finderConfirmedHandover && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleConfirmHandover(c.id)}>
                          Handover Completed
                        </button>
                      )}
                      {c.finderConfirmedHandover && <span style={{ fontSize: '0.85rem', color: 'var(--success)' }}>Handover Confirmed</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
