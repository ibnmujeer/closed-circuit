// Service worker for offline play. The build fills in CACHE and FILES.
// Cache first: after the first visit, everything comes from the device.
const CACHE = 'awwfy-closed-circuits-mvronp1a';
const PREFIX = 'awwfy-closed-circuits-';
const FILES = ["./","./apple-touch-icon.png","./assets/A01-DWfLZxcD.png","./assets/A02-bulb-off-DpmPmDNe.png","./assets/A03-bulb-on-_7JTVQrb.png","./assets/A04-switch-open-CyJBrnok.png","./assets/A05-switch-closed-ChdWizDO.png","./assets/A06-post-Dh4m53Nv.png","./assets/A07-spool-DbH-WNld.png","./assets/A08-4k-BlAJ17d0.png","./assets/bunny-jump-LEaC80Nf.png","./assets/emblem-arm-bl-DLAWJ2xe.png","./assets/emblem-arm-br-krCHUBDy.png","./assets/emblem-arm-tl-Ca6DMpTX.png","./assets/emblem-arm-tr-CHjBr36Q.png","./assets/emblem-full-CsJ8-RcG.png","./assets/F01-play-WhYhtm_Q.png","./assets/F02-next--_E_f85B.png","./assets/F03-retry-DbAN3ZEn.png","./assets/F04-hint-9X9dKx1s.png","./assets/F05-undo-DJelX_sP.png","./assets/F06-pause-BqTxUt46.png","./assets/F07-menu-KcwzfFOr.png","./assets/F08-sound-on-oQHomjU7.png","./assets/F09-sound-off-C19nAHZ6.png","./assets/F10-help-9Sui-VUU.png","./assets/F11-exit-BrhP4l2_.png","./assets/fredoka-latin-400-normal-17JuUzdy.woff2","./assets/fredoka-latin-400-normal-DbXSrOeS.woff","./assets/fredoka-latin-500-normal-B0JifZgm.woff2","./assets/fredoka-latin-500-normal-BL692wg7.woff","./assets/fredoka-latin-600-normal-C4zohCW5.woff2","./assets/fredoka-latin-600-normal-CcrEjrB4.woff","./assets/fredoka-latin-700-normal-BOIZVyIN.woff2","./assets/fredoka-latin-700-normal-C8FeHd3X.woff","./assets/index-Cd2y06po.css","./assets/index-socY-CRP.js","./assets/wordmark-white-bA4KL13H.png","./favicon-32.png","./icon-192.png","./icon-512.png","./index.html","./manifest.webmanifest"];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(FILES))
      .then(() => self.skipWaiting()),
  );
});

// A new version removes the old caches of this game.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    // ignoreVary: a server may send "Vary: Origin", which would make module scripts miss the cache.
    caches.match(request, { ignoreVary: true }).then((saved) => {
      if (saved) return saved;
      return fetch(request).catch(() => {
        // Offline and not saved: pages fall back to the game, other files fail honestly.
        if (request.mode === 'navigate') return caches.match('./index.html', { ignoreVary: true });
        return Response.error();
      });
    }),
  );
});
