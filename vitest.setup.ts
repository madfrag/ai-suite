import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom has no ResizeObserver, which Radix's Accordion relies on internally.
global.ResizeObserver =
  global.ResizeObserver ??
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

afterEach(() => {
  cleanup();
});
