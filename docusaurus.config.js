// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Russian national digital archive (ruarxive.org)',
  tagline: 'Digital born should be digital preserved',
  url: 'https://ruarxive.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ruarxive', // Usually your GitHub org/user name.
  projectName: 'ruarxive_web', // Usually your repo name.

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
          editUrl: 'https://github.com/ruarxuve/ruarxive_web/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/ruarxuve/ruarxive_web/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // algolia: {
      //   contextualSearch: true,
      // },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Russian national digital archive',
        hideOnScroll: true,
        logo: {
          alt: 'Ruarxive logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Knowledge base',
          },
          {
            to: '/blog', 
            label: 'Blog', 
            position: 'left'
          },
          {
            href: 'https://github.com/ruarxive/ruarxive_web',
            label: 'Facebook',
            position: 'right',
          },
          {
            href: 'https://t.me/ruarxive',
            label: 'Telegram',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Knowledge base',
            items: [
              {
                label: 'Knowledge base',
                to: '/kb/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Telegram channel',
                href: 'https://t.me/ruarxive',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/ruarxive',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/ruarxive/ruarxive_web',
              },
            ],
          },
        ],
        copyright: `CC-BY 4.0 ${new Date().getFullYear()}. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    localeConfigs: {
      en: {
        htmlLang: 'en-GB',
      },
      // You can omit a locale (e.g. fr) if you don't need to override the defaults
      ru: {
        htmlLang: 'ru-RU',
      },
    },
  },
};

module.exports = config;
