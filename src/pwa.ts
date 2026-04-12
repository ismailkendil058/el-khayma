export function loadPWA() {
  if (!('serviceWorker' in navigator) || !('getManifest' in navigator)) return;

  const path = window.location.pathname;
  const isAdmin = path.startsWith('/admin');
  const manifestUrl = isAdmin ? '/manifest-admin.json' : '/manifest-worker.json';
  const swScope = isAdmin ? '/admin/' : '/';

  // Update document title for PWA name preview
  document.title = isAdmin ? 'admin' : 'worker';

  // Dynamically set manifest
  let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
  if (manifestLink) {
    manifestLink.href = manifestUrl;
  } else {
    manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = manifestUrl;
    document.head.appendChild(manifestLink);
  }

  // Register SW with scope
  if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
    navigator.serviceWorker.register('/sw.js', { scope: swScope })
      .then((reg) => {
        console.log(`PWA SW registered for ${isAdmin ? 'admin' : 'worker'}`, reg.scope);
      })
      .catch((err) => {
        console.error('PWA SW registration failed:', err);
      });
  }
}

