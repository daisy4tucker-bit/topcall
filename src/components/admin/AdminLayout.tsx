import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Image,
  MapPin,
  ShieldAlert,
  FileX,
  Sliders,
  History,
  LogOut,
  ExternalLink,
  Sparkles,
  Menu,
  X,
  PlusCircle,
  Database,
  Lock,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { logoutCurrentSession, getCurrentSession } from '../../services/authService';
import { AdminSessionModal } from './AdminSessionModal';

export type AdminTab =
  | 'dashboard'
  | 'profiles'
  | 'profile-new'
  | 'photos'
  | 'locations'
  | 'reports'
  | 'content-removal'
  | 'moderation'
  | 'audit-logs'
  | 'rls-policies'
  | 'technical-audit';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onNavigatePublic: (path: string) => void;
  pendingReportsCount: number;
  removalRequestsCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigatePublic,
  pendingReportsCount,
  removalRequestsCount,
  children,
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const session = getCurrentSession();

  const handleLogout = async () => {
    await logoutCurrentSession();
    onNavigatePublic('/');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'profiles', label: 'Profile Management', icon: <Users className="w-4 h-4" /> },
    { id: 'photos', label: 'Photo Moderation', icon: <Image className="w-4 h-4" /> },
    { id: 'locations', label: 'Location CMS', icon: <MapPin className="w-4 h-4" /> },
    {
      id: 'reports',
      label: 'Safety Reports',
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
    },
    {
      id: 'content-removal',
      label: 'Content Removal (DMCA)',
      icon: <FileX className="w-4 h-4" />,
      badge: removalRequestsCount > 0 ? removalRequestsCount : undefined,
    },
    { id: 'moderation', label: 'Recent Moderation', icon: <Sliders className="w-4 h-4" /> },
    { id: 'audit-logs', label: 'Compliance Audit Logs', icon: <History className="w-4 h-4" /> },
    { id: 'rls-policies', label: 'Auth & RLS Policies', icon: <Lock className="w-4 h-4" /> },
    { id: 'technical-audit', label: 'Audit & Bug Checklist', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans antialiased">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-zinc-900 border-r border-zinc-800 flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-white block">AURA CMS</span>
                <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                  Admin Panel
                </span>
              </div>
            </div>
          </div>

          {/* Quick Create CTA */}
          <div className="p-4">
            <button
              onClick={() => onSelectTab('profile-new')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-bold shadow-md transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Profile</span>
            </button>
          </div>

          {/* Nav Items */}
          <nav aria-label="Admin navigation" className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id || (item.id === 'profiles' && currentTab === 'profile-new');
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-rose-400' : 'text-zinc-500'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Actions */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          {/* Active Session Info Button */}
          <button
            onClick={() => setShowSessionModal(true)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition cursor-pointer border border-zinc-800/80"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left truncate max-w-[140px]">
                <span className="font-bold text-white block text-[11px] truncate">
                  {session.user?.displayName || 'Admin Officer'}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono truncate block">
                  {session.user?.email || 'admin@aura-directory.com'}
                </span>
              </div>
            </div>
            <Lock className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          <button
            onClick={() => onNavigatePublic('/')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/40 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span>Live Public Directory</span>
            </div>
            <span className="text-[10px] text-rose-400">&rarr;</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/40 hover:bg-rose-950/30 hover:text-rose-400 text-zinc-400 text-xs font-medium transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Top Mobile Bar */}
      <header className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white">Aura Admin CMS</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded-xl bg-zinc-800 text-zinc-300"
          aria-label="Toggle admin menu"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileNavOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 space-y-2 shadow-2xl z-30">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id as AdminTab);
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                currentTab === item.id ? 'bg-rose-500/20 text-rose-300' : 'text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px]">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <div className="pt-2 border-t border-zinc-800 flex gap-2">
            <button
              onClick={() => onNavigatePublic('/')}
              className="flex-1 py-2 text-center rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300"
            >
              Live Site
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 text-center rounded-xl bg-rose-500/20 text-xs font-semibold text-rose-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">{children}</div>
      </main>

      {/* Admin Session Inspector Modal */}
      <AdminSessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onLoggedOut={() => onNavigatePublic('/')}
      />
    </div>
  );
};
