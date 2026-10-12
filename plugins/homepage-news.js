// Exposes the latest entries of the news feed in kb/news/index.md to the homepage
// via usePluginData('homepage-news'). Feed lines look like:
//   - **26.09.2026** — [link text](https://t.me/ruarxive/192): description.

const fs = require('fs/promises');
const path = require('path');

const ENTRY_RE = /^- \*\*(\d{2})\.(\d{2})\.(\d{4})\*\* — (.+)$/;

module.exports = function homepageNewsPlugin(context, options) {
  const { limit = 4, source = 'kb/news/index.md' } = options || {};
  const file = path.join(context.siteDir, source);

  return {
    name: 'homepage-news',

    getPathsToWatch() {
      return [file];
    },

    async loadContent() {
      const text = await fs.readFile(file, 'utf8');
      return text
        .split('\n')
        .map((line) => line.trim().match(ENTRY_RE))
        .filter(Boolean)
        .map(([, dd, mm, yyyy, body]) => ({ date: `${yyyy}-${mm}-${dd}`, body }))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, limit);
    },

    async contentLoaded({ content, actions }) {
      actions.setGlobalData({ items: content });
    },
  };
};
