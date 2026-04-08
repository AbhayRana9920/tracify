import { STATUS_COLORS } from '../../utils/constants';
import { getStatusLabel } from '../../utils/helpers';

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#6b7280';
  return (
    <span className="badge" style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
      {getStatusLabel(status)}
    </span>
  );
}
