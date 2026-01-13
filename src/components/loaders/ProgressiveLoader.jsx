import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Progressive Loader for Route Transitions
 * Shows a top progress bar when navigating between routes
 */
const ProgressiveLoader = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start loading animation on route change
    setIsVisible(true);
    setProgress(10);

    // Simulate progressive loading with multiple steps
    const timer1 = setTimeout(() => setProgress(30), 100);
    const timer2 = setTimeout(() => setProgress(50), 200);
    const timer3 = setTimeout(() => setProgress(70), 300);
    const timer4 = setTimeout(() => setProgress(90), 400);
    
    // Complete the progress bar
    const completeTimer = setTimeout(() => {
      setProgress(100);
      
      // Hide after completion animation
      setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 300);
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(completeTimer);
    };
  }, [location.pathname, location.search]); // Trigger on any location change

  if (!isVisible) return null;

  return (
    <>
      {/* Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 z-[99999]"
        style={{ 
          height: '3px',
          backgroundColor: 'rgba(229, 231, 235, 0.3)'
        }}
      >
        <div
          className="h-full transition-all duration-200 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.8), 0 0 20px rgba(168, 85, 247, 0.4)',
          }}
        >
          {/* Shimmer effect */}
          <div 
            className="absolute right-0 top-0 h-full w-32 opacity-40"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        </div>
      </div>

      {/* Add shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
};

export default ProgressiveLoader;
