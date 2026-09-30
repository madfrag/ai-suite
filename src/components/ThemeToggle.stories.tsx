import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CookiesProvider } from 'react-cookie';
import ThemeToggle from './ThemeToggle';

const meta = {
  title: 'components/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CookiesProvider>
        <Story />
      </CookiesProvider>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: { initialTheme: 'light' },
};

export const Dark: Story = {
  args: { initialTheme: 'dark' },
};
