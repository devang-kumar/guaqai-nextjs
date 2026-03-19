'use client';

import React, { useState, Suspense, lazy, useEffect } from 'react';
import { LayoutDashboard, MessageSquare, Settings as SettingsIcon, Smartphone, Megaphone, User, X, Shield, BarChart2, Menu, ClipboardList, Users, Star, ChevronLeft, ChevronRight, LogOut, HelpCircle, ConciergeBell, Sparkles } from 'lucide-react';
import { UserRole, View, StaffMember, Ticket, Alert, ReviewConfig, DocumentFile, AffiliateContact, Review, BrandingConfig, SystemAccount } from '../types';

const Dashboard = lazy(() => import('./Dashboard'));
const LiveSimulator = lazy(() => import('./LiveSimulator'));
const Inbox = lazy(() => import('./Inbox'));
const Settings = lazy(() => import('./Settings'));
const Campaigns = lazy(() => import('./Campaigns'));
const Analytics = lazy(() => import('./Analytics'));
const Tickets = lazy(() => import('./Tickets'));
const Staff = lazy(() => import('./Staff'));
const Reviews = lazy(() => import('./Reviews'));
const Login = lazy(() => import('./Login'));
const Footer = lazy(() => import('./Footer'));
const Help = lazy(() => import('./Help'));

const initialStaffList: StaffMember[] = [
  { id: 'S-01', name: 'Rajesh Kumar', role: 'Front Desk', email: 'rajesh@hotel.com', phone: '9876543210', currentShift: 'Morning', isOnDuty: true, avatarBg: 'bg-blue-600' },
  { id: 'S-02', name: 'Priya Singh', role: 'Housekeeping', email: 'priya@hotel.com', phone: '9876543211', currentShift: 'Morning', isOnDuty: true, avatarBg: 'bg-emerald-600' },
  { id: 'S-03', name: 'John Doe', role: 'Maintenance', email: 'john@hotel.com', phone: '9876543212', currentShift: 'Evening', isOnDuty: false, avatarBg: 'bg-orange-600' },
  { id: 'S-04', name: 'Amit Patel', role: 'Chef', email: 'amit@hotel.com', phone: '9876543213', currentShift: 'Morning', isOnDuty: true, avatarBg: 'bg-rose-600' },
  { id: 'S-05', name: 'Sunita Sharma', role: 'Manager', email: 'sunita@hotel.com', phone: '9876543214', currentShift: 'Morning', isOnDuty: true, avatarBg: 'bg-purple-600' },
  { id: 'S-06', name: 'Vikram Singh', role: 'Security', email: 'vikram@hotel.com', phone: '9876543215', currentShift: 'Night', isOnDuty: false, avatarBg: 'bg-slate-600' },
  { id: 'S-07', name: 'Anita Roy', role: 'Front Desk', email: 'anita@hotel.com', phone: '9876543216', currentShift: 'Evening', isOnDuty: false, avatarBg: 'bg-indigo-600' },
  { id: 'S-08', name: 'Rahul Verma', role: 'Bell Boy', email: 'rahul@hotel.com', phone: '9876543217', currentShift: 'Evening', isOnDuty: true, avatarBg: 'bg-cyan-600' },
  { id: 'S-09', name: 'Suresh Raina', role: 'Valet', email: 'suresh@hotel.com', phone: '9876543218', currentShift: 'Night', isOnDuty: false, avatarBg: 'bg-teal-600' },
  { id: 'S-10', name: 'Meena Kumari', role: 'Housekeeping', email: 'meena@hotel.com', phone: '9876543219', currentShift: 'Evening', isOnDuty: true, avatarBg: 'bg-pink-600' },
  { id: 'S-11', name: 'Karan Johar', role: 'Maintenance', email: 'karan@hotel.com', phone: '9876543220', currentShift: 'Morning', isOnDuty: true, avatarBg: 'bg-yellow-600' },
  { id: 'S-12', name: 'Deepak Chopra', role: 'Chef', email: 'deepak@hotel.com', phone: '9876543221', currentShift: 'Evening', isOnDuty: true, avatarBg: 'bg-red-600' },
];

const initialTickets: Ticket[] = [
  { id: 'T-1024', roomId: '304', guestName: 'Mr. John Doe', category: 'Maintenance', description: 'AC unit leaking water on nightstand', status: 'New', priority: 'Critical', createdAt: new Date(Date.now() - 1000 * 60 * 15) },
  { id: 'T-1025', roomId: '505', guestName: 'Mike Ross', category: 'Housekeeping', description: 'Request for extra pillows and towels', status: 'New', priority: 'Medium', createdAt: new Date(Date.now() - 1000 * 60 * 45) },
  { id: 'T-1022', roomId: '102', guestName: 'Sarah J', category: 'F&B', description: 'Breakfast cold upon delivery', status: 'In Progress', priority: 'High', createdAt: new Date(Date.now() - 1000 * 60 * 120), assignedTo: 'S-01' },
  { id: 'T-1020', roomId: '201', guestName: 'Ms. Lee', category: 'Concierge', description: 'Cab booking for airport drop', status: 'Resolved', priority: 'Low', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), assignedTo: 'S-01' },
  { id: 'T-1030', roomId: '401', guestName: 'David Kim', category: 'Maintenance', description: 'Wifi signal weak in bedroom', status: 'In Progress', priority: 'Medium', createdAt: new Date(Date.now() - 1000 * 60 * 240), assignedTo: 'S-03' },
  { id: 'T-1031', roomId: 'Lobby', guestName: 'Staff Reported', category: 'Housekeeping', description: 'Spill near elevator B', status: 'Resolved', priority: 'High', createdAt: new Date(Date.now() - 1000 * 60 * 300), assignedTo: 'S-02' },
  { id: 'T-1032', roomId: 'Gym', guestName: 'Guest', category: 'Maintenance', description: 'Treadmill 2 screen flickering', status: 'New', priority: 'Low', createdAt: new Date(Date.now() - 1000 * 60 * 30) },
  { id: 'T-1033', roomId: 'Pool', guestName: 'Guest', category: 'Housekeeping', description: 'Towels depleted at pool station', status: 'New', priority: 'Medium', createdAt: new Date(Date.now() - 1000 * 60 * 10) },
  { id: 'T-1034', roomId: '105', guestName: 'Alice W', category: 'Front Desk', description: 'Late checkout request (2PM)', status: 'In Progress', priority: 'Low', createdAt: new Date(Date.now() - 1000 * 60 * 180), assignedTo: 'S-05' },
  { id: 'T-1035', roomId: 'Restaurant', guestName: 'Chef Amit', category: 'Maintenance', description: 'Freezer temperature warning', status: 'New', priority: 'Critical', createdAt: new Date(Date.now() - 1000 * 60 * 5) },
];

const initialAlerts: Alert[] = [
  { id: 101, userId: 1, type: 'critical', msg: 'Room 304: AC Leakage reported (Recurring)', time: '10m ago' },
  { id: 102, userId: 2, type: 'warning', msg: 'Room 102: Negative sentiment regarding breakfast', time: '25m ago' },
  { id: 103, userId: 3, type: 'info', msg: 'VIP Guest (Room 505) Check-in completed', time: '1h ago' },
  { id: 104, userId: 4, type: 'warning', msg: 'Low Inventory: Pool Towels', time: '2h ago' },
];

const initialReviews: Review[] = [
  { id: '1', guestName: 'Alice Morgan', rating: 5, date: '2024-10-26', platform: 'google', comment: 'Absolutely loved the rooftop pool! Great service by Rajesh.', status: 'Pending' },
  { id: '2', guestName: 'David Chen', rating: 3, date: '2024-10-25', platform: 'tripadvisor', comment: 'Room was clean but the WiFi was very spotty on the 5th floor.', status: 'Pending' },
  { id: '3', guestName: 'Priya K', rating: 5, date: '2024-10-24', platform: 'google', comment: 'Best stay in Manipal. Breakfast spread is huge.', response: 'Thank you Priya! We are glad you enjoyed the mosaic breakfast.', status: 'Replied' },
  { id: '4', guestName: 'James Wilson', rating: 4, date: '2024-10-23', platform: 'tripadvisor', comment: 'Good value for money. Location is perfect.', status: 'Pending' },
  { id: '5', guestName: 'Sarah Connor', rating: 2, date: '2024-10-22', platform: 'google', comment: 'No hot water in the morning. Disappointed.', status: 'Replied', response: 'Dear Sarah, we apologize for the inconvenience. The issue has been fixed.' },
  { id: '6', guestName: 'Michael Scott', rating: 5, date: '2024-10-21', platform: 'google', comment: 'The staff is incredibly friendly. Felt like home.', status: 'Pending' },
  { id: '7', guestName: 'Dwight Schrute', rating: 3, date: '2024-10-20', platform: 'tripadvisor', comment: 'Beets were missing from the salad bar.', status: 'Pending' },
  { id: '8', guestName: 'Jim Halpert', rating: 4, date: '2024-10-19', platform: 'google', comment: 'Nice place, but the gym could be bigger.', status: 'Pending' },
  { id: '9', guestName: 'Pam Beesly', rating: 5, date: '2024-10-18', platform: 'tripadvisor', comment: 'Art in the lobby is beautiful. Lovely ambiance.', status: 'Replied', response: 'Thank you Pam! We love our local art collection too.' },
  { id: '10', guestName: 'Ryan Howard', rating: 1, date: '2024-10-17', platform: 'google', comment: 'Service was too slow. I had to wait 20 mins for check-in.', status: 'Pending' },
];

const LOADING_PHRASES = [
  'Polishing the silverware...', 'Folding towels into swans...', 'Waking up the AI Concierge...',
  'Chilling the virtual champagne...', 'Evicting bugs from Room 404...', 'Syncing with the Mothership...',
];

const HospitalityLoader = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setPhraseIndex(p => (p + 1) % LOADING_PHRASES.length), 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 to-slate-950"></div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
          <ConciergeBell size={64} className="text-amber-400 animate-bounce relative z-10" strokeWidth={1.5} />
          <div className="absolute -top-2 -right-2 animate-ping">
            <Sparkles size={24} className="text-white opacity-50" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white tracking-widest uppercase mb-2">GuaqAI</h3>
        <p className="text-sm font-medium text-slate-500">{LOADING_PHRASES[phraseIndex]}</p>
        <div className="mt-8 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:150ms]"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:300ms]"></div>
        </div>
      </div>
    </div>
  );
};

const AppShell: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [targetChatId, setTargetChatId] = useState<number | null>(null);
  const [initialMessage, setInitialMessage] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaffList);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [systemAccounts, setSystemAccounts] = useState<SystemAccount[]>([
    { id: 'U-1', email: 'admin@hotel.com', role: 'admin', permissions: Object.values(View) },
    { id: 'U-2', email: 'frontdesk@hotel.com', role: 'staff', permissions: [View.DASHBOARD, View.INBOX, View.TICKETS] },
  ]);
  const [reviewConfig, setReviewConfig] = useState<ReviewConfig>({
    platform: 'google', minRating: 5,
    prefilledText: 'I had a wonderful stay at Country Inn! The staff was amazing.',
    autoReplyEnabled: true, signature: 'General Manager, Country Inn & Suites',
  });
  const [branding, setBranding] = useState<BrandingConfig>({
    hotelName: 'Country Inn & Suites by Radisson, Manipal',
    appName: 'GuaqAI', primaryColor: '#2563eb',
  });
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliateContact[]>([
    { id: '1', label: 'City Cabs', number: '+91 99988 77766', category: 'Transport' },
    { id: '2', label: 'KMC Hospital Ambulance', number: '+91 820 2922761', category: 'Medical' },
  ]);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const handleLogin = (role: 'admin' | 'staff') => { setUserRole(role); setIsAuthenticated(true); };
  const handleLogout = () => { setIsAuthenticated(false); setCurrentView(View.DASHBOARD); };
  const handleNavigateToChat = (userId: number, message = '') => {
    setTargetChatId(userId); setInitialMessage(message); setCurrentView(View.INBOX);
  };
  const handleNavigateToView = (view: View) => { setCurrentView(view); setIsMobileMenuOpen(false); };
  const handleTicketCreate = (t: Ticket) => setTickets(prev => [t, ...prev]);
  const handleCreateAlert = (a: Alert) => setAlerts(prev => [a, ...prev]);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard onNavigateToChat={handleNavigateToChat} onNavigateToView={handleNavigateToView} role={userRole} alerts={alerts} branding={branding} />;
      case View.SIMULATOR: return <LiveSimulator onTicketCreate={handleTicketCreate} onCreateAlert={handleCreateAlert} reviewConfig={reviewConfig} documents={documents} affiliates={affiliates} branding={branding} />;
      case View.INBOX: return <Inbox targetChatId={targetChatId} initialMessage={initialMessage} staffList={staffList} />;
      case View.CAMPAIGNS: return <Campaigns />;
      case View.SETTINGS: return <Settings role={userRole} config={reviewConfig} onUpdateConfig={setReviewConfig} documents={documents} onUpdateDocuments={setDocuments} affiliates={affiliates} onUpdateAffiliates={setAffiliates} branding={branding} onUpdateBranding={setBranding} accounts={systemAccounts} onUpdateAccounts={setSystemAccounts} />;
      case View.ANALYTICS: return <Analytics onNavigateToView={handleNavigateToView} />;
      case View.TICKETS: return <Tickets tickets={tickets} onTicketUpdate={setTickets} staffList={staffList} />;
      case View.STAFF: return <Staff staffList={staffList} onStaffUpdate={setStaffList} />;
      case View.REVIEWS: return <Reviews reviews={reviews} onUpdateReviews={setReviews} config={reviewConfig} />;
      case View.HELP: return <Help />;
      default: return <Dashboard onNavigateToChat={handleNavigateToChat} onNavigateToView={handleNavigateToView} role={userRole} alerts={alerts} branding={branding} />;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => handleNavigateToView(view)}
      className={`w-full flex items-center gap-3 py-3 rounded-xl transition-all duration-200 relative group outline-none ${
        currentView === view ? 'bg-blue-600/20 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
      } ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`}
      title={isSidebarCollapsed ? label : ''}
    >
      <Icon size={20} className="shrink-0" />
      {!isSidebarCollapsed && <span className="font-medium text-sm">{label}</span>}
      {isSidebarCollapsed && (
        <div className="absolute left-full ml-3 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-white/10">
          {label}
        </div>
      )}
    </button>
  );

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<HospitalityLoader />}>
        <Login onLogin={handleLogin} branding={branding} />
      </Suspense>
    );
  }

  const fixedViews = [View.INBOX, View.SIMULATOR, View.TICKETS];

  return (
    <div className="flex h-[100dvh] w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`flex-col glass-panel border-r border-white/5 z-50 transition-all duration-300 relative ${isMobileMenuOpen ? 'absolute inset-y-0 left-0 flex w-64' : 'hidden md:flex'} ${!isMobileMenuOpen && isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hidden md:flex absolute -right-3 top-10 bg-slate-800 border border-slate-600 rounded-full p-1 text-slate-400 hover:text-white transition z-50 shadow-lg">
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={`p-6 shrink-0 ${isSidebarCollapsed ? 'px-2 items-center' : ''}`}>
          <div className={`flex items-center gap-3 mb-8 ${isSidebarCollapsed ? 'justify-center flex-col gap-2' : ''}`}>
            <div className={`bg-blue-600 rounded-lg flex items-center justify-center shadow-lg overflow-hidden shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-10 h-10' : 'w-8 h-8'}`}>
              {branding.logoUrl ? <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <span className="text-white font-bold text-lg">{branding.appName.charAt(0)}</span>}
            </div>
            {!isSidebarCollapsed && <h1 className="text-white font-bold tracking-wide text-sm truncate">{branding.appName}</h1>}
          </div>

          <nav className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-hide">
            <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Overview" />
            <NavItem view={View.INBOX} icon={MessageSquare} label="Live Inbox" />
            <NavItem view={View.SIMULATOR} icon={Smartphone} label="Bot Simulator" />
            <NavItem view={View.TICKETS} icon={ClipboardList} label="Service Tickets" />
            {userRole === 'admin' && (
              <>
                <NavItem view={View.REVIEWS} icon={Star} label="Guest Reviews" />
                <NavItem view={View.STAFF} icon={Users} label="Staff Roster" />
                <NavItem view={View.CAMPAIGNS} icon={Megaphone} label="Campaigns" />
                <NavItem view={View.ANALYTICS} icon={BarChart2} label="Analytics" />
                <NavItem view={View.SETTINGS} icon={SettingsIcon} label="Settings" />
              </>
            )}
            <div className="h-px bg-white/5 my-2 mx-4"></div>
            <NavItem view={View.HELP} icon={HelpCircle} label="Help Center" />
          </nav>
        </div>

        <div className={`mt-auto p-6 border-t border-white/5 shrink-0 ${isSidebarCollapsed ? 'px-2' : ''}`}>
          <button onClick={() => setShowAuthModal(true)} className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition ${isSidebarCollapsed ? 'justify-center' : '-ml-2'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-white/10 shrink-0 ${userRole === 'admin' ? 'bg-slate-700' : 'bg-emerald-700'}`}>
              <span className="text-xs font-bold">{userRole === 'admin' ? 'RM' : 'FD'}</span>
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm text-white font-medium truncate">{userRole === 'admin' ? 'Radisson Mgr.' : 'Front Desk'}</p>
                <p className="text-xs text-slate-500 capitalize">{userRole} Access</p>
              </div>
            )}
          </button>
          <button onClick={handleLogout} className={`mt-2 flex items-center gap-3 w-full p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <LogOut size={18} />
            {!isSidebarCollapsed && <span className="text-xs font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative bg-slate-950">
        <header className="md:hidden shrink-0 h-16 bg-slate-900/90 backdrop-blur border-b border-white/5 flex items-center justify-between px-4 z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
              {branding.logoUrl ? <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <span className="text-white font-bold">{branding.appName.charAt(0)}</span>}
            </div>
            <span className="font-bold text-white text-sm">{branding.appName}</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-300">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className="flex-1 overflow-hidden relative flex flex-col">
          <Suspense fallback={<HospitalityLoader />}>
            <div className={`flex-1 relative flex flex-col ${fixedViews.includes(currentView) ? 'overflow-hidden' : 'overflow-y-auto'}`}>
              <div className={`flex-1 ${fixedViews.includes(currentView) ? 'h-full' : ''}`}>
                {renderView()}
              </div>
              {!fixedViews.includes(currentView) && <Footer />}
            </div>
          </Suspense>
        </div>
      </main>

      {showAuthModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Switch Role</h3>
              <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              {[
                { role: 'admin' as const, label: 'General Manager', sub: 'Full Admin Access', icon: Shield, color: 'blue', bg: 'bg-blue-500' },
                { role: 'staff' as const, label: 'Front Desk Staff', sub: 'Limited View', icon: User, color: 'emerald', bg: 'bg-emerald-500' },
              ].map(({ role, label, sub, icon: Icon, color, bg }) => (
                <button
                  key={role}
                  onClick={() => {
                    setUserRole(role);
                    setShowAuthModal(false);
                    if (role === 'staff' && [View.CAMPAIGNS, View.ANALYTICS, View.STAFF, View.SETTINGS].includes(currentView)) {
                      setCurrentView(View.DASHBOARD);
                    }
                  }}
                  className={`w-full p-4 rounded-xl border flex items-center gap-4 transition ${userRole === role ? `bg-${color}-600/20 border-${color}-500 text-${color}-100` : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                >
                  <div className={`p-2 ${bg} rounded-lg text-white`}><Icon size={20} /></div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs opacity-70">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppShell;
