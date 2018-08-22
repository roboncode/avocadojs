module.exports = {
  title: 'Orango',
  description: 'ArangoDB Object Modeler for Node.js, Foxx and Web Browsers',
  head: [
    ['link', { rel: 'icon', href: `/icons/favicon.ico` }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#fd6602' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: '#fd6602' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon.png` }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/mstile-150x150.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#fd6602' }]
  ],
  serviceWorker: true,
  themeConfig: {
    sidebar: [
      '/Guide',
      '/Page-1',
      ['/Page-2', 'Explicit link text']
    ]
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@img': 'img'
      }
    }
  }
}
