// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  knowledgeBase: [
    'intro',
    {
      type: 'category',
      label: 'Проекты',
      collapsed: false,
      items: [
        'projects/index',
        'projects/echomsk',
        'projects/russian-smi',
        'projects/preserved-government',
        'preserved-projects-table',
        'preserved-projects-form',
        'archive-plans',
      ],
    },
    {
      type: 'category',
      label: 'Кейсы и истории',
      collapsed: false,
      items: [
        'case-studies/index',
        'case-studies/government-websites-disappearing',
        'case-studies/bank-closures',
        'case-studies/platform-migrations',
        'case-studies/international-examples',
        'case-studies/multi-tool-archiving',
        'case-studies/api-archiving-scale',
        'case-studies/wparc-to-metawarc-pipeline',
      ],
    },
    {
      type: 'category',
      label: 'Гайды',
      collapsed: false,
      link: { type: 'doc', id: 'guides/index' },
      items: [
        'guides/index',
        {
          type: 'category',
          label: 'Быстрый старт',
          key: 'guides-quickstart',
          collapsed: false,
          items: [
            'guides/quick-start-5min',
            'guides/emergency-archiving',
          ],
        },
        {
          type: 'category',
          label: 'Инструменты',
          key: 'guides-tools',
          collapsed: false,
          items: [
            'guides/wget',
          ],
        },
        {
          type: 'category',
          label: 'Продвинутые темы',
          key: 'guides-advanced',
          collapsed: false,
          items: [
            'guides/custom-workflows',
            'guides/warc-workflow',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Инструменты',
      collapsed: false,
      items: [
        'instruments/index',
        {
          type: 'category',
          label: 'Инструменты Ruarxive',
          items: [
            'instruments/ruarxive-tools/index',
            {
              type: 'category',
              label: 'Сбор данных',
              items: [
                'instruments/ruarxive-tools/tgarc',
                'instruments/ruarxive-tools/wparc',
                'instruments/ruarxive-tools/ydiskarc',
                'instruments/ruarxive-tools/filegetter',
              ],
            },
            {
              type: 'category',
              label: 'Обработка и анализ',
              items: [
                'instruments/ruarxive-tools/metawarc',
                'instruments/ruarxive-tools/metawarc-mcp',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Программы и утилиты',
          items: [
            'instruments/tools/index',
            {
              type: 'category',
              label: 'Браузерные кроулеры',
              items: [
                'instruments/tools/browsertrix',
                'instruments/tools/brozzler',
                'instruments/tools/squidwarc',
                'instruments/tools/warcworker',
              ],
            },
            {
              type: 'category',
              label: 'HTTP-кроулеры',
              items: [
                'instruments/tools/heritrix',
                'instruments/tools/wpull',
                'instruments/tools/wget',
                'instruments/tools/httrack',
                'instruments/tools/grab-site',
              ],
            },
            {
              type: 'category',
              label: 'Моментальное сохранение',
              items: [
                'instruments/tools/archive-ph',
                'instruments/tools/singlefile',
                'instruments/tools/webscrapbook',
                'instruments/tools/monolith',
                'instruments/tools/obelisk',
              ],
            },
            {
              type: 'category',
              label: 'HTTP-утилиты',
              items: [
                'instruments/tools/curl',
              ],
            },
            {
              type: 'category',
              label: 'Архивные системы',
              items: [
                'instruments/tools/archivebox',
                'instruments/tools/wallabag',
              ],
            },
            {
              type: 'category',
              label: 'WARC-инфраструктура',
              items: [
                'instruments/tools/warc-processing',
                'instruments/tools/warcprox',
                'instruments/tools/warc2zim',
                'instruments/tools/solrwayback',
                'instruments/tools/shine',
              ],
            },
            {
              type: 'category',
              label: 'Управление архивацией',
              items: [
                'instruments/tools/web-curator-tool',
                'instruments/tools/internet-archive-cli',
              ],
            },
            {
              type: 'category',
              label: 'Специализированные загрузчики',
              items: [
                'instruments/tools/tdl',
                'instruments/tools/yt-dlp',
                'instruments/tools/gallery-dl',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Социальные сети',
          items: [
            'instruments/social-media/index',
            'instruments/social-media/instagram',
            'instruments/social-media/youtube-video',
            'instruments/social-media/vk',
            'instruments/social-media/facebook',
            'instruments/social-media/rutube',
            'instruments/social-media/fbarc',
            'instruments/social-media/twarc',
            'instruments/social-media/social-feed-manager',
          ],
        },
        {
          type: 'category',
          label: 'Справочник форматов',
          items: [
            'instruments/file-formats/index',
            {
              type: 'category',
              label: 'Контейнеры веб-архивов',
              items: [
                'instruments/file-formats/warc',
                'instruments/file-formats/wacz',
                'instruments/file-formats/cdx',
                'instruments/file-formats/mhtml',
              ],
            },
            {
              type: 'category',
              label: 'Метаданные и упаковка',
              items: [
                'instruments/file-formats/premis',
                'instruments/file-formats/mets',
                'instruments/file-formats/bagit',
              ],
            },
            {
              type: 'category',
              label: 'Специализированные архивы',
              items: [
                'instruments/file-formats/pdfa',
                'instruments/file-formats/mbox',
                'instruments/file-formats/siard',
                'instruments/file-formats/jp2',
                'instruments/file-formats/iiif',
              ],
            },
            {
              type: 'category',
              label: 'Идентификация форматов',
              items: [
                'instruments/file-formats/identification-tools',
                'instruments/file-formats/format-registries',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Воспроизведение архивов',
          items: [
            'instruments/replay/index',
            'instruments/replay/replayweb-page',
            'instruments/replay/pywb',
            'instruments/replay/openwayback',
            'instruments/replay/ipwb',
            'instruments/replay/warc2html',
          ],
        },
        {
          type: 'category',
          label: 'Как собирать архивы',
          items: [
            'instruments/howto-collect/make-copy-website',
            'instruments/howto-collect/make-copy-site-wordpress',
          ],
        },
        {
          type: 'category',
          label: 'Как выгружать данные',
          items: [
            'instruments/data-take-out/data-take-out-main',
            'instruments/data-take-out/dto-telegram',
            'instruments/data-take-out/dto-instagram',
            'instruments/data-take-out/dto-facebook',
            'instruments/data-take-out/dto-twitter',
            'instruments/data-take-out/dto-vk',
            'instruments/data-take-out/dto-youtube',
            'instruments/data-take-out/dto-yandex',
            'instruments/data-take-out/dto-google',
            'instruments/data-take-out/dto-notion',
            'instruments/data-take-out/dto-slack',
          ],
        },
        {
          type: 'category',
          label: 'Загружаемые данные',
          items: [
            'instruments/downloaded-data/apibackuper',
            'instruments/downloaded-data/apibackuper-configs',
            'instruments/downloaded-data/spcrawler',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Как пользоваться архивами',
      collapsed: false,
      items: [
        'users/index',
        'users/open-warc',
        'users/citation',
      ],
    },
    {
      type: 'category',
      label: 'Правовые и этические вопросы',
      items: [
        'legal/index',
        'legal/copyright',
        'legal/personal-data',
        'legal/terms-of-service',
      ],
    },
    {
      type: 'category',
      label: 'Справочник',
      items: [
        'glossary',
        'faq',
      ],
    },
    {
      type: 'category',
      label: 'Похожие проекты',
      items: [
        'similar/archiveteam',
        'similar/internet-archive',
        'similar/common-crawl',
        'similar/perma-cc',
        'similar/international-archives',
      ],
    },
    {
      type: 'category',
      label: 'Ресурсы',
      items: [
        'resources/stats-snapshot',
        'resources/statistics',
        'resources/comparisons',
        'resources/test-files',
      ],
    },
    {
      type: 'category',
      label: 'Волонтёрам',
      items: [
        'volunteers/volunteers-tasks',
        'volunteers/metadata-echo-moscow-archive',
      ],
    },
    {
      type: 'category',
      label: 'О проекте',
      items: [
        'about/index',
        'about/project-history',
        'about/lessons-learned',
      ],
    },
    {
      type: 'category',
      label: 'Новости',
      items: [
        'news/index',
      ],
    },
    {
      type: 'category',
      label: 'Благодарности',
      items: [
        'gratitudes/index',
      ],
    },
    {
      type: 'category',
      label: 'Курсы',
      items: [
        'course/index',
        'course/dh1-introduction',
        'course/dh2-web-archiving',
        'course/dh3-specialized-resources',
        'course/dh4-internet-archive',
      ],
    },
  ],
};

module.exports = sidebars;