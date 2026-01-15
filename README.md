# @g4ndy/react-hooks

<div align="center">

[![npm version](https://img.shields.io/npm/v/@g4ndy/react-hooks.svg)](https://www.npmjs.com/package/@g4ndy/react-hooks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A collection of custom React hooks created for self-education and practical use.

[NPM Package](https://www.npmjs.com/package/@g4ndy/react-hooks) • [Report Bug](https://github.com/JstUsername/react-hooks/issues) • [Request Feature](https://github.com/JstUsername/react-hooks/issues)

</div>

---

## 📚 About

This library is a curated collection of custom React hooks designed to simplify common patterns and enhance your development workflow. Built with TypeScript and modern React practices, these hooks are production-ready and thoroughly tested.

## ✨ Features

- 🎯 **Type-Safe** - Full TypeScript support with comprehensive type definitions
- 🪶 **Lightweight** - Zero dependencies beyond React
- 📦 **Tree-Shakeable** - Import only what you need
- ⚡ **Performance-Optimized** - Efficient implementations following React best practices

## 📦 Installation

```bash
# Using npm
npm install @g4ndy/react-hooks

# Using yarn
yarn add @g4ndy/react-hooks

# Using pnpm
pnpm add @g4ndy/react-hooks
```

## 🚀 Quick Start

```tsx
export const DocumentVisibilityExample = () => {
  const { count, visible, onVisibilityChange } = useDocumentVisibility();
    
  useEffect(() => {
    onVisibilityChange((isVisible) => {
      console.info('First handler: ', isVisible);
    });

    const unsubscribeSecondHandler = onVisibilityChange((isVisible) => {
      console.info('Second handler: ', isVisible);
    });
        
    setTimeout(() => unsubscribeSecondHandler(), 5000);
  }, [onVisibilityChange]);

  return (
    <div>
      <span>You have left the page {count} times</span>
      <br />
      <span>
        Is the tab active? - <span>{visible ? 'yes' : 'no'}</span>
      </span>
    </div>
  );
};
```

## 📚 Available Hooks

### Browser APIs
- `useMediaQuery` - Respond to media query changes
- `useDocumentVisibility` - Track document visibility and tab switching events

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/JstUsername/react-hooks.git
cd react-hooks

# Install dependencies
npm install

# Build the library
npm run build

# Lint code
npm run lint
```

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository;
2. Create your feature branch (`git checkout -b feature/AmazingFeature`);
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`);
4. Push to the branch (`git push origin feature/AmazingFeature`);
5. Open a Pull Request.

Please make sure to:
- Follow the existing code style;
- Update documentation as needed;
- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.
