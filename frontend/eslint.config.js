import tsParser from '@typescript-eslint/parser';

// Minimal ESLint config — design system token enforcement only.
// See docs/STYLE_GUIDE.md for token usage rules.
export default [
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['node_modules/**', 'dist/**', 'src/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // Warn on hex color literals inside JSX attributes. Covers:
      //   <div className="bg-[#FAF8F4]">
      //   <div style={{ color: '#222' }}>
      //   <path fill="#3f84c8" />
      // Does NOT cover: hashtag strings like "#PipelineOps", SVG path data.
      // Justified exceptions (Google brand, LinkedIn, Facebook, Instagram, Pulse
      // amber, intentional black) should be suppressed per-line with:
      //   // eslint-disable-next-line no-restricted-syntax -- <reason>
      'no-restricted-syntax': ['warn', {
        selector: "JSXAttribute Literal[value=/#[0-9A-Fa-f]{3,8}($|[^a-zA-Z])/]",
        message: 'Use a CSS token (rgb(var(--color-*))) or a Tailwind class instead of a hex literal. See docs/STYLE_GUIDE.md.',
      }],
    },
  },
];
