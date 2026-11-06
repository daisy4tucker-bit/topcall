import React from 'react';
import { UserX, ArrowLeft, Search, Compass } from 'lucide-react';
import { Button } from '../ui/Button';

interface MissingProfileViewProps {
  slug: string;
  onNavigateHome: () => void;
  onExploreCities: () => void;
}

export const MissingProfileView: React.FC<MissingProfileViewProps> = ({
  slug,
  onNavigateHome,
  onExploreCities,
}) => {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
          <UserX className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-wider text-rose-400">
            404 Profile Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Profile Unavailable
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            The profile at <code className="text-rose-300 font-mono">/profiles/{slug}</code> does not exist, has been paused by the creator, or was removed for compliance.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="gradient"
            size="md"
            onClick={onNavigateHome}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Return to Directory Home
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={onExploreCities}
            leftIcon={<Compass className="w-4 h-4 text-amber-400" />}
          >
            Browse Metro Hubs
          </Button>
        </div>
      </div>
    </div>
  );
};
