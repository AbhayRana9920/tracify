import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import lostItemService from '../../services/lostItemService';
import foundItemService from '../../services/foundItemService';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate, getImageUrl } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { FiArrowLeft } from 'react-icons/fi';
import ReportFoundModal from '../../components/common/ReportFoundModal';

export default function ItemDetailPage({ type }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const service = type === 'lost' ? lostItemService : foundItemService;
    service.getById(id)
      .then(res => setItem(res.data.data))
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [type, id]);

  if (loading) return <div className="loading-screen" style={{ paddingTop: 'var(--navbar-height)' }}><div className="spinner"></div></div>;
  if (!item) return null;

  const isLost = type === 'lost';

  return (
    <div style={{ paddingTop: 'calc(var(--navbar-height) + 24px)', maxWidth: 900, margin: '0 auto', paddingLeft: 24, paddingRight: 24, paddingBottom: 40 }}>
      <div className="detail-header">
        <div className="detail-back" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{item.title}</h1>
          <StatusBadge status={item.status} />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
          Posted by {item.userName} · {formatDate(item.createdAt)}
        </p>
      </div>

      {item.imageUrls?.length > 0 && (
        <div className="detail-images">
          {item.imageUrls.map((url, i) => (
            <img key={i} src={getImageUrl(url)} alt={`${item.title} ${i + 1}`} />
          ))}
        </div>
      )}

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: '1.1rem' }}>Item Details</h3>
        <div className="detail-grid">
          <div className="detail-field"><label>Item Name</label><p>{item.itemName}</p></div>
          <div className="detail-field"><label>Category</label><p>{item.categoryName}</p></div>
          <div className="detail-field"><label>Color</label><p>{item.color || 'N/A'}</p></div>
          <div className="detail-field"><label>Brand</label><p>{item.brand || 'N/A'}</p></div>
          <div className="detail-field"><label>{isLost ? 'Location Lost' : 'Location Found'}</label><p>{isLost ? item.locationLost : item.locationFound || 'N/A'}</p></div>
          <div className="detail-field"><label>{isLost ? 'Date Lost' : 'Date Found'}</label><p>{formatDate(isLost ? item.dateLost : item.dateFound)}</p></div>
          {isLost && item.rewardAmount > 0 && <div className="detail-field"><label>Reward</label><p style={{ color: 'var(--secondary)', fontWeight: 700 }}>₹{item.rewardAmount}</p></div>}
          {!isLost && item.storageLocation && <div className="detail-field"><label>Storage Location</label><p>{item.storageLocation}</p></div>}
        </div>
        {item.identificationMarks && (
          <div className="detail-field" style={{ marginTop: 12 }}>
            <label>Identification Marks</label>
            <p>{item.identificationMarks}</p>
          </div>
        )}
        {item.description && (
          <div className="detail-field" style={{ marginTop: 12 }}>
            <label>Description</label>
            <p>{item.description}</p>
          </div>
        )}
      </div>

      {!isLost && item.status === 'AVAILABLE' && user?.id !== item.userId && (
        <button className="btn btn-primary btn-lg" onClick={() => navigate(`/claim/${item.id}`)}>
          Claim This Item
        </button>
      )}

      {isLost && item.status === 'OPEN' && user && user?.id !== item.userId && (
        <button className="btn btn-success btn-lg" onClick={() => setModalOpen(true)}>
          I Found This Item
        </button>
      )}

      {modalOpen && (
        <ReportFoundModal 
          lostItem={item} 
          onClose={() => setModalOpen(false)} 
        />
      )}
    </div>
  );
}
