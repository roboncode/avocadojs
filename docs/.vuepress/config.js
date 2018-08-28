module.exports = {
  title: 'Orango',
  description: 'ArangoDB Object Modeler for Node.js, Foxx and Web Browsers',
  head: [
    ['link', {
      rel: 'icon',
      href: `/icons/favicon.ico`
    }],
    ['link', {
      rel: 'manifest',
      href: '/site.webmanifest'
    }],
    ['meta', {
      name: 'theme-color',
      content: '#fd6602'
    }],
    ['meta', {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    }],
    ['meta', {
      name: 'apple-mobile-web-app-status-bar-style',
      content: '#fd6602'
    }],
    ['link', {
      rel: 'apple-touch-icon',
      href: `/icons/apple-touch-icon.png`
    }],
    ['link', {
      rel: 'mask-icon',
      href: '/icons/safari-pinned-tab.svg',
      color: '#3eaf7c'
    }],
    ['meta', {
      name: 'msapplication-TileImage',
      content: '/icons/mstile-150x150.png'
    }],
    ['meta', {
      name: 'msapplication-TileColor',
      content: '#fd6602'
    }]
  ],
  serviceWorker: {
    updatePopup: true
  },
  themeConfig: {
    // nav: [{
    //     text: 'Guide',
    //     link: '/guide/',
    //   },
    //   {
    //     text: 'Config Reference',
    //     link: '/config/'
    //   },
    //   {
    //     text: 'Default Theme Config',
    //     link: '/default-theme-config/'
    //   },
    //   {
    //     text: 'Changelog',
    //     link: 'https://github.com/vuejs/vuepress/blob/master/CHANGELOG.md'
    //   }
    // ],
    // sidebar: {
    //   '/guide/': {
    //     title: 'Guide',
    //     collapse: false,
    //     children: [
    //       '',
    //       'Introduction',
    //       ['/guide/Page-1', 'Page 1'],
    //     ]
    //   }
    // }
    sidebar: [
      ['/guide/', 'Introduction'],
      // ['/guide/Page-1', 'Page 1'],
      // ['/guide/Page-2', 'Page 2'],
      // ['/guide/Page-3', 'Page 3']
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