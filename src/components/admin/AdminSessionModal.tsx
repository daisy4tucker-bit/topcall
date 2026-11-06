import React from 'react';
import { ShieldCheck, User, Clock, Key, LogOut, X, Lock, CheckCircle2 } from 'lucide-react';
import { getCurrentSession, logoutCurrentSession } from '../../services/authService';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface AdminSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoggedOut: () => void;
}

export const AdminSessionModal: React.FC<AdminSessionModalProps> = ({
  isOpen,
  onClose,
  onLoggedOut,
}) => {
  if (!isOpen) return null;

  const session = getCurrentSession();
  const expiresDate = session.expiresAt ? new Date(session.expiresAt) : new Date(Date.now() + 8 * 3600000);

  const handleLogout = async () => {
    await logoutCurrentSession();
    onLoggedOut();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-zinc-100 relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
          <Lock className="w-4 h-4" /> Active Authentication Session
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {session.user?.displayName ? session.user.displayName[0] : 'A'}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {session.user?.displayName || 'Administrator Officer'}
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              {session.user?.email || 'admin@aura-directory.com'}
            </span>
          </div>
        </div>

        {/* Session Attributes */}
        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Assigned Role:</span>
            <Badge variant="danger" size="sm">
              {session.role.toUpperCase()}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Session Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active & Verified
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Access Token:</span>
            <span className="font-mono text-zinc-500 text-[10px]">
              {session.accessToken ? `${session.accessToken.substring(0, 16)}...` : 'Bearer-JWT-Signed'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Expires:</span>
            <span className="text-zinc-300 font-medium">
              {expiresDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="danger"
            size="sm"
            className="flex-1"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Log Out & Destroy Session
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
};
