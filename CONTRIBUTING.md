# Contributing to Ruarxive Website

Thank you for your interest in contributing to the Ruarxive project! We welcome contributions from everyone.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/ruarxive_web.git
    cd ruarxive_web
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Create a branch** for your feature or fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```

## Making Changes

- **Documentation**: Edits to the Knowledge Base go in the `/kb` folder. Blog posts go in `/blog`.
- **Code**: React components are in `/src`.
- **Styles**: Custom CSS is in `/src/css`.

### Code Style
We use ESLint and Prettier. Please run the following before committing:

```bash
npm run format
npm run lint
```

## Submitting a Pull Request

1.  **Push your branch** to GitHub:
    ```bash
    git push origin feature/amazing-feature
    ```
2.  Open a **Pull Request** on the main repository.
3.  Ensure the **CI checks** pass.

## Reporting Issues

If you find a bug or have a suggestion, please open an issue in the [GitHub Issue Tracker](https://github.com/ruarxive/ruarxive_web/issues).
