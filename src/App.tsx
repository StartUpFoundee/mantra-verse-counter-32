import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AudioCountPage from "./pages/AudioCountPage";
import ManualCountPage from "./pages/ManualCountPage";
import SpiritualIdPage from "./pages/SpiritualIdPage";
import IdentityGuidePage from "./pages/IdentityGuidePage";
import ActiveDaysPage from "./pages/ActiveDaysPage";
import NotFound from "./pages/NotFound";
import IdentitySystem from "./components/IdentitySystem";
import { initializeDatabase } from "./utils/indexedDBUtils";
import { useBulletproofAuth } from "./hooks/useBulletproofAuth";

const queryClient = new QueryClient();

const AuthenticatedApp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser, isLoading, logout } = useBulletproofAuth();

  // Add browser close detection for automatic logout
  useEffect(() => {
    const handleBeforeUnload = async () => {
      console.log('Browser closing, logging out user...');
      try {
        await logout();
      } catch (error) {
        console.error('Error during browser close logout:', error);
      }
    };

    // Handle page unload (browser close, tab close, refresh)
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Handle page visibility change (browser minimized, tab switched)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page hidden, user may be closing browser');
      } else {
        console.log('Page visible again');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [logout]);

  useEffect(() => {
    // Only redirect if we're on the root path and authenticated
    if (isAuthenticated && currentUser && location.pathname === '/') {
      console.log('User authenticated, redirecting to home');
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate, location.pathname]);

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800">
        <div className="mb-6 text-amber-600 dark:text-amber-400 text-xl font-medium">
          Checking authentication...
        </div>
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-200 dark:border-amber-800 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Show identity system if not authenticated
  if (!isAuthenticated) {
    return <IdentitySystem onAuthSuccess={() => {
      console.log('Auth success, navigating to home');
      navigate('/home', { replace: true });
    }} />;
  }

  // Show app routes if authenticated
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/audio" element={<AudioCountPage />} />
      <Route path="/manual" element={<ManualCountPage />} />
      <Route path="/spiritual-id" element={<SpiritualIdPage />} />
      <Route path="/identity-guide" element={<IdentityGuidePage />} />
      <Route path="/active-days" element={<ActiveDaysPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const AppContent: React.FC = () => {
  const { isLoading } = useBulletproofAuth();
  const [dbInitialized, setDbInitialized] = useState(false);

  // Initialize IndexedDB when the app starts
  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        setDbInitialized(true);
      } catch (error) {
        console.error("Database initialization failed:", error);
        setDbInitialized(true); // Continue anyway with localStorage fallback
      }
    };
    init();
  }, []);

  // Show loading screen while initializing database
  if (!dbInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800">
        <div className="mb-6 text-amber-600 dark:text-amber-400 text-xl font-medium">
          Initializing database...
        </div>
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-200 dark:border-amber-800 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return <AuthenticatedApp />;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
