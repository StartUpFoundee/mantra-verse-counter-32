
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
import { Loader } from "lucide-react";

const queryClient = new QueryClient();

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
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Clear any existing sessionStorage on app start to force fresh login
    if (!isAuthenticated && location.pathname !== '/') {
      sessionStorage.clear();
      navigate('/', { replace: true });
    }
  }, []);

  useEffect(() => {
    // Handle post-login transition with animation
    if (isAuthenticated && currentUser && location.pathname === '/') {
      setIsTransitioning(true);
      console.log('User authenticated, redirecting to home with transition');
      
      // Show loading animation for smoother transition
      setTimeout(() => {
        navigate('/home', { replace: true });
        setIsTransitioning(false);
      }, 1000); // 1 second transition
    }
  }, [isAuthenticated, currentUser, navigate, location.pathname]);

  // Show loading while authentication is being checked
  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // Show transition loading after login
  if (isTransitioning) {
    return <LoadingScreen message="Welcome back! Loading your spiritual journey..." />;
  }

  // Show identity system if not authenticated
  if (!isAuthenticated) {
    return <IdentitySystem onAuthSuccess={() => {
      console.log('Auth success, starting transition');
      setIsTransitioning(true);
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
