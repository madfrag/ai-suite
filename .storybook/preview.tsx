import type { Decorator, Preview } from '@storybook/nextjs-vite';
import '../src/app/globals.css';
import '../src/app/custom.css';

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? 'light';
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="bg-background text-foreground p-6">
        <Story />
      </div>
    </div>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Light/dark theme (mirrors the app's own cookie-driven toggle)",
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'error',
    },
  },
};

export default preview;
