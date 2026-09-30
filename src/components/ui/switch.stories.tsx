import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Switch } from './switch';

const meta = {
  title: 'ui/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // The real app always pairs this with visible text via aria-labelledby
  // (see SummaryTabs.tsx) — a bare Switch in isolation needs its own
  // accessible name, or Storybook's a11y addon (wired to fail on violations)
  // correctly flags it as an unlabeled control.
  args: { 'aria-label': 'Example switch' },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: { checked: false },
};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { checked: false, disabled: true },
};

export const Interactive: Story = {
  render: function InteractiveSwitch() {
    const [checked, setChecked] = useState(false);
    return (
      <Switch checked={checked} onCheckedChange={setChecked} aria-label="Interactive switch" />
    );
  },
};
