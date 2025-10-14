/**
 * ThemeScript Component
 * Prevents FOUC (Flash of Unstyled Content) by applying theme before React hydration
 * This script runs synchronously in <head> before any content renders
 */

export default function ThemeScript() {
  const themeScript = `
    (function() {
      function getTheme() {
        try {
          const stored = localStorage.getItem('theme');
          if (stored === 'light' || stored === 'dark') return stored;
          
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
          }
        } catch (e) {}
        return 'light';
      }
      
      const theme = getTheme();
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
