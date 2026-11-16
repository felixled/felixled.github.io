export const sharedStyles = `
  :host {
    --m257-text: var(--global-text-color, #1f2937);
    --m257-muted: var(--global-text-color-light, #6b7280);
    --m257-surface: var(--global-bg-color, #ffffff);
    --m257-surface-muted: var(--global-card-bg-color, #f7f7f8);
    --m257-border: var(--global-divider-color, #d1d5db);
    --m257-accent: var(--global-theme-color, #2563eb);
    --m257-series-1: #3b82f6;
    --m257-series-2: #f97316;
    --m257-series-3: #10b981;

    display: block;
    color: var(--m257-text);
    font: inherit;
    max-width: 100%;
  }

  *, *::before, *::after { box-sizing: border-box; }

  button, input { font: inherit; }

  button:focus-visible,
  input:focus-visible {
    outline: 2px solid var(--m257-accent);
    outline-offset: 2px;
  }
`;
