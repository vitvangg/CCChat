# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Additional Libraries for CCChat Project

The following libraries will be installed for this project:

```bash
npm i react-router axios lucide-react tailwindcss @tailwindcss/vite tailwindcss-animate zustand zod react-hook-form @hookform/resolvers sonner
```
```bash
npm i -D @types/node
```

### Setup Shadcn UI

Follow the official installation guide: [Shadcn UI for Vite](https://ui.shadcn.com/docs/installation/vite)

### Library Descriptions

- **react-router** - Client-side routing library for React applications, enables navigation between different pages/components
- **axios** - HTTP client library for making API requests, provides better error handling and request/response interceptors than fetch
- **lucide-react** - Beautiful, customizable SVG icon library with consistent design system for React applications
- **tailwindcss** - Utility-first CSS framework for rapidly building modern, responsive user interfaces
- **@tailwindcss/vite** - Official Vite plugin for Tailwind CSS integration with hot module replacement support
- **tailwindcss-animate** - Animation utilities plugin for Tailwind CSS, provides pre-built animation classes
- **zustand** - Lightweight state management library for React, simpler alternative to Redux with minimal boilerplate
- **zod** - TypeScript-first schema validation library for runtime type checking and data validation
- **react-hook-form** - Performant forms library with minimal re-renders and easy validation integration
- **@hookform/resolvers** - Validation resolvers for react-hook-form, includes integrations with popular validation libraries like Zod
- **sonner** - Beautiful, customizable toast notification library for React applications

## Other UI
```bash
npx shadcn@latest add switch dialog badge textarea popover  
```

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
