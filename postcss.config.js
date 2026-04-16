import prefixSelector from 'postcss-prefix-selector';

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-prefix-selector': {
      prefix: '#mitienda-chat',
      transform(prefix, selector, prefixedSelector) {
        // Don't prefix keyframe selectors (e.g. 0%, 50%, 100%, from, to)
        if (/^(\d+%|from|to)$/.test(selector)) {
          return selector;
        }
        // Scope *, ::before, ::after, ::backdrop to the container
        if (selector === '*' || selector === '::backdrop') {
          return `${prefix} ${selector}`;
        }
        // Scope html/:host/body resets to the container itself
        if (/^(html|:host|body)$/.test(selector)) {
          return prefix;
        }
        return prefixedSelector;
      },
    },
  },
};
