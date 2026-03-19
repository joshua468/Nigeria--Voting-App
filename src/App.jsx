import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { CandidateExplorer } from './pages/CandidateExplorer';
import { VoterAuth } from './pages/VoterAuth';
import { BallotPage } from './pages/BallotPage';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const { user } = useApp();

  // Navigation guard or auto-redirect can be added here if needed

  return (
    <div className="app">
      <Navbar onNavigate={setCurrentPage} />
      
      <main>
        {currentPage === 'landing' && <LandingPage onNavigate={setCurrentPage} />}
        {currentPage === 'candidates' && <CandidateExplorer />}
        {currentPage === 'auth' && <VoterAuth onAuthComplete={() => setCurrentPage('ballot')} />}
        {currentPage === 'ballot' && (user ? <BallotPage /> : <VoterAuth onAuthComplete={() => setCurrentPage('ballot')} />)}
        {currentPage === 'admin' && <AdminDashboard />}
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <p>&copy; 2026 VoteSmart Nigeria. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Official INEC Portal</a>
          </div>
        </div>
      </footer>

      <style jsx="true">{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        main {
          flex: 1;
        }

        .footer {
          padding: 3rem 0;
          border-top: 1px solid var(--color-border);
          background: rgba(15, 23, 42, 0.5);
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .footer-links {
          display: flex;
          gap: 2rem;
        }

        .footer-links a {
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: var(--transition-fast);
        }

        .footer-links a:hover {
          color: white;
        }

        @media (max-width: 640px) {
          .footer-content {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
