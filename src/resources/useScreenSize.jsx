import { useState, useEffect } from 'react';

const useScreenSize = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1023);
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // Initial check on mount
    handleResize();

    // Add event listener to track screen size changes
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isSmallScreen, isLargeScreen };
};

export default useScreenSize;