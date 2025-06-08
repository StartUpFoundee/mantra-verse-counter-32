
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
import TimeTrackingPage from "./pages/TimeTrackingPage";
import { initializeDatabase } from "./utils/indexedDBUtils";
import { startTimeTracking } from "./utils/timeTrackingUtils";
import { useBulletproofAuth } from "./hooks/useBulletproofAuth";
import { Loader } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    },
  },
});

const LoadingScreen: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800">
      <div className="mb-6 text-amber-600 dark:text-amber-400 text-xl font-medium">
        {message}
      </div>
      <div className="relative">
        <Loader className="w-16 h-16 text-amber-500 animate-spin" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser, isLoading } = useBulletproofAuth();
  const [hasInitializedAuth, setHasInitializedAuth] = useState(false);

  useEffect(() => {
    // Only clear session data on complete logout, not on page navigation
    if (!isAuthenticated && !isLoading && hasInitializedAuth) {
      const isCompleteLogout = !sessionStorage.getItem('current_authenticated_account');
      if (isCompleteLogout && location.pathname !== '/') {
        sessionStorage.removeItem('currentBrowserSession');
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, hasInitializedAuth, location.pathname, navigate]);

  useEffect(() => {
    // Mark that auth has been initialized
    if (!isLoading) {
      setHasInitializedAuth(true);
    }
  }, [isLoading]);

  useEffect(() => {
    // Handle post-login redirect with minimal delay
    if (isAuthenticated && currentUser && location.pathname === '/' && hasInitializedAuth) {
      console.log('User authenticated, redirecting to home');
      // Immediate redirect without loading animation
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate, location.pathname, hasInitializedAuth]);

  // Show loading only on initial authentication check
  if (isLoading && !hasInitializedAuth) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // Show identity system if not authenticated
  if (!isAuthenticated && hasInitializedAuth) {
    return <IdentitySystem onAuthSuccess={() => {
      console.log('Auth success, redirecting immediately');
      // No loading state, just direct navigation
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
      <Route path="/time-tracking" element={<TimeTrackingPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const AppContent: React.FC = () => {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbInitStarted, setDbInitStarted] = useState(false);

  // Initialize IndexedDB when the app starts
  useEffect(() => {
    if (!dbInitStarted) {
      setDbInitStarted(true);
      const init = async () => {
        try {
          // Check if DB is already initialized
          const dbExists = await new Promise((resolve) => {
            const request = indexedDB.open('mantraVerseDB');
            request.onsuccess = () => {
              request.result.close();
              resolve(true);
            };
            request.onerror = () => resolve(false);
          });

          if (!dbExists) {
            await initializeDatabase();
          }
          
          // Start time tracking
          startTimeTracking();
          
          setDbInitialized(true);
        } catch (error) {
          console.error("Database initialization failed:", error);
          setDbInitialized(true); // Continue anyway with localStorage fallback
        }
      };
      init();
    }
  }, [dbInitStarted]);

  // Show loading screen while initializing database
  if (!dbInitialized) {
    return <LoadingScreen message="Initializing database..." />;
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
