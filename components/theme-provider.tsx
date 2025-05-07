// components/ThemeProvider.tsx
'use client';

import { useEffect, useState } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage or system preference
    const darkMode = localStorage.getItem('theme') === 'dark' || 
                    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: light)').matches);
    setIsDark(darkMode);
    
    if (darkMode) {
      document.documentElement.classList.add('light');
      document.documentElement.style.colorScheme = 'light';
    }
  }, []);

  return <>{children}</>;
}