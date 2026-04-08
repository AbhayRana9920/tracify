import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import foundItemService from '../../services/foundItemService';
import claimService from '../../services/claimService';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiImage, FiUploadCloud } from 'react-icons/fi';

export default function ClaimFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    proofDetails: '',
    identifyingMarks: '',
    proofImage: null
  });

  useEffect(() => {
    foundItemService.getById(id)
      .then(res => setItem(res.data.data))
      .catch(() => {
        toast.error('Item not found');
        navigate('/found-items');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({ ...prev, proofImage: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message || !formData.proofDetails) {
      toast.error('Please provide a message and proof of ownership details.');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      
      const claimRequest = {
        foundItemId: id,
        claimMessage: formData.message,
        proofOfOwnership: formData.proofDetails,
        identifyingInfo: formData.identifyingMarks
      };
      
      data.append('claim', new Blob([JSON.stringify(claimRequest)], { type: 'application/json' }));
      
      if (formData.proofImage) {
        data.append('proofDocument', formData.proofImage);
      }

      await claimService.submit(data);
      toast.success('Claim submitted successfully! The finder has been notified.');
      navigate('/my-claims');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit claim.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-screen" style={{ paddingTop: 'var(--navbar-height)' }}><div className="spinner"></div></div>;
  if (!item) return null;

  return (
    <div style={{ paddingTop: 'calc(var(--navbar-height) + 24px)', maxWidth: 700, margin: '0 auto', paddingLeft: 24, paddingRight: 24, paddingBottom: 40 }}>
      <div className="detail-header" style={{ marginBottom: 24 }}>
        <div className="detail-back" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Claim Item: {item.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 8 }}>
          Provide clear proof that you are the original owner of this item. Your contact information will be shared with the finder.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div className="input-group">
            <label>Message to Finder *</label>
            <textarea 
              placeholder="Describe why you believe this is your item..."
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              required
              style={{ minHeight: 120 }}
            />
          </div>

          <div className="input-group">
            <label>Proof of Ownership Details *</label>
            <textarea 
              placeholder="E.g., It has a scratch on the back, I have the receipt, my name is written inside..."
              value={formData.proofDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, proofDetails: e.target.value }))}
              required
              style={{ minHeight: 100 }}
            />
          </div>

          <div className="input-group">
            <label>Serial Number / Identifying Marks (Optional)</label>
            <input 
              type="text"
              placeholder="Any specific identification numbers"
              value={formData.identifyingMarks}
              onChange={(e) => setFormData(prev => ({ ...prev, identifyingMarks: e.target.value }))}
            />
          </div>

          <div className="input-group">
            <label>Upload Proof Document/Image (Optional)</label>
            <div style={{ border: '1px dashed var(--border)', padding: 24, borderRadius: 8, textAlign: 'center' }}>
              <FiUploadCloud style={{ fontSize: 24, color: 'var(--text-secondary)', marginBottom: 8 }} />
              <input type="file" onChange={handleFileChange} accept="image/*,.pdf" style={{ display: 'block', width: '100%' }} />
              {formData.proofImage && <p style={{ fontSize: '0.85rem', color: 'var(--success)', marginTop: 8 }}>{formData.proofImage.name} selected</p>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ marginTop: 12, justifyContent: 'center' }}>
            {submitting ? 'Submitting Claim...' : 'Submit Claim Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
