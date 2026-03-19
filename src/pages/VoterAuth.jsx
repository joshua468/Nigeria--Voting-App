import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Smartphone, ScanFace, CheckCircle2, AlertCircle, ArrowRight, RefreshCcw, Lock } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { findVoter } from '../utils/voters';

export const VoterAuth = ({ onAuthComplete }) => {
  const { setCurrentVoterId, addVerificationLog, addFraudAlert, votersUsed, setUser } = useApp();
  const [step, setStep] = useState('pvc'); // pvc -> otp -> biometric -> complete
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form States
  const [pvcId, setPvcId] = useState('');
  const [voterData, setVoterData] = useState(null);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [biometricStatus, setBiometricStatus] = useState('idle'); // idle -> scanning -> success -> fail

  // PVC Validation
  const handlePvcSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const voter = findVoter(pvcId);
      if (!voter) {
        setError('Invalid PVC ID. Please check and try again.');
        addVerificationLog(pvcId, "PVC_AUTH", "FAIL", "Invalid ID entered");
        setLoading(false);
        return;
      }

      if (votersUsed[pvcId]) {
        setError('Access Denied: A vote has already been cast with this PVC.');
        addFraudAlert(`Rejected repeat access attempt for PVC: ${pvcId}`);
        addVerificationLog(pvcId, "PVC_AUTH", "FAIL", "Duplicate voter identification");
        setLoading(false);
        return;
      }

      setVoterData(voter);
      // Fixed for testing convenience: 123456
      const newOtp = "123456";
      setGeneratedOtp(newOtp);
      console.log(`[TEST MODE] OTP for ${voter.phone}: ${newOtp}`);
      
      addVerificationLog(pvcId, "PVC_AUTH", "SUCCESS", `Voter identified: ${voter.name}`);
      setStep('otp');
      setLoading(false);
    }, 1200);
  };

  // OTP Validation
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (otp === generatedOtp) {
        addVerificationLog(pvcId, "OTP_AUTH", "SUCCESS", "Correct code entered");
        setStep('biometric');
      } else {
        setError('Incorrect OTP. Access denied.');
        addVerificationLog(pvcId, "OTP_AUTH", "FAIL", "Biometric data mismatch potential");
      }
      setLoading(false);
    }, 800);
  };

  // Biometric Scan Simulation
  const handleBiometricScan = () => {
    setBiometricStatus('scanning');
    setError('');

    setTimeout(() => {
      // 95% success rate for simulation realism
      const success = Math.random() > 0.05;
      if (success) {
        setBiometricStatus('success');
        addVerificationLog(pvcId, "BIOMETRIC", "SUCCESS", "Hash match 1024-bits");
        setTimeout(() => setStep('complete'), 1500);
      } else {
        setBiometricStatus('fail');
        setError('Biometric data mismatch. Please ensure you are the registered voter.');
        addVerificationLog(pvcId, "BIOMETRIC", "FAIL", "Face/Fingerprint mismatch detected");
      }
    }, 2500);
  };

  const finalizeVerification = () => {
    setCurrentVoterId(pvcId);
    setUser(voterData);
    onAuthComplete();
  };

  const steps = [
    { id: 'pvc', label: 'PVC Check', icon: ShieldCheck },
    { id: 'otp', label: 'SMS Verify', icon: Smartphone },
    { id: 'biometric', label: 'Biometrics', icon: ScanFace },
    { id: 'complete', label: 'Complete', icon: CheckCircle2 }
  ];

  return (
    <div className="voter-auth-page min-h-screen py-32 bg-slate-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)]" />
      
      <div className="container max-w-lg relative z-10 px-6">
        {/* Progress Tracker */}
        <div className="flex justify-between mb-12 relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 pointer-events-none" />
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = steps.findIndex(st => st.id === step) > idx;
            
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isActive ? 'bg-emerald-500 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 
                  isDone ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-900 border border-slate-800 text-slate-600'
                }`}>
                  <Icon size={18} />
                </div>
                <span className={`text-[10px] uppercase tracking-tighter mt-2 font-bold ${isActive ? 'text-emerald-500' : 'text-slate-500'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === 'pvc' && (
            <motion.div key="pvc" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}>
              <Card className="text-center p-8">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl font-black mb-2">Voter <span className="gradient-text">Identity</span></h2>
                <p className="text-slate-400 text-sm mb-8">Enter your 16-digit Permanent Voter's Card ID to begin.</p>
                
                <form onSubmit={handlePvcSubmit} className="space-y-4">
                  <Input 
                    placeholder="NVN-XXXX-XXXX-XXXX" 
                    value={pvcId}
                    onChange={(e) => setPvcId(e.target.value)}
                    required
                    className="text-center text-lg tracking-widest font-mono"
                  />
                  {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs flex items-center gap-2">
                    <AlertCircle size={14} /> {error}
                  </div>}
                  <Button type="submit" className="w-full btn-lg" disabled={loading}>
                    {loading ? 'Verifying...' : 'Next Step'} <ArrowRight size={18} />
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
                  <Smartphone size={32} />
                </div>
                <h2 className="text-2xl font-black mb-2">Security <span className="gradient-text">Verification</span></h2>
                <p className="text-slate-400 text-sm mb-2">We've sent a 6-digit code to</p>
                <p className="font-bold text-emerald-400 mb-8">{voterData?.phone}</p>
                
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <Input 
                    placeholder="Enter Code" 
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="text-center text-2xl tracking-[0.5em] font-black"
                  />
                  {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs flex items-center gap-2">
                    <AlertCircle size={14} /> {error}
                  </div>}
                  <Button type="submit" className="w-full btn-lg" disabled={loading}>
                    {loading ? 'Validating...' : 'Verify OTP'}
                  </Button>
                  <button type="button" className="text-xs text-slate-500 hover:text-emerald-500 transition-colors flex items-center gap-2 mx-auto mt-4">
                    <RefreshCcw size={12} /> Resend OTP
                  </button>
                </form>
              </Card>
            </motion.div>
          )}

          {step === 'biometric' && (
            <motion.div key="bio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <Card className="p-8 overflow-hidden relative">
                <div className="scanner-line absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent z-20" />
                <div className="w-24 h-24 bg-slate-900 border-2 border-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 relative group overflow-hidden">
                  <ScanFace size={48} className={`transition-all duration-500 ${biometricStatus === 'scanning' ? 'text-emerald-400 scale-125' : 'text-slate-600'}`} />
                  {biometricStatus === 'scanning' && (
                    <div className="absolute inset-0 bg-emerald-500/20 animate-pulse" />
                  )}
                  {biometricStatus === 'success' && (
                    <div className="absolute inset-0 bg-emerald-500 flex items-center justify-center text-white scale-in">
                      <CheckCircle2 size={40} />
                    </div>
                  )}
                </div>
                
                <h2 className="text-2xl font-black mb-2">Biometric <span className="gradient-text">Scan</span></h2>
                <p className="text-slate-400 text-sm mb-8">Place your fingerprint or position your face for identification.</p>
                
                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs flex items-center gap-2 mb-6">
                  <AlertCircle size={14} /> {error}
                </div>}

                <Button 
                  onClick={handleBiometricScan} 
                  className={`w-full btn-lg ${biometricStatus === 'scanning' ? 'opacity-50 pointer-events-none' : ''}`}
                  disabled={biometricStatus === 'success'}
                >
                  {biometricStatus === 'scanning' ? 'Analyzing Data...' : 
                   biometricStatus === 'fail' ? 'Retry Scanner' : 'Initialize Scan'}
                </Button>

                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                  <Lock size={10} /> Data Encrypted via AES-256
                </div>
              </Card>
            </motion.div>
          )}

          {step === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="p-8 text-center border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black mb-2">Verified.</h2>
                <p className="text-slate-400 text-md mb-8">All security protocols cleared for <br/><span className="text-white font-bold">{voterData?.name}</span></p>
                
                <div className="bg-slate-900/50 rounded-2xl p-4 mb-8 text-left space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 uppercase">PVC Identity</span>
                    <span className="text-xs text-emerald-400 font-bold">MATCHED</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 uppercase">2FA (SMS OTP)</span>
                    <span className="text-xs text-emerald-400 font-bold">CONFIRMED</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 uppercase">Biometric Hash</span>
                    <span className="text-xs text-emerald-400 font-bold">VERIFIED</span>
                  </div>
                </div>

                <Button onClick={finalizeVerification} className="w-full btn-lg py-6 group">
                  Proceed to Voting Ballot <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx="true">{`
        .gradient-text {
          background: linear-gradient(135deg, #fff 0%, var(--color-primary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .scanner-line {
          animation: scan 3s linear infinite;
        }

        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }

        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
