const CACHE='spendsnap-shell-v12';
const ASSETS=['./manifest.webmanifest','./apple-touch-icon.png','./icon-512.png'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{}))
  );
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>
      Promise.all(
        keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch',event=>{
  const req=event.request;

  if(req.mode==='navigate'){
    event.respondWith(
      fetch(req).catch(()=>caches.match('./'))
    );
    return;
  }

  event.respondWith(
    fetch(req).catch(()=>caches.match(req))
  );
});
