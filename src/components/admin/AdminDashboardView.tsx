import React from 'react';
import {
  Users,
  FileCheck2,
  FileEdit,
  Clock,
  Ban,
  ShieldAlert,
  FileX,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { AdminStats, AuditLogEntry, SafetyReport } from '../../types/admin';
import { AdminTab } from './AdminLayout';
import { Button } from '../ui/Button';

interface AdminDashboardViewProps {
  stats: AdminStats;
  recentAuditLogs: AuditLogEntry[];
  recentReports: SafetyReport[];
  onSelectTab: (tab: AdminTab) => void;
  onNavigatePublic: (path: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  stats,
  recentAuditLogs,
  recentReports,
  onSelectTab,
  onNavigatePublic,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Admin CMS Dashboard — System Healthy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Directory Overview & Control Center
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time management for profiles, photo moderation, compliance takedowns, and safety reports.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button
            variant="gradient"
            size="sm"
            onClick={() => onSelectTab('profile-new')}
          >
            + New Profile
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigatePublic('/')}
          >
            Live Site Preview
          </Button>
        </div>
      </div>

      {/* 8 Metric Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Published */}
        <div
          onClick={() => onSelectTab('profiles')}
          className="bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 p-4 sm:p-5 rounded-2xl shadow-lg transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <FileCheck2 className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.publishedCount}</div>
          <div className="text-xs text-zinc-400 font-medium mt-1">Published Profiles</div>
        </div>

        {/* Drafts */}
        <div
          onClick={() => onSelectTab('profiles')}
          className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 p-4 sm:p-5 rounded-2xl shadow-lg transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <FileEdit className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold bg-zinc-800 px-2 py-0.5 rounded">Draft</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.draftCount}</div>
          <div className="text-xs text-zinc-400 font-medium mt-1">Draft Profiles</div>
        </div>

        {/* Pending */}
        <div
          onClick={() => onSelectTab('profiles')}
          className="bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 p-4 sm:p-5 rounded-2xl shadow-lg transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold bg-amber-500/10 px-2 py-0.5 rounded">Review</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.pendingCount}</div>
          <div className="text-xs text-zinc-400 font-medium mt-1">Pending Verification</div>
        </div>

        {/* Suspended */}
        <div
          onClick={() => onSelectTab('profiles')}
          className="bg-zinc-900/90 border border-zinc-800 hover:border-rose-500/50 p-4 sm:p-5 rounded-2xl shadow-lg transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <Ban className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold bg-rose-500/10 px-2 py-0.5 rounded">Action</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.suspendedCount}</div>
          <div className="text-xs text-zinc-400 font-medium mt-1">Suspended Profiles</div>
        </div>

        {/* Safety Reports */}
        <div
          onClick={() => onSelectTab('reports')}
          className="bg-zinc-900/90 border border-zinc-800 hover:border-rose-500/50 p-4 sm:p-5 rounded-2xl shadow-lg transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <ShieldAlert className="w-5 h-5" />
            {stats.pendingReportsCount > 0 && (
              <span className="text-[10px] uppercase font-bold bg-rose-500 text-white px-2 py-0.5 rounded animate-pulse">
                Action Req.
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.pendingReportsCount}</div>
          <div className="text-xs text-zinc-400 font-medium mt-1">Pending Reports</div>
        </div>

        {/* Removal Requests */}
        <div
          onClick={() => onSelectTab('content-removal')}
          className="bg-zinc-900/90 border border-zinc-800 hover:border-cyan-500/50 p-4 sm:p-5 rounded-2xl shadow-lg transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <FileX className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold bg-cyan-500/10 px-2 py-0.5 rounded">DMCA</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.removalRequestsCount}</div>
          <div className="text-xs text-zinc-400 font-medium mt-1">Removal Requests</div>
        </div>

        {/* Locations */}
        <div
          onClick={() => onSelectTab('locations')}
          className="bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 p-4 sm:p-5 rounded-2xl shadow-lg transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold bg-amber-500/10 px-2 py-0.5 rounded">Hubs</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalLocationsCount}</div>
          <div className="text-xs text-zinc-400 font-medium mt-1">Metro Hub Cities</div>
        </div>

        {/* Total Directory Size */}
        <div
          onClick={() => onSelectTab('profiles')}
          className="bg-zinc-900/90 border border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-lg transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold bg-purple-500/10 px-2 py-0.5 rounded">Total</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalProfiles}</div>
          <div className="text-xs text-zinc-400 font-medium mt-1">Total System Profiles</div>
        </div>
      </div>

      {/* Two Column Section: Recent Reports & Moderation Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Safety Reports Queue */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h2 className="text-base font-bold text-white">Pending Safety Queue</h2>
            </div>
            <button
              onClick={() => onSelectTab('reports')}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
            >
              View All ({recentReports.length}) &rarr;
            </button>
          </div>

          {recentReports.length > 0 ? (
            <div className="space-y-2.5">
              {recentReports.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{r.profileName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 font-semibold border border-rose-500/20">
                        {r.reason.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px] line-clamp-1">{r.details}</p>
                    <span className="text-[10px] text-zinc-500">
                      Reported on {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectTab('reports')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium shrink-0 cursor-pointer"
                  >
                    Investigate
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500 text-xs">
              Zero pending safety reports. All clear!
            </div>
          )}
        </div>

        {/* 2. Recent Moderation Audit Logs */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white">Recent Audit Trail</h2>
            </div>
            <button
              onClick={() => onSelectTab('audit-logs')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              Full Log &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {recentAuditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs flex items-start justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block font-mono">
                    {log.action.replace(/_/g, ' ')}
                  </span>
                  <p className="text-zinc-300 text-[11px]">{log.details}</p>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.actor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
