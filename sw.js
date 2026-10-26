
 // AllNewcastle 2026 – push service worker.
 // Påvirker ikke eksisterende nettside eller chat.

 self.addEventListener('push', event => {
   let data = {};
   try {
     data = event.data ? event.data.json() : {};
   } catch {
     data = { body: event.data?.text() || '' };
   }

   const title = typeof data.title === 'string'
     ? data.title.slice(0, 120)
     : 'AllNewcastle – ny melding';

   const body = typeof data.body === 'string'
     ? data.body.slice(0, 250)
     : 'Det er en ny melding i chatten.';

   event.waitUntil(self.registration.showNotification(title, {
     body,
     icon: './icon-newcastle-2026.png?v=3',
     badge: './icon-newcastle-2026.png?v=3',
     tag: typeof data.tag === 'string' ? data.tag : undefined,
     data: {
       url: new URL('./#chat', self.registration.scope).href
     }
   }));
 });

 self.addEventListener('notificationclick', event => {
   event.notification.close();

   const target = event.notification.data?.url
     || new URL('./#chat', self.registration.scope).href;

   event.waitUntil((async () => {
     const windows = await clients.matchAll({
       type: 'window',
       includeUncontrolled: true
     });

     for (const client of windows) {
       if (new URL(client.url).origin === new URL(target).origin) {
         await client.navigate(target);
         return client.focus();
       }
     }

     return clients.openWindow(target);
   })());
 });
