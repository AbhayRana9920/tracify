import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const data = err.response?.data;
      if (data?.data && typeof data.data === 'object') {
        setError(Object.values(data.data).join('. '));
      } else {
        setError(data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join Tracify to find your lost items</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" value={form.fullName} onChange={update('fullName')} required />
          </div>
          <div className="input-group">
            <label>Username</label>
            <input type="text" placeholder="johndoe" value={form.username} onChange={update('username')} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="john@example.com" value={form.email} onChange={update('email')} required />
          </div>
          <div className="input-group">
            <label>Phone (optional)</label>
            <input type="text" placeholder="+91 9876543210" value={form.phone} onChange={update('phone')} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password} onChange={update('password')} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
