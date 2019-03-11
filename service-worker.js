/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "30f08d48e30240ff2affc2e180623977"
  },
  {
    "url": "api/__draft.html",
    "revision": "c7eefbe00e7d840e4a1f8c54ec84c0e6"
  },
  {
    "url": "api/connection.html",
    "revision": "4ec63ca6cd5a6efa92d5223553bcc213"
  },
  {
    "url": "api/consts.html",
    "revision": "016bb7a528e707367ba2bec8780bbe5b"
  },
  {
    "url": "api/funcs.html",
    "revision": "46af9ba4ab36c9477b29b67b88fd49fa"
  },
  {
    "url": "api/index.html",
    "revision": "e674d422fa1ab31a817cab1b46644fbf"
  },
  {
    "url": "api/model.html",
    "revision": "bfc12f1c794ee67f17b9189e81db8b41"
  },
  {
    "url": "api/orango.html",
    "revision": "5ac2651ca30abcc0d85e6b9eba878a0d"
  },
  {
    "url": "api/return.html",
    "revision": "5f781c4ad63791fc0c3e6640cbd6b6d9"
  },
  {
    "url": "api/schema.html",
    "revision": "477d90e5d97a4eb9a2ebbf4b1990672a"
  },
  {
    "url": "api/tmp/orm.html",
    "revision": "5955d8fd9c6028ff1627af6fdeb9cf05"
  },
  {
    "url": "api/types.html",
    "revision": "88c6d6d7e69c6eaba79a6854ace2ce1e"
  },
  {
    "url": "assets/css/0.styles.c6f2c4ad.css",
    "revision": "b12e88dde51b66273c13dcdc3b952181"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.278ae628.js",
    "revision": "da2a1526be80f82e8b28f10ecf056e83"
  },
  {
    "url": "assets/js/11.799cf6c3.js",
    "revision": "f1639570436a1046dd75d22c80ca9334"
  },
  {
    "url": "assets/js/12.bdb0900e.js",
    "revision": "0ab8d545a814ddddcd9e75d703f7f6ba"
  },
  {
    "url": "assets/js/13.632cd73c.js",
    "revision": "a46a40247fe457ff4fa79b9d9fb422fb"
  },
  {
    "url": "assets/js/14.64c86a24.js",
    "revision": "34f21613631c6bc32d1eeae67f8a154b"
  },
  {
    "url": "assets/js/15.c36e301c.js",
    "revision": "a7ca18f97edde79b17080690e2edfccc"
  },
  {
    "url": "assets/js/16.8cd163e8.js",
    "revision": "88d63a51dddf1f4a110097669a83364d"
  },
  {
    "url": "assets/js/17.a9f6ad9c.js",
    "revision": "3e0165c9f4a96be5f2a9e257ffc66b2a"
  },
  {
    "url": "assets/js/18.e71928be.js",
    "revision": "e958ff341b3aa8dea5622f248d98f9bc"
  },
  {
    "url": "assets/js/19.c86cfc07.js",
    "revision": "2026d9313416c16a81e493c6387aa4ef"
  },
  {
    "url": "assets/js/2.234811cb.js",
    "revision": "5d2aac1927fa4fc49f00c1a4a19837c7"
  },
  {
    "url": "assets/js/20.bb465aec.js",
    "revision": "70c6f2674e0c582a11e271be935583b8"
  },
  {
    "url": "assets/js/21.19999406.js",
    "revision": "e0914769d2903874ad9d41ad6835c9eb"
  },
  {
    "url": "assets/js/22.c9e27b35.js",
    "revision": "b2feba19b9d1bfa38ea99228c7da381b"
  },
  {
    "url": "assets/js/23.524ed88b.js",
    "revision": "df3b31ca36782ed33afce0962f4d4a3f"
  },
  {
    "url": "assets/js/24.c3ee01c0.js",
    "revision": "0aba1d181884ad26405566b6dbe4b464"
  },
  {
    "url": "assets/js/25.0bb3c8cc.js",
    "revision": "61731adac5e6a5144737641880780698"
  },
  {
    "url": "assets/js/3.b0961c5f.js",
    "revision": "9248c34785f7776e6a917a4668ccecce"
  },
  {
    "url": "assets/js/4.b7431d6a.js",
    "revision": "24bc18fe5a94b3c5a56a83f003f92d6d"
  },
  {
    "url": "assets/js/5.5d620026.js",
    "revision": "1eb4025fc9e5012e4505291a8001eb63"
  },
  {
    "url": "assets/js/6.e99efd1f.js",
    "revision": "5c320f4ee757c69a1f34f0dce7335d9e"
  },
  {
    "url": "assets/js/7.cabad610.js",
    "revision": "2ecee5cc21024c618648be819cfedf41"
  },
  {
    "url": "assets/js/8.8dd83b6a.js",
    "revision": "bc25a9f9257a2aa6fb95734887e8e05a"
  },
  {
    "url": "assets/js/9.e54f44c5.js",
    "revision": "05a77d5431753543703a2c0e5a340f32"
  },
  {
    "url": "assets/js/app.638713ad.js",
    "revision": "f5e53b8185428106260381ea92653f43"
  },
  {
    "url": "config/index.html",
    "revision": "e18a1e8fa23314902958fc636005ee05"
  },
  {
    "url": "config/introduction.html",
    "revision": "b544e3a9bc430c20eb5cc3230f209ab0"
  },
  {
    "url": "config/one.html",
    "revision": "3a03a3d005a7737a4d60855d82ae7692"
  },
  {
    "url": "config/two.html",
    "revision": "3badc8499f5aef1520db4a4aa77315e5"
  },
  {
    "url": "discord.svg",
    "revision": "08dc6c15861b84ebc1cb9732be3c657d"
  },
  {
    "url": "guide/best-practices.html",
    "revision": "0633791b5967b9b0e7cc74c664d07c3e"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "51131a045c17d352d2eea7a41e98b350"
  },
  {
    "url": "guide/index.html",
    "revision": "efca417c207cd0d7e5a26facdeab53cb"
  },
  {
    "url": "guide/installation.html",
    "revision": "3580c23be82d60e9ecb6b6388bd5835f"
  },
  {
    "url": "guide/working-with-models.html",
    "revision": "25b633747d94c077e32959991c6bfdaf"
  },
  {
    "url": "hero.png",
    "revision": "107ef02b968ecd65cfbdde52df2fe514"
  },
  {
    "url": "hero2.png",
    "revision": "752362887128d117b397b5b5038f10b8"
  },
  {
    "url": "icons/android-chrome-192x192.png",
    "revision": "8527c69777bd5db43ed8ff069debe8df"
  },
  {
    "url": "icons/android-chrome-256x256.png",
    "revision": "9c39d4637ab993a13ed10b5cba7e625b"
  },
  {
    "url": "icons/apple-touch-icon.png",
    "revision": "fdacf2476bc0557e3e61d6133eb1e190"
  },
  {
    "url": "icons/favicon-16x16.png",
    "revision": "bdfac584d56f5d16658be493831b5c7b"
  },
  {
    "url": "icons/favicon-32x32.png",
    "revision": "e2a1cb3a590e2ae65029b5daa3104ec4"
  },
  {
    "url": "icons/mstile-150x150.png",
    "revision": "e440086e20581d4a13a23d62e198a28d"
  },
  {
    "url": "icons/safari-pinned-tab.svg",
    "revision": "142d4099cba274eaf7a9b546cd93d178"
  },
  {
    "url": "index.html",
    "revision": "5b1dbed7089ea5dacb8ddb8ebbda3311"
  },
  {
    "url": "logo.png",
    "revision": "6dd9de51405c632bba8f5b392576c7d0"
  },
  {
    "url": "orango_logo.png",
    "revision": "107ef02b968ecd65cfbdde52df2fe514"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
