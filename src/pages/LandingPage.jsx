import { ShieldCheck, Vote, Users, ShieldAlert, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export const LandingPage = ({ onNavigate }) => {
  const { t } = useApp();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
        
        <div className="container hero-content">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <div className="badge">
              <ShieldCheck size={14} />
              <span>Independent & Secure Electoral Platform</span>
            </div>
            <h1>{t('welcome').split(',').slice(0, 2).join(',')} <span className="gradient-text">{t('welcome').split(',').slice(2).join(',')}</span></h1>
            <p className="hero-description">
              VoteSmart Nigeria brings transparency, trust, and accessibility to our national elections. 
              Modernizing the voting experience with end-to-end encryption and real-time verification.
            </p>
            <div className="hero-btns">
              <Button className="btn-lg" onClick={() => onNavigate('auth')}>
                Cast Your Vote <ChevronRight size={18} />
              </Button>
              <Button variant="outline" className="btn-lg" onClick={() => onNavigate('candidates')}>
                Explore Candidates
              </Button>
            </div>
            
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">99.9%</span>
                <span className="stat-label">Security Uptime</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-value">256-bit</span>
                <span className="stat-label">Encryption</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-value">0%</span>
                <span className="stat-label">Fraud Incidence</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-visual"
          >
            <div className="floating-card ballot-card">
              <Vote size={48} className="text-emerald-500" />
              <h3>Digital Ballot</h3>
              <p>Encrypted & Anonymous</p>
            </div>
            <div className="floating-card verification-card">
              <ShieldCheck size={32} className="text-gold-500" />
              <p>PVC Verified</p>
            </div>
            <div className="hero-image-wrapper">
               <img 
                 src="/hero.png" 
                 alt="VoteSmart Nigeria" 
                 className="hero-main-img"
               />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features container">
        <div className="section-header">
          <h2>Secure, Accessible & Transparent</h2>
          <p>The future of Nigerian democracy, built on trust and technology.</p>
        </div>

        <div className="features-grid">
          <Card delay={0.1}>
            <div className="feature-icon bg-emerald-500/10 text-emerald-500">
              <ShieldCheck size={24} />
            </div>
            <h3>PVC Verification</h3>
            <p>Direct integration with INEC registry ensuring only eligible citizens can participate.</p>
          </Card>

          <Card delay={0.2}>
            <div className="feature-icon bg-blue-500/10 text-blue-500">
              <Users size={24} />
            </div>
            <h3>Candidate Hub</h3>
            <p>Comprehensive search for candidates, their history, and manifestos across all positions.</p>
          </Card>

          <Card delay={0.3}>
            <div className="feature-icon bg-amber-500/10 text-amber-500">
              <ShieldAlert size={24} />
            </div>
            <h3>Anti-Fraud Systems</h3>
            <p>Geo-fencing and 2FA to ensure every vote is cast by a real person within Nigeria.</p>
          </Card>
        </div>
      </section>

      <style jsx="true">{`
        .hero {
          position: relative;
          padding: 160px 0 100px;
          min-height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
        }

        .blob {
          position: absolute;
          filter: blur(80px);
          opacity: 0.15;
          border-radius: 50%;
        }

        .blob-1 {
          width: 500px;
          height: 500px;
          background: var(--color-primary);
          top: -100px;
          right: -100px;
        }

        .blob-2 {
          width: 400px;
          height: 400px;
          background: var(--color-accent);
          bottom: -50px;
          left: -100px;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          align-items: center;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 135, 81, 0.1);
          border: 1px solid rgba(0, 135, 81, 0.2);
          color: var(--color-primary-light);
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 2rem;
        }

        .hero-text h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .hero-description {
          font-size: 1.25rem;
          color: var(--color-text-secondary);
          margin-bottom: 2.5rem;
          max-width: 600px;
        }

        .hero-btns {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          color: white;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--color-border);
        }

        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-image-wrapper {
          width: 450px;
          height: 450px;
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.5));
          border-radius: 3rem;
          border: 1px solid var(--glass-border);
          position: relative;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
        }

        .hero-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.8;
          transition: transform 0.5s ease;
        }

        .hero-image-wrapper:hover .hero-main-img {
          transform: scale(1.05);
        }

        .geometric-pattern {
          position: absolute;
          inset: 20px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 2rem;
          pointer-events: none;
        }

        .floating-card {
          position: absolute;
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          z-index: 10;
          animation: float 6s ease-in-out infinite;
        }

        .ballot-card {
          top: -20px;
          right: -20px;
          width: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.5rem;
        }

        .verification-card {
          bottom: 40px;
          left: -40px;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .features {
          padding: 80px 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .section-header p {
          color: var(--color-text-secondary);
          font-size: 1.125rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-text {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-btns {
            justify-content: center;
          }
          .hero-stats {
            justify-content: center;
          }
          .hero-visual {
            margin-top: 4rem;
          }
        }
      `}</style>
    </div>
  );
};
