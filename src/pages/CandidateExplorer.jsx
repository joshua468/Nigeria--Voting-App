import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronRight, User, Award, BookOpen } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

import { OSUN_CANDIDATES } from '../utils/candidates';
import { useApp } from '../context/AppContext';

export const CandidateExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const { setSelectedCandidateId, selectedCandidateId } = useApp();

  const selectedCandidate = OSUN_CANDIDATES.find(c => c.id === selectedCandidateId);

  const filteredCandidates = OSUN_CANDIDATES.filter(c => 
    (activeFilter === 'All' || c.position.includes(activeFilter)) &&
    (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.party.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="candidate-explorer">
      <section className="explorer-header">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="header-content"
          >
            <h1>Candidate <span className="gradient-text">Explorer</span></h1>
            <p>Transparency is the bedrock of democracy. Learn about every candidate before you cast your vote.</p>
          </motion.div>

          <div className="search-filter-bar glass-panel">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search by name, party or position..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-chips">
              {['All', 'President', 'Governor', 'Senator'].map(filter => (
                <button 
                  key={filter}
                  className={activeFilter === filter ? 'chip active' : 'chip'}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="candidate-grid container">
        <AnimatePresence mode="popLayout">
          {filteredCandidates.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="candidate-card">
                <div className="card-accent" style={{ backgroundColor: candidate.color }}></div>
                <div className="candidate-avatar-wrapper">
                  <img src={candidate.image} alt={candidate.name} className="candidate-avatar" />
                  <div className="party-badge">
                    {candidate.party.includes('(') ? candidate.party.split('(')[1].replace(')', '') : candidate.party.slice(0, 3).toUpperCase()}
                  </div>
                </div>
                
                <div className="candidate-info">
                  <span className="position-tag">{candidate.position} - {candidate.state}</span>
                  <h3>{candidate.name}</h3>
                  <p className="party-name">{candidate.party}</p>
                  <p className="running-mate text-xs text-slate-400 mb-2">Running Mate: {candidate.running_mate}</p>
                  
                  <div className="candidate-stats">
                    <div className="stat">
                      <Award size={14} />
                      <span>Verified</span>
                    </div>
                    <div 
                      className="stat cursor-pointer hover:bg-white/10"
                      onClick={() => setSelectedCandidateId(candidate.id)}
                    >
                      <BookOpen size={14} />
                      <span>View Manifesto</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" onClick={() => setSelectedCandidateId(candidate.id)}>
                    Full Profile <ChevronRight size={16} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Manifesto Modal */}
        <AnimatePresence>
          {selectedCandidate && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              onClick={() => setSelectedCandidateId(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="manifesto-modal glass-panel"
                onClick={e => e.stopPropagation()}
              >
                <div className="modal-header">
                  <div className="flex items-center gap-4">
                    <img src={selectedCandidate.image} alt="" className="w-12 h-12 rounded-lg" />
                    <div>
                      <h2>{selectedCandidate.name}</h2>
                      <p className="text-emerald-500 font-bold">{selectedCandidate.party}</p>
                    </div>
                  </div>
                  <button className="close-btn" onClick={() => setSelectedCandidateId(null)}>&times;</button>
                </div>
                <div className="modal-body">
                  <h3>Candidate Manifesto</h3>
                  <div className="manifesto-content mt-4">
                    {selectedCandidate.manifesto.split('\n').map((line, i) => (
                      <p key={i} className="mb-4 text-slate-300 leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button onClick={() => setSelectedCandidateId(null)}>Close Manifesto</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredCandidates.length === 0 && (
          <div className="no-results">
            <Search size={48} className="text-slate-600 mb-4" />
            <h3>No candidates found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </section>

      <style jsx="true">{`
        .candidate-explorer {
          padding-top: 100px;
          min-height: 100vh;
        }

        .explorer-header {
          padding: 60px 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0) 100%);
        }

        .header-content {
          text-align: center;
          margin-bottom: 3rem;
        }

        .header-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .header-content p {
          color: var(--color-text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .search-filter-bar {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1rem 1.5rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .search-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid var(--color-border);
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
        }

        .search-icon {
          color: var(--color-text-secondary);
        }

        .search-input-wrapper input {
          background: transparent;
          border: none;
          color: white;
          width: 100%;
          outline: none;
          font-size: 0.95rem;
        }

        .filter-chips {
          display: flex;
          gap: 0.5rem;
        }

        .chip {
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          padding: 0.5rem 1.25rem;
          border-radius: 100px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: var(--transition-fast);
        }

        .chip:hover {
          border-color: var(--color-text-primary);
          color: white;
        }

        .chip.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
        }

        .candidate-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 2rem;
          padding-bottom: 100px;
        }

        .candidate-card {
          position: relative;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .card-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .candidate-avatar-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          margin-bottom: 1.5rem;
        }

        .candidate-avatar {
          width: 100%;
          height: 100%;
          border-radius: 1.25rem;
          background: var(--color-surface-hover);
          object-fit: cover;
        }

        .party-badge {
          position: absolute;
          bottom: -5px;
          right: -5px;
          background: var(--color-surface);
          border: 2px solid var(--color-bg);
          color: var(--color-primary-light);
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .position-tag {
          font-size: 0.75rem;
          color: var(--color-primary-light);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
          display: block;
        }

        .party-name {
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .candidate-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .candidate-stats .stat {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          background: rgba(255, 255, 255, 0.03);
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
        }

        .candidate-bio-short {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 100px 0;
          color: var(--color-text-secondary);
        }

        @media (max-width: 768px) {
          .search-filter-bar {
            flex-direction: column;
            gap: 1rem;
          }
          .filter-chips {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 2rem;
        }

        .manifesto-modal {
          max-width: 600px;
          width: 100%;
          padding: 2.5rem !important;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          margin: 0;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          font-size: 2rem;
          cursor: pointer;
          line-height: 1;
        }

        .manifesto-content p {
          color: var(--color-text-secondary);
        }
      `}</style>
    </div>
  );
};
