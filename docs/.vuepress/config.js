module.exports = {
  title: 'Orango',
  description: 'ArangoDB Object Modeler for Node.js, Foxx and Web Browsers',
  head: [
    ['link', { rel: 'icon', href: `/icons/favicon.ico` }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#fd6602' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: '#fd6602' }
    ],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon.png` }],
    [
      'link',
      {
        rel: 'mask-icon',
        href: '/icons/safari-pinned-tab.svg',
        color: '#3eaf7c'
      }
    ],
    [
      'meta',
      { name: 'msapplication-TileImage', content: '/icons/mstile-150x150.png' }
    ],
    ['meta', { name: 'msapplication-TileColor', content: '#fd6602' }]
  ],
  serviceWorker: {
    updatePopup: true
  },
  themeConfig: {
    nav: [
      {
        text: 'Guide',
        link: '/guide/'
      },
      {
        text: 'Config Reference',
        link: '/config/'
      },
      {
        text: 'Default Theme Config',
        link: '/default-theme-config/'
      },
      {
        text: 'Changelog',
        link: 'https://github.com/vuejs/vuepress/blob/master/CHANGELOG.md'
      }
    ],
    sidebar: {
      '/guide/': [
        '' /* /foo/ */,
        'one' /* /foo/one.html */,
        'two' /* /foo/two.html */
      ],
      // '/guide/': {
      //   title: 'Guide',
      //   collapsable: false,
      //   children: [
      //     '/',
      //     // 'introduction',
      //     // 'one',
      //     // 'two'
      //   ]
      // },
      '/config/': ['' /* /foo/ */, 'introduction' /* /foo/one.html */]
    },
    // Assumes GitHub. Can also be a full GitLab url.
    repo: 'roboncode/orango',
    // Customising the header label
    // Defaults to "GitHub"/"GitLab"/"Bitbucket" depending on `themeConfig.repo`
    // repoLabel: 'Contribute!',

    // Optional options for generating "Edit this page" link

    // if your docs are in a different repo from your main project:
    docsRepo: 'vuejs/vuepress',
    // if your docs are not at the root of the repo:
    docsDir: 'docs',
    // if your docs are in a specific branch (defaults to 'master'):
    docsBranch: 'master',
    // defaults to false, set to true to enable
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: 'Help us improve this page!'
    // sidebar: [
    //   {
    //     title: 'Group 1',
    //     collapsable: false,
    //     children: ['', 'one', 'two']
    //   }
    // ]
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@img': 'img'
      }
    }
  }
}
