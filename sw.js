/* Plano EDAM: funciona sin conexión una vez abierto */
var CACHE='plano-edam-v9';
var ASSETS=['./','index.html','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png',
 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return Promise.all(ASSETS.map(function(u){return c.add(u).catch(function(){});}));}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(function(r){
    if(r&&r.ok&&(e.request.url.indexOf(self.location.origin)===0||e.request.url.indexOf('cdnjs.cloudflare.com')>-1)){var cp=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,cp);});}
    return r;
  }).catch(function(){return caches.match(e.request).then(function(m){return m||caches.match('index.html');});}));
});
