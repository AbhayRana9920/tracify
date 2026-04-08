import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiX } from 'react-icons/fi';
import lostItemService from '../../services/lostItemService';

export default function ReportFoundModal({ lostItem, onClose }) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please provide a message for the owner.');
      return;
    }

    setSubmitting(true);
    try {
      await lostItemService.reportFound(lostItem.id, { message });
      toast.success('Owner has been notified successfully! They will contact you shortly.');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal card-glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>Report Item Found</h2>
          <button className="btn-icon btn-ghost" onClick={onClose}><FiX /></button>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: '0.9rem' }}>
          You are reporting that you have found: <strong>{lostItem.title}</strong>.<br/><br/>
          Provide a brief message. Your contact details will be shared safely with the owner so they can reach out to you.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Message to Owner *</label>
            <textarea
              required
              placeholder="e.g. Hi, I think I found your item near the park. Please reach out so we can verify."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ minHeight: 120 }}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? 'Sending...' : 'Notify Owner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
