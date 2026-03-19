import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Vote, ChevronRight, CheckCircle2, Lock, FileText, Download, Share2, WifiOff } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';

import { OSUN_CANDIDATES } from '../utils/candidates';

const POSITIONS = [
  {
    id: 'governor-osun',
    title: 'Governor (Osun State)',
    candidates: OSUN_CANDIDATES
  }
];

export const BallotPage = () => {
  const { isOnline, setOfflineVotes, addVote, currentVoterId, t } = useApp();
  const [step, setStep] = useState('selection'); // selection -> confirm -> casting -> receipt
  const [currentPositionIdx, setCurrentPositionIdx] = useState(0);
  const [selections, setSelections] = useState({});
  const [receiptHash, setReceiptHash] = useState('');

  const currentPosition = POSITIONS[currentPositionIdx];

  const handleSelect = (candidateId) => {
    setSelections({ ...selections, [currentPosition.id]: candidateId });
  };

  const handleNext = () => {
    if (currentPositionIdx < POSITIONS.length - 1) {
      setCurrentPositionIdx(currentPositionIdx + 1);
    } else {
      setStep('confirm');
    }
  };

  const handleCastVote = () => {
    setStep('casting');
    
    // Simulate encryption and blockchain ledger entry
    setTimeout(() => {
      const hash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setReceiptHash(hash);

      const candidateId = selections['governor-osun'];
      const success = addVote(candidateId, currentVoterId);

      if (!isOnline && success) {
        // Save for later sync
        setOfflineVotes(prev => [...prev, { selections, hash, timestamp: new Date().toISOString(), voterId: currentVoterId }]);
      }

      setStep('receipt');
    }, 3000);
  };

  return (
    <div className="ballot-page">
      <div className="container ballot-container">
        <AnimatePresence mode="wait">
          {step === 'selection' && (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="ballot-header">
                <div className="progress-indicator">
                  Step {currentPositionIdx + 1} of {POSITIONS.length}
                </div>
                <h1>Select Your <span className="gradient-text">{currentPosition.title}</span></h1>
                <p>Choose your preferred candidate for this position.</p>
              </div>

              <div className="candidate-selection-grid">
                {currentPosition.candidates.map(candidate => (
                  <motion.div 
                    key={candidate.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(candidate.id)}
                    className={`selection-card ${selections[currentPosition.id] === candidate.id ? 'selected' : ''}`}
                  >
                    <div className="candidate-avatar">
                      <img src={candidate.image} alt={candidate.name} className="object-cover" />
                    </div>
                    <div className="candidate-meta">
                      <h3>{candidate.name}</h3>
                      <span className="party-tag" style={{ backgroundColor: candidate.color }}>{candidate.party}</span>
                    </div>
                    {selections[currentPosition.id] === candidate.id && (
                      <CheckCircle2 className="selected-icon" size={24} />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="ballot-actions">
                <Button 
                  className="w-full btn-lg" 
                  disabled={!selections[currentPosition.id]}
                  onClick={handleNext}
                >
                  {currentPositionIdx < POSITIONS.length - 1 ? 'Next Position' : 'Review Ballot'} <ChevronRight size={18} />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div 
              key="confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="confirm-ballot"
            >
              <Card className="review-card">
                <div className="review-header">
                  <ShieldCheck size={32} className="text-emerald-500" />
                  <h2>Review Your Ballot</h2>
                  <p>Please double check your selections. Once cast, your vote cannot be changed.</p>
                </div>

                <div className="selection-list mt-6">
                  {POSITIONS.map(pos => {
                    const selected = pos.candidates.find(c => c.id === selections[pos.id]);
                    return (
                      <div key={pos.id} className="review-item">
                        <span className="pos-label">{pos.title}</span>
                        <div className="selected-cand">
                          <img src={selected.image} alt="" className="object-cover" />
                          <div>
                            <strong>{selected.name}</strong>
                            <span>{selected.party}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="warning-box">
                  <Lock size={16} />
                  <span>Your vote will be encrypted using AES-256 and stored on the immutable ledger.</span>
                </div>

                <div className="confirm-actions">
                  <Button variant="outline" onClick={() => { setStep('selection'); setCurrentPositionIdx(0); }}>
                    Change Selection
                  </Button>
                  <Button className="btn-cast" onClick={handleCastVote}>
                    <Vote size={18} /> Cast Official Vote
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 'casting' && (
            <motion.div 
              key="casting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="casting-overlay"
            >
              <div className="casting-content text-center">
                <div className="blockchain-animation">
                   <div className="node"></div>
                   <div className="line"></div>
                   <div className="node"></div>
                </div>
                <h2 className="animate-pulse">Encrypting & Securing Vote</h2>
                <p>Generating cryptographic proof of your selection...</p>
              </div>
            </motion.div>
          )}

          {step === 'receipt' && (
            <motion.div 
              key="receipt"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="receipt-view"
            >
              <Card className="receipt-card">
                <div className="success-banner">
                  <CheckCircle2 size={48} className="text-emerald-500" />
                  <h2>Vote Cast Successfully</h2>
                  {!isOnline && (
                    <div className="offline-notice mt-2 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs flex items-center justify-center gap-2">
                       <WifiOff size={14} /> Saved Locally for Sync
                    </div>
                  )}
                  <p>Your voice has been heard and protected.</p>
                </div>

                <div className="receipt-details">
                  <div className="detail-row">
                    <span>Transaction ID</span>
                    <code className="text-xs">{receiptHash}</code>
                  </div>
                  <div className="detail-row">
                    <span>Timestamp</span>
                    <span>March 11, 2026 - 10:40 AM</span>
                  </div>
                  <div className="detail-row">
                    <span>Status</span>
                    <span className="text-emerald-500 font-bold">COMMITTED</span>
                  </div>
                </div>

                <div className="receipt-actions">
                  <Button variant="outline" className="flex-1">
                    <Download size={18} /> Download Receipt
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 size={18} /> Verify on Ledger
                  </Button>
                </div>

                <Button className="w-full mt-6" onClick={() => window.location.reload()}>
                  Return to Home
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx="true">{`
        .ballot-page {
          padding: 120px 0 80px;
          min-height: 100vh;
          background: radial-gradient(circle at top right, rgba(212, 175, 55, 0.03), transparent);
        }

        .ballot-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .progress-indicator {
          display: inline-block;
          background: rgba(0, 135, 81, 0.1);
          color: var(--color-primary-light);
          padding: 0.35rem 1rem;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .candidate-selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .selection-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 1.25rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          cursor: pointer;
          transition: var(--transition-base);
          position: relative;
        }

        .selection-card:hover {
          border-color: var(--color-primary-light);
          background: rgba(0, 135, 81, 0.05);
        }

        .selection-card.selected {
          border-color: var(--color-primary);
          background: rgba(0, 135, 81, 0.1);
          box-shadow: 0 0 20px rgba(0, 135, 81, 0.2);
        }

        .candidate-avatar img {
          width: 64px;
          height: 64px;
          border-radius: 1rem;
          background: var(--color-surface);
        }

        .party-tag {
          font-size: 0.7rem;
          font-weight: 800;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          margin-top: 0.25rem;
          display: inline-block;
        }

        .selected-icon {
          margin-left: auto;
          color: var(--color-primary);
        }

        .review-card {
          max-width: 600px;
          margin: 0 auto;
        }

        .review-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .review-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          border-bottom: 1px solid var(--color-border);
        }

        .pos-label {
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .selected-cand {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: right;
        }

        .selected-cand img {
          width: 40px;
          height: 40px;
          border-radius: 8px;
        }

        .selected-cand span {
          display: block;
          font-size: 0.8rem;
          color: var(--color-primary-light);
        }

        .warning-box {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          background: rgba(30, 41, 59, 0.5);
          padding: 1rem;
          border-radius: 0.75rem;
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          margin: 2rem 0;
        }

        .confirm-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-cast {
          flex: 1;
          height: 56px;
        }

        .casting-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 0;
        }

        .receipt-card {
          max-width: 500px;
          margin: 0 auto;
          text-align: center;
        }

        .receipt-details {
          background: rgba(15, 23, 42, 0.4);
          border-radius: 1rem;
          padding: 1.5rem;
          margin: 2rem 0;
          text-align: left;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .receipt-actions {
          display: flex;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
};
