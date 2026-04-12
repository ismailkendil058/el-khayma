export function loadPWA() {
  if ('serviceWorker' in navigator && 'getManifest' in navigator) {
    const path = window.location.pathname;
    const isAdmin = path.startsWith('/admin');
    const manifestUrl = isAdmin ? '/manifest-admin.json' : '/manifest-worker.json';

    // Dynamically add manifest link
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }
    manifestLink.href = manifestUrl;

    // Update title
    document.title = isAdmin ? 'admin - EL KHAYMA' : 'EL KHAYMA';

    // Register SW
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') return;
    navigator.serviceWorker.register('/sw.js', { scope: isAdmin ? '/admin/' : '/' })
      .then((reg) => console.log('SW registered', reg))
      .catch((err) => console.log('SW registration failed', err));
  }
}

