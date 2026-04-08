import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate, getImageUrl } from '../../utils/helpers';
import { toast } from 'react-toastify';

export default function AdminClaimReviewModal({ claimId, onClose, onActionComplete }) {
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    adminService.getClaimById(claimId)
      .then(res => setClaim(res.data.data))
      .catch(e => toast.error('Failed to load claim details'))
      .finally(() => setLoading(false));
  }, [claimId]);

  const handleAction = async (action) => {
    try {
      setProcessing(true);
      if (action === 'approve') {
        if (!confirm('Are you sure you want to approve this claim? This will automatically reject other pending claims for this item.')) return;
        await adminService.approveClaim(claimId, adminNotes);
        toast.success('Claim approved successfully');
      } else if (action === 'reject') {
        const notes = prompt('Enter a rejection reason (optional):') || adminNotes;
        if (!confirm('Reject this claim?')) return;
        await adminService.rejectClaim(claimId, notes);
        toast.success('Claim rejected');
      } else if (action === 'review') {
        await adminService.reviewClaim(claimId, adminNotes);
        toast.success('Claim marked as under review');
      }
      onActionComplete();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Action failed.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="modal-overlay"><div className="modal-content"><p>Loading claim details...</p></div></div>;
  if (!claim) return null;

  const showActions = claim.status === 'PENDING' || claim.status === 'UNDER_REVIEW';

  return (
    <div className="modal-overlay" style={{ zIndex: 1000, padding: '20px' }}>
      <div className="modal-content" style={{ maxWidth: 900, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2>Claim Review Form</h2>
          <button className="btn btn-outline btn-sm" onClick={onClose} disabled={processing}>Close</button>
        </div>

        <div className="grid grid-2" style={{ gap: 24, marginBottom: 24 }}>
          {/* Claim Info */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Claim Data</h3>
              <StatusBadge status={claim.status} />
            </div>
            <p><strong>Submitted:</strong> {formatDate(claim.createdAt)}</p>
            <p><strong>Message:</strong> {claim.claimMessage}</p>
            <p><strong>Identifying Info:</strong> {claim.identifyingInfo}</p>
            <p><strong>Proof of Ownership:</strong> {claim.proofOfOwnership}</p>
            {claim.proofDocumentUrl && (
              <div style={{ marginTop: 8 }}>
                <a href={getImageUrl(claim.proofDocumentUrl)} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">
                  View Proof Document
                </a>
              </div>
            )}
          </div>

          {/* Claimant & Finder Info */}
          <div className="card">
            <h3>Contact Information</h3>
            <div style={{ marginTop: 12 }}>
              <p style={{ color: 'var(--primary)', fontWeight: 600 }}>Claimant (Owner)</p>
              <p><strong>Name:</strong> {claim.claimantName}</p>
              {claim.claimantEmail && <p><strong>Email:</strong> {claim.claimantEmail}</p>}
              {claim.claimantPhone && <p><strong>Phone:</strong> {claim.claimantPhone}</p>}
            </div>
            <hr style={{ margin: '12px 0', borderColor: 'var(--border)' }} />
            <div>
              <p style={{ color: 'var(--secondary)', fontWeight: 600 }}>Finder</p>
              <p><strong>Email:</strong> {claim.finderEmail || 'Hidden'}</p>
              <p><strong>Phone:</strong> {claim.finderPhone || 'Hidden'}</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <h3>Found Item Reference</h3>
          <p><strong>Title:</strong> {claim.foundItemTitle}</p>
        </div>

        {showActions && (
          <div className="card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <h3>Admin Override & Decision</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 12 }}>
              Please review all submitted proof before deciding. Approval is final and moves the item to handover status.
            </p>
            <textarea 
              placeholder="Internal Admin Notes (optional)" 
              style={{ width: '100%', minHeight: 80, marginBottom: 16, padding: 8 }}
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              disabled={processing}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-success" disabled={processing} onClick={() => handleAction('approve')}>
                {processing ? 'Processing...' : 'Approve Claim'}
              </button>
              <button className="btn btn-danger" disabled={processing} onClick={() => handleAction('reject')}>
                {processing ? 'Processing...' : 'Reject Claim'}
              </button>
              {claim.status === 'PENDING' && (
                <button className="btn btn-primary" disabled={processing} onClick={() => handleAction('review')}>
                  Mark Under Review
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
