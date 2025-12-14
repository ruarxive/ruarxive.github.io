// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Национальный цифровой архив России (ruarxive.org)',
  tagline: 'Цифровое должно быть сохранено в цифровом виде',
  url: 'https://ruarxive.org',
  // url: 'https://ruarxive.github.io',
  // baseUrl: '/',
  // url: 'https://github.com',
  baseUrl: '/',
  organizationName: 'ruarxive', // Usually your GitHub org/user name.
  projectName: 'ruarxive.github.io', // Usually your repo name.
  // deploymentBranch removed - not needed for GitHub Actions Pages deployment
  trailingSlash: false,
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'kb',
          routeBasePath: 'kb',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // editUrl: 'https://github.com/ruarxive/ruarxive.github.io/edit/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // editUrl: 'https://github.com/ruarxive/ruarxive.github.io/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
        gtag: {
          trackingID: 'G-D592532TZ6',
          anonymizeIP: true,
        },
      }),
    ],
  ],

  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      ({
        hashed: true,
        language: ["ru"],
        docsRouteBasePath: "kb",
        docsDir: "kb",
        blogRouteBasePath: "blog",
      }),
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'about',
        path: 'about',
        routeBasePath: 'about',
        sidebarPath: require.resolve('./sidebars-about.js'),
      },
    ],
  ],

  scripts: [
    'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js',
    'https://widget.cloudpayments.ru/bundles/cloudpayments.js',
    'https://checkout.cloudpayments.ru/checkout.js',
    '/js/payment.js',
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // SEO: Open Graph and Twitter Card images
      image: 'img/hero.jpg',
      metadata: [
        {name: 'keywords', content: 'цифровой архив, веб-архивация, сохранение цифрового наследия, ruarxive, российский архив, архивация сайтов, архивация telegram, warc, wacz, digital preservation'},
        {name: 'author', content: 'Ruarxive, Information Culture'},
        {name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'},
        {name: 'googlebot', content: 'index, follow'},
        {name: 'language', content: 'Russian'},
        {name: 'geo.region', content: 'RU'},
        {property: 'og:type', content: 'website'},
        {property: 'og:locale', content: 'ru_RU'},
        {property: 'og:site_name', content: 'Ruarxive - Национальный цифровой архив России'},
        {property: 'og:image:width', content: '1200'},
        {property: 'og:image:height', content: '630'},
        {property: 'og:image:type', content: 'image/jpeg'},
        {name: 'twitter:card', content: 'summary_large_image'},
        {name: 'twitter:site', content: '@ruarxive'},
        {name: 'twitter:creator', content: '@ruarxive'},
      ],
      // algolia: {
      //   contextualSearch: true,
      // },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Национальный цифровой архив России',
        // hideOnScroll: true,
        logo: {
          alt: 'Логотип Ruarxive',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            label: 'База знаний',
            position: 'left',
          },
          {
            to: '/about/intro',
            label: 'О проекте',
            position: 'left'
          },
          {
            to: '/blog',
            label: 'Блог',
            position: 'left'
          },
          {
            href: 'https://t.me/ruarxivechat',
            label: 'Обсуждение',
            position: 'right',
          },
          // {
          //   to: '/donate',
          //   label: 'Donate',
          //   className: 'navbar-link-btn',
          //   position: 'right',
          // },
          // {
          //   href: 'https://www.facebook.com/InformationCulture',
          //   label: 'Facebook',
          //   position: 'right',
          // },
          {
            href: 'https://t.me/ruarxive',
            label: 'Telegram',
            position: 'right',
          },
          {
            to: '/about/donate',
            label: 'Поддержать проект',
            position: 'right',
            className: 'navbar-link-btn',
          },
          // {
          //   type: 'doc',
          //   docId: 'donate',
          //   label: 'Support project',
          //   position: 'right',
          //   className: 'navbar-link-btn',
          // },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'База знаний',
            items: [
              {
                label: 'База знаний',
                to: '/kb/intro',
              },
            ],
          },
          {
            title: 'Сообщество',
            items: [
              {
                label: 'Telegram-канал',
                href: 'https://t.me/ruarxive',
              },
              {
                label: 'Telegram-чат',
                href: 'https://t.me/ruarxivechat',
              },
            ],
          },
          {
            title: 'Дополнительно',
            items: [
              {
                label: 'Блог',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/ruarxive/ruarxive_web',
              },
            ],
          },
        ],
        copyright: `CC-BY 4.0 ${new Date().getFullYear()}. Built with Docusaurus. <a href=\"https://infoculture.ru\" target=\"_blank\">Information Culture</a>, ${new Date().getFullYear()}`,
        // copyright: `CC-BY 4.0 ${new Date().getFullYear()}. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
    localeConfigs: {
      // You can omit a locale (e.g. fr) if you don't need to override the defaults
      ru: {
        htmlLang: 'ru-RU',
      },
    },
  },

  ssrTemplate: `<!DOCTYPE html>
<html <%~ it.htmlAttributes %>>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="Docusaurus v<%= it.version %>">
    <% it.metaAttributes.forEach((metaAttribute) => { %>
      <%~ metaAttribute %>
    <% }); %>
    <%~ it.headTags %>
    <!-- Yandex.Metrika counter -->
    <script type="text/javascript">
        (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=105842405', 'ym');

        ym(105842405, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
    </script>
    <!-- /Yandex.Metrika counter -->
    <% it.stylesheets.forEach((stylesheet) => { %>
      <link rel="stylesheet" href="<%= it.baseUrl %><%= stylesheet %>" />
    <% }); %>
    <% it.scripts.forEach((script) => { %>
      <link rel="preload" href="<%= it.baseUrl %><%= script %>" as="script">
    <% }); %>
  </head>
  <body <%~ it.bodyAttributes %>>
    <noscript><div><img src="https://mc.yandex.ru/watch/105842405" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <%~ it.preBodyTags %>
    <div id="__docusaurus">
      <%~ it.appHtml %>
    </div>
    <% it.scripts.forEach((script) => { %>
      <script src="<%= it.baseUrl %><%= script %>"></script>
    <% }); %>
    <%~ it.postBodyTags %>
  </body>
</html>`,
};

module.exports = config;
