import React, { useState, useEffect } from 'react';
import { LayoutDashboard, MessageSquareText, UserCircle, Menu, Key, LogOut } from 'lucide-react';
import { AppView, UserProfile, DashboardData } from './types';
import { Dashboard } from './components/Dashboard';
import { Simulation } from './components/Simulation';
import { ProfileModal } from './components/ProfileModal';
import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding';
import { geminiService } from './services/geminiService';

const DEFAULT_PROFILE: UserProfile = {
  name: "Guest",
  city: "New Delhi",
  sensitivity: "moderate",
  commuteMode: "public_transport",
  healthConditions: ["Dust Allergy"]
};

export default function App() {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiKeyReady, setApiKeyReady] = useState(false);

  // Initialize app state based on localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('aqi_user_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setView(AppView.DASHBOARD);
    } else {
      setView(AppView.LOGIN);
    }
    
    // Check API key immediately
    checkApiKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('aqi_user_profile', JSON.stringify(profile));
    }
  }, [profile]);

  const checkApiKey = async () => {
    if (process.env.API_KEY) {
      setApiKeyReady(true);
      return;
    }
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (hasKey) setApiKeyReady(true);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setApiKeyReady(true);
      if (profile && view === AppView.DASHBOARD) fetchDashboardData();
    }
  };

  const fetchDashboardData = async () => {
    if (loading || !profile) return;
    setLoading(true);
    try {
      const data = await geminiService.getDashboardData(profile);
      setDashboardData(data);
    } catch (e) {
      console.error("Failed to fetch dashboard", e);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when entering dashboard or API key becomes ready
  useEffect(() => {
    if (view === AppView.DASHBOARD && apiKeyReady && profile && !dashboardData) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, apiKeyReady, profile?.city]); // Added profile.city dependency to refetch on change

  const handleLogin = () => {
    // Check if we have a stored profile, otherwise go to onboarding
    const saved = localStorage.getItem('aqi_user_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
      setView(AppView.DASHBOARD);
    } else {
      setView(AppView.ONBOARDING);
    }
  };

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setView(AppView.DASHBOARD);
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setShowProfileModal(false);
    // Force refresh if city changed
    if (newProfile.city !== profile?.city) {
      setDashboardData(null); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aqi_user_profile');
    setProfile(null);
    setDashboardData(null);
    setView(AppView.LOGIN);
  };

  // Determine dynamic background class based on AQI
  const getThemeBackground = (aqi: number | undefined): string => {
    // If not in Dashboard/Simulation, use white/neutral
    if (view === AppView.LOGIN || view === AppView.ONBOARDING) return 'bg-white';

    if (aqi === undefined) return 'bg-slate-50'; 
    if (aqi <= 50) return 'bg-emerald-50';
    if (aqi <= 100) return 'bg-yellow-50';
    if (aqi <= 150) return 'bg-orange-50';
    if (aqi <= 200) return 'bg-red-50';
    if (aqi <= 300) return 'bg-purple-50';
    return 'bg-rose-100'; 
  };

  const bgClass = getThemeBackground(dashboardData?.current?.aqi);

  // Render logic for full screen views
  if (view === AppView.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  if (view === AppView.ONBOARDING) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className={`min-h-screen ${bgClass} text-slate-900 font-sans transition-colors duration-1000 ease-in-out`}>
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                AQ
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                Personal Tracker
              </span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => setView(AppView.DASHBOARD)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${view === AppView.DASHBOARD ? 'text-blue-600 bg-blue-50 rounded-lg' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <LayoutDashboard size={18} /> Dashboard
              </button>
              <button 
                onClick={() => setView(AppView.SIMULATION)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${view === AppView.SIMULATION ? 'text-blue-600 bg-blue-50 rounded-lg' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <MessageSquareText size={18} /> Simulation Agent
              </button>
            </div>

            <div className="flex items-center gap-4">
               {!apiKeyReady && !process.env.API_KEY && (
                  <button 
                    onClick={handleSelectKey}
                    className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200"
                  >
                    <Key size={16} /> API Key
                  </button>
               )}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                  title="Profile Settings"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                    {profile?.name?.charAt(0) || 'U'}
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 px-6 py-3 flex justify-between items-center">
         <button 
            onClick={() => setView(AppView.DASHBOARD)}
            className={`flex flex-col items-center gap-1 ${view === AppView.DASHBOARD ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <LayoutDashboard size={24} />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => setView(AppView.SIMULATION)}
            className={`flex flex-col items-center gap-1 ${view === AppView.SIMULATION ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <MessageSquareText size={24} />
            <span className="text-xs">Agent</span>
          </button>
           <button 
            onClick={() => setShowProfileModal(true)}
            className={`flex flex-col items-center gap-1 text-gray-400`}
          >
            <UserCircle size={24} />
            <span className="text-xs">Profile</span>
          </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 md:mb-0">
        {!apiKeyReady && !process.env.API_KEY ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800">API Connection Required</h2>
            <p className="text-gray-600 max-w-md">
              To provide personalized air quality insights and climate simulations, this app requires access to the Gemini API.
            </p>
            <button 
              onClick={handleSelectKey}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              Connect API Key
            </button>
             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">
              Information about billing
            </a>
          </div>
        ) : (
          <>
            {view === AppView.DASHBOARD && profile && (
              <Dashboard 
                data={dashboardData} 
                loading={loading} 
                profile={profile} 
                onRefresh={fetchDashboardData}
              />
            )}
            {view === AppView.SIMULATION && profile && (
              <Simulation profile={profile} />
            )}
          </>
        )}
      </main>

      {showProfileModal && profile && (
        <ProfileModal 
          profile={profile} 
          onSave={handleSaveProfile} 
          onClose={() => setShowProfileModal(false)} 
        />
      )}
    </div>
  );
}