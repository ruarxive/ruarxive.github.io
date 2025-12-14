# Ruarxive Website

![Build Status](https://github.com/ruarxive/ruarxive_web/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/github/license/ruarxive/ruarxive_web)
![Docusaurus](https://img.shields.io/badge/built%20with-Docusaurus-green)

The official website and knowledge base for the **Russian National Digital Archive (Ruarxive)**, built with [Docusaurus 3](https://docusaurus.io/).

## 🚀 Getting Started

### Prerequisites

- Node.js version 18 or higher.
- npm (comes with Node.js).

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ruarxive/ruarxive_web.git
cd ruarxive_web
npm install
```

### Local Development

Start the development server:

```bash
npm start
```

This starts a local development server at `http://localhost:3000`. Most changes are reflected live without restarting the server.

### Building for Production

Generate static content into the `build` directory:

```bash
npm run build
```

## 🛠️ Project Structure

- `/kb` - Knowledge Base documentation files (Markdown/MDX).
- `/blog` - Blog posts.
- `/src` - React components and pages.
- `/i18n` - Translations (Russian is default, English supported).

## 🧪 Code Quality

This project uses ESLint and Prettier to ensure code quality.

- **Lint**: `npm run lint`
- **Format**: `npm run format`

## 🤝 Contributing

we welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
