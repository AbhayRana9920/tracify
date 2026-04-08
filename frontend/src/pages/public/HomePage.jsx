import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiSearch, FiShield, FiZap, FiCheckCircle, FiUsers, FiArrowRight } from 'react-icons/fi';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      <section className="hero">
        <div className="hero-content">
          <h1>
            Lost Something?<br />
            <span className="gradient">Tracify Finds It.</span>
          </h1>
          <p>
            A smart lost & found management system that connects people with their missing belongings through intelligent matching and secure claim verification.
          </p>
          <div className="hero-actions">
            <Link to={user ? "/post-lost" : "/register"} className="btn btn-primary btn-lg">
              Report Lost Item <FiArrowRight />
            </Link>
            <Link to="/found-items" className="btn btn-secondary btn-lg">
              Browse Found Items <FiSearch />
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>How <span style={{ color: 'var(--primary-light)' }}>Tracify</span> Works</h2>
        <div className="features-grid">
          <div className="card feature-card">
            <div className="feature-icon">📝</div>
            <h3>Report</h3>
            <p>Post details about your lost or found item with images, location, and identifying information.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🤖</div>
            <h3>Smart Matching</h3>
            <p>Our algorithm scans found items and suggests potential matches based on category, color, brand, and more.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">✅</div>
            <h3>Claim & Verify</h3>
            <p>Submit a claim with proof of ownership. Admin verifies and facilitates secure return.</p>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
          <FiShield style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '16px' }} />
          <h2 style={{ marginBottom: '12px' }}>Secure & Trusted</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Role-based access control, JWT authentication, and admin-verified claims ensure your items are returned safely.
          </p>
          {!user && (
            <Link to="/register" className="btn btn-primary">Get Started Free <FiArrowRight /></Link>
          )}
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Tracify — Lost & Found Management System. Built with ❤️</p>
      </footer>
    </div>
  );
}
