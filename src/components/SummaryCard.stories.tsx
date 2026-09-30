import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import SummaryCard from './SummaryCard';

const SAMPLE_CONTENT =
  '• The article covers three main points about renewable energy adoption.\n' +
  '• Solar capacity has grown 40% year over year in the region.\n' +
  '• Policy incentives remain the largest driver of continued growth.';

const meta = {
  title: 'components/SummaryCard',
  component: SummaryCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    title: 'OpenAI — Bullet Point Summary',
    content: SAMPLE_CONTENT,
  },
} satisfies Meta<typeof SummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReadOnly: Story = {};

export const Saveable: Story = {
  args: { onSave: fn(), saved: false },
};

export const AlreadySaved: Story = {
  args: { onSave: fn(), saved: true },
};
