if (!self.define) {
  let e,
    s = {};
  const c = (c, n) => (
    (c = new URL(c + ".js", n).href),
    s[c] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = c), (e.onload = s), document.head.appendChild(e));
        } else ((e = c), importScripts(c), s());
      }).then(() => {
        let e = s[c];
        if (!e) throw new Error(`Module ${c} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, a) => {
    const t =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[t]) return;
    let i = {};
    const f = (e) => c(e, t),
      d = { module: { uri: t }, exports: i, require: f };
    s[t] = Promise.all(n.map((e) => d[e] || f(e))).then((e) => (a(...e), i));
  };
}
define(["./workbox-4754cb34"], function (e) {
  "use strict";
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/App.png", revision: "71a8fc688f57ce280651cc1103d15ecb" },
        {
          url: "/_next/app-build-manifest.json",
          revision: "05508fbca28367ed9be5271cbc7fce7e",
        },
        {
          url: "/_next/static/G6u2cGfpO5fMFCdgVwb7p/_buildManifest.js",
          revision: "c155cce658e53418dec34664328b51ac",
        },
        {
          url: "/_next/static/G6u2cGfpO5fMFCdgVwb7p/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/117-e83faec0a8107373.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/182-04ecb9ee4891e773.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/214-5e986027ddb2db58.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/284-251fc0430ed06e3b.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/371-e17501589cd0f9f1.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/462-eaf5b8274f0b37b8.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/539-00fd75907926bb76.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/561-483d8c46580d88bd.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/648-d6316e8ab5004bb7.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/683-a04fbadfa00a1074.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/795-924309339dfb4cff.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/997-66c2c11c9cb4e5f1.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/app/(auth)/auth/page-2c126c17d595301d.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/app/layout-4a99983a36dc7493.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/app/note/%5Bid%5D/page-ed58f1759114a217.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/app/page-3794cbe7c92eead8.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/app/settings/page-edfb7ce44f9b3bc1.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-3bbaa52683d0900e.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/app/layout-f91af75535ddda79.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/app/page-d7dd7a89ebf8490a.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/fd9d1056-bdb40ea5dfcf9e9c.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/framework-f66176bb897dc684.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/main-app-8e541b5df633ed5b.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/main-f358030d1be55852.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/pages/_app-72b849fbd24ac258.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/pages/_error-7ba65e1336b92748.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-6a971fe337e440ce.js",
          revision: "G6u2cGfpO5fMFCdgVwb7p",
        },
        {
          url: "/_next/static/css/51f76208b2f05b18.css",
          revision: "51f76208b2f05b18",
        },
        {
          url: "/_next/static/media/19cfc7226ec3afaa-s.woff2",
          revision: "9dda5cfc9a46f256d0e131bb535e46f8",
        },
        {
          url: "/_next/static/media/21350d82a1f187e9-s.woff2",
          revision: "4e2553027f1d60eff32898367dd4d541",
        },
        {
          url: "/_next/static/media/8e9860b6e62d6359-s.woff2",
          revision: "01ba6c2a184b8cba08b0d57167664d75",
        },
        {
          url: "/_next/static/media/ba9851c3c22cd980-s.woff2",
          revision: "9e494903d6b0ffec1a1e14d34427d44d",
        },
        {
          url: "/_next/static/media/c5fe6dc8356a8c31-s.woff2",
          revision: "027a89e9ab733a145db70f09b8a18b42",
        },
        {
          url: "/_next/static/media/df0a9ae256c0569c-s.woff2",
          revision: "d54db44de5ccb18886ece2fda72bdfe0",
        },
        {
          url: "/_next/static/media/e4af272ccee01ff0-s.p.woff2",
          revision: "65850a373e258f1c897a2b3d75eb74de",
        },
        { url: "/appwrite.svg", revision: "af1cdb4c080632cfe0dfc24ddad02a42" },
        { url: "/manifest.json", revision: "8fefab184a6cb781364dcb55584dbe2c" },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: c,
              state: n,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    ));
});
