import React, { useState } from 'react';
import { Lock, ArrowLeft, KeyRound, ShieldAlert } from 'lucide-react';
import { loginAdmin } from '../../services/authService';

interface AdminAuthGateProps {
  onSuccess: () => void;
  onExit: () => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ onSuccess, onExit }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#071322] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-950/40">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Restricted Access</h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          This portal is reserved for Aura Directory administrators and compliance moderators.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative text-left">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter admin password (e.g. admin123)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-medium">
              Invalid credentials. Default passcode is <code className="bg-slate-800 px-1 py-0.5 rounded">admin123</code>
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-900/40 transition-all"
          >
            Authenticate Admin Session
          </button>
        </form>

        <div className="pt-6 border-t border-slate-800 mt-6 flex justify-center">
          <button
            onClick={onExit}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Directory
          </button>
        </div>
      </div>
    </div>
  );
};
