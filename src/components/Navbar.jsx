import { ShieldCheck, Search, Bell, User, Globe, Type, Sun, Moon, Wifi, WifiOff } from 'lucide-react';
import { Button } from './Button';
import { useApp } from '../context/AppContext';

export const Navbar = ({ onNavigate }) => {
  const { lang, setLang, isHighContrast, setIsHighContrast, fontSize, setFontSize, isOnline, t, user, logout } = useApp();

  const toggleContrast = () => setIsHighContrast(!isHighContrast);
  const increaseFont = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 2, 12));

  return (
    <nav className="glass-nav">
      <div className="container nav-content">
        <div className="logo" onClick={() => onNavigate('landing')} style={{ cursor: 'pointer' }}>
          <ShieldCheck className="logo-icon" size={32} />
          <div className="logo-text">
            <span className="logo-main">VoteSmart</span>
            <span className="logo-sub">Nigeria</span>
          </div>
        </div>

        <div className="nav-links">
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('candidates'); }}>{t('candidates')}</a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('candidates'); }}>Manifestos</a>
          <div className="nav-divider"></div>
          
          <div className="status-indicator">
            {isOnline ? <Wifi size={16} className="text-emerald-500" /> : <WifiOff size={16} className="text-red-500" />}
          </div>

          <div className="language-selector">
            <Globe size={16} />
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="ha">Hausa</option>
              <option value="yo">Yoruba</option>
              <option value="ig">Igbo</option>
              <option value="pg">Pidgin</option>
            </select>
          </div>

          <div className="accessibility-controls">
            <button onClick={toggleContrast} title="Toggle Contrast">
               {isHighContrast ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={increaseFont} title="Increase Font Size">
               <Type size={16} />+
            </button>
          </div>

          <a href="#" className="nav-link" onClick={() => onNavigate('admin')}>Admin</a>
        </div>

        <div className="nav-actions">
          {user ? (
            <div className="user-profile">
              <div className="user-info">
                <span className="user-welcome">Welcome,</span>
                <span className="user-name">{user.name}</span>
              </div>
              <Button variant="outline" className="btn-logout" onClick={() => { logout(); onNavigate('landing'); }}>
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button variant="outline" className="btn-voter-login" onClick={() => onNavigate('auth')}>
                Login
              </Button>
              <Button className="btn-pvc" onClick={() => onNavigate('auth')}>
                {t('verifyPvc')}
              </Button>
            </>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .glass-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          z-index: 1000;
          display: flex;
          align-items: center;
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 0 1rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-right: 2rem;
        }

        .logo-icon {
          color: var(--color-primary);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .logo-main {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: white;
        }

        .logo-sub {
          font-size: 0.75rem;
          color: var(--color-primary-light);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-divider {
          width: 1px;
          height: 24px;
          background: var(--color-border);
        }

        .language-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-secondary);
        }

        .language-selector select {
          background: transparent;
          border: none;
          color: white;
          font-size: 0.85rem;
          outline: none;
          cursor: pointer;
        }

        .accessibility-controls {
          display: flex;
          gap: 0.5rem;
        }

        .accessibility-controls button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
        }

        .nav-link {
          color: var(--color-text-secondary);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: var(--transition-fast);
        }

        .nav-link:hover, .nav-link.active {
          color: white;
        }

        .nav-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          padding: 0.5rem 0.5rem 0.5rem 1rem;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .user-welcome {
          font-size: 0.7rem;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: white;
        }

        .btn-logout {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
          height: auto;
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
        }

        @media (max-width: 768px) {
          .nav-links, .btn-voter-login {
            display: none;
          }
        }
      `}} />
    </nav>
  );
};
