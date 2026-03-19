import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, ShieldAlert, BarChart3, Activity, Terminal, AlertCircle, CheckCircle2, Globe, Wifi, WifiOff } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { OSUN_CANDIDATES } from '../utils/candidates';

export const AdminDashboard = () => {
  const { isOnline, offlineVotes, votes, fraudAlerts, verificationLogs } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Base mock votes + real session votes
  const getCandidateVotes = (id) => {
    const baseVotes = 45000 + (id * 1234) % 5000; // Deterministic mock base
    return baseVotes + (votes[id] || 0);
  };

  const totalVotes = OSUN_CANDIDATES.reduce((acc, c) => acc + getCandidateVotes(c.id), 0);

  return (
    <div className="admin-dashboard">
      <div className="container dashboard-container">
        <div className="dashboard-sidebar">
          <div className="sidebar-group">
            <span className="sidebar-label">Main</span>
            <button className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <LayoutDashboard size={18} /> Overview
            </button>
            <button className={`sidebar-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
              <BarChart3 size={18} /> Live Tally
            </button>
          </div>
          <div className="sidebar-group">
            <span className="sidebar-label">Security</span>
            <button className={`sidebar-btn ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
              <Terminal size={18} /> Audit logs
            </button>
            <button className={`sidebar-btn ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>
              <ShieldAlert size={18} /> Fraud Alerts
            </button>
          </div>
        </div>

        <main className="dashboard-main">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-header">
                <h1>Election <span className="gradient-text">Command Center</span></h1>
                <div className="status-badges">
                  <div className={`connectivity-status ${isOnline ? 'online' : 'offline'}`}>
                    {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                    {isOnline ? 'Network Stable' : 'Offline Mode'}
                  </div>
                  <div className="live-indicator">
                    <span className="dot animate-pulse"></span>
                    LIVE UPDATES
                  </div>
                </div>
              </div>

              <div className="stats-grid">
                <Card className="stat-card">
                  <div className="stat-icon bg-emerald-500/10 text-emerald-500"><Users size={24} /></div>
                  <div className="stat-info">
                    <span className="label">Total Votes Cast</span>
                    <span className="value">{totalVotes.toLocaleString()}</span>
                    <span className="trend text-emerald-500">+{(Object.keys(votes).length)} in current session</span>
                  </div>
                </Card>
                <Card className="stat-card">
                  <div className="stat-icon bg-amber-500/10 text-amber-500"><Activity size={24} /></div>
                  <div className="stat-info">
                    <span className="label">Active Sessions</span>
                    <span className="value">24,802</span>
                    <span className="trend text-amber-500">Peak Load</span>
                  </div>
                </Card>
                <Card className="stat-card">
                  <div className="stat-icon bg-red-500/10 text-red-500"><ShieldAlert size={24} /></div>
                  <div className="stat-info">
                    <span className="label">Fraud Alerts</span>
                    <span className="value">{fraudAlerts.length}</span>
                    <span className="trend text-red-400">Recent Signals</span>
                  </div>
                </Card>
              </div>

              {offlineVotes.length > 0 && (
                <div className="offline-sync-notice mt-6">
                  <Card className="bg-amber-500/10 border-amber-500/20">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500">
                        <ShieldAlert size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-amber-500 font-bold">Unsynced Local Votes Detected</h4>
                        <p className="text-sm text-slate-400">{offlineVotes.length} votes are currently stored locally on this device. They will automatically sync when connectivity is restored.</p>
                      </div>
                      <Button variant="outline" className="btn-sm border-amber-500/30 text-amber-500">
                        Sync Now
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              <div className="charts-grid mt-8">
                <Card className="chart-container">
                  <div className="flex justify-between items-center mb-6">
                    <h3>Real-time Tally (Osun Governor)</h3>
                    <span className="text-xs font-mono text-emerald-500">Live Hash: 0x82...f92</span>
                  </div>
                  <div className="tally-bars mt-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {OSUN_CANDIDATES.map(candidate => {
                      const count = getCandidateVotes(candidate.id);
                      const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                      return (
                        <div key={candidate.id} className="tally-item mb-5">
                          <div className="tally-label mb-1">
                            <div className="flex items-center gap-2">
                              <img src={candidate.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                              <span className="text-[11px] font-medium">{candidate.name} ({candidate.party.split('(')[1]?.replace(')', '') || candidate.party})</span>
                            </div>
                            <span className="text-xs font-bold text-slate-300">{count.toLocaleString()} ({percentage}%)</span>
                          </div>
                          <div className="progress-bg h-2">
                            <motion.div 
                              className="progress-fill" 
                              style={{ backgroundColor: candidate.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card className="recent-activity">
                  <div className="flex justify-between items-center mb-6">
                    <h3>Security Audit Stream</h3>
                    <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-bold">ENCRYPTED</div>
                  </div>
                  <div className="log-stream mt-4 max-h-[350px] overflow-y-auto custom-scrollbar">
                    {fraudAlerts.length > 0 ? fraudAlerts.map((alert, idx) => (
                      <motion.div 
                        key={alert.id} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="log-entry critical border-l-2 border-red-500/50 mb-3"
                      >
                        <span className="log-time text-[9px] opacity-50">{alert.timestamp}</span>
                        <div className="log-msg">
                          <ShieldAlert size={12} className="text-red-500" />
                          <span className="text-[11px] leading-tight">{alert.message}</span>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="text-center py-12 text-slate-500">
                        <CheckCircle2 size={32} className="mx-auto mb-4 opacity-20" />
                        <p className="text-sm">No security threats detected.<br/>System Integrity: 100%</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="results-tab">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1>Candidate <span className="gradient-text">Performance</span></h1>
                  <p className="text-slate-400 mt-2">Real-time breakdown by party and percentage.</p>
                </div>
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <span className="text-xs text-emerald-500 font-bold block">TOTAL VERIFIED VOTES</span>
                  <span className="text-2xl font-black text-white">{totalVotes.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {OSUN_CANDIDATES.map((candidate, idx) => {
                  const count = getCandidateVotes(candidate.id);
                  const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0;
                  return (
                    <motion.div 
                      key={candidate.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="flex items-center gap-6 p-6">
                        <img src={candidate.image} alt="" className="w-16 h-16 rounded-xl object-cover ring-2 ring-slate-800" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <h3 className="text-lg font-bold">{candidate.name}</h3>
                              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${candidate.color}20`, color: candidate.color }}>
                                {candidate.party}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-black">{percentage}%</span>
                              <p className="text-xs text-slate-500">{count.toLocaleString()} votes</p>
                            </div>
                          </div>
                          <div className="progress-bg h-3">
                            <motion.div 
                              className="progress-fill" 
                              style={{ backgroundColor: candidate.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="audit-tab">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1>Security <span className="gradient-text">Audit Trail</span></h1>
                  <p className="text-slate-400 mt-2">Real-time cryptographic logs of voter verification attempts.</p>
                </div>
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <span className="text-xs text-emerald-500 font-bold uppercase tracking-tight">System Integrity: 99.9%</span>
                </div>
              </div>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {verificationLogs.length > 0 ? verificationLogs.map((log, idx) => (
                  <motion.div 
                    key={log.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-panel p-4 flex items-center gap-6 border-l-2 border-emerald-500/30"
                  >
                    <div className="text-[10px] font-mono text-slate-500 w-20">{log.timestamp}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{log.step}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-black ${
                          log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Voter PVC: <span className="font-mono text-white">{log.pvcId}</span>
                        {log.details && <span className="ml-3 text-slate-500">— {log.details}</span>}
                      </div>
                    </div>
                    <div className="p-2 bg-slate-800/50 rounded-lg text-slate-500">
                      <Terminal size={14} />
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-24 glass-panel rounded-3xl opacity-30">
                    <Activity size={48} className="mx-auto mb-4" />
                    <p>No verification events logged yet today.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="alerts-tab">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1>Threat <span className="gradient-text">Intelligence</span></h1>
                  <p className="text-slate-400 mt-2">Real-time monitoring of electoral integrity risks.</p>
                </div>
                <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <span className="text-xs text-red-500 font-bold">TOTAL INCIDENTS: {fraudAlerts.length}</span>
                </div>
              </div>

              <div className="space-y-4">
                {fraudAlerts.length > 0 ? fraudAlerts.map((alert, idx) => (
                  <motion.div 
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="border-l-4 border-red-500 bg-red-500/5">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                          <ShieldAlert size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-mono text-slate-500">{alert.timestamp}</span>
                            <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded uppercase">Critical</span>
                          </div>
                          <h4 className="font-bold text-white mb-2">{alert.message}</h4>
                          <div className="flex items-center gap-4 text-[10px] text-slate-400 uppercase tracking-widest">
                            <span>Detected via: Pattern Analysis</span>
                            <span>Action: Logged & Flagged</span>
                          </div>
                        </div>
                        <Button variant="outline" className="btn-sm border-red-500/30 text-red-500 hover:bg-red-500/10">
                          Investigate
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )) : (
                  <div className="text-center py-24 glass-panel rounded-3xl">
                    <CheckCircle2 size={64} className="mx-auto text-emerald-500 opacity-20 mb-4" />
                    <h3 className="text-xl font-bold text-slate-300">System Secure</h3>
                    <p className="text-slate-500">No security threats or fraudulent activities detected.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx="true">{`
        .admin-dashboard {
          padding-top: 100px;
          min-height: 100vh;
          background: #020617;
        }

        .dashboard-container {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 2rem;
          padding: 2rem;
        }

        .dashboard-sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          border-right: 1px solid var(--color-border);
          padding-right: 1rem;
        }

        .sidebar-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sidebar-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-secondary);
          margin-bottom: 0.5rem;
          padding-left: 0.75rem;
        }

        .sidebar-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          font-size: 0.95rem;
          transition: var(--transition-base);
          text-align: left;
        }

        .sidebar-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .sidebar-btn.active {
          background: rgba(0, 135, 81, 0.1);
          color: var(--color-primary-light);
          font-weight: 600;
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.5rem;
        }

        .status-badges {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .connectivity-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
        }

        .connectivity-status.online {
          background: rgba(0, 135, 81, 0.1);
          color: var(--color-primary-light);
        }

        .connectivity-status.offline {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 800;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
        }

        .live-indicator .dot {
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .stat-card {
          display: flex;
          gap: 1.25rem;
          align-items: center;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info .label {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          display: block;
        }

        .stat-info .value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          display: block;
        }

        .stat-info .trend {
          font-size: 0.7rem;
          font-weight: 600;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 1.5rem;
        }

        .tally-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .progress-bg {
          height: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 100px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 100px;
        }

        .log-stream {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .log-entry {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          padding: 0.5rem;
          border-radius: 0.5rem;
        }

        .log-entry.critical {
          background: rgba(239, 68, 68, 0.05);
        }

        .log-time {
          color: var(--color-text-secondary);
          font-family: monospace;
          min-width: 60px;
        }

        .log-msg {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-primary);
        }

        .audit-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .audit-table th, .audit-table td {
          padding: 1.25rem;
          border-bottom: 1px solid var(--color-border);
        }

        .audit-table th {
          font-size: 0.8rem;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          font-weight: 600;
        }

        .badge-sucess {
          background: rgba(0, 135, 81, 0.1);
          color: var(--color-primary-light);
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .badge-error {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        @media (max-width: 1024px) {
          .dashboard-container { grid-template-columns: 1fr; }
          .dashboard-sidebar { display: none; }
          .charts-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
