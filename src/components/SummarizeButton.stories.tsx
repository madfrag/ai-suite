import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import SummarizeButton from './SummarizeButton';

const meta = {
  title: 'components/SummarizeButton',
  component: SummarizeButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof SummarizeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: { loading: false },
};

export const Loading: Story = {
  args: { loading: true },
};
