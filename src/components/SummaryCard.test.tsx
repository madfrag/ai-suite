import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SummaryCard from './SummaryCard';

describe('SummaryCard', () => {
  it('renders the title and content', () => {
    render(
      <SummaryCard
        title="Short Summary"
        content="some summary text"
        onSave={vi.fn()}
        saved={false}
      />
    );
    expect(screen.getByText('Short Summary')).toBeInTheDocument();
    expect(screen.getByText('some summary text')).toBeInTheDocument();
  });

  it('copies the content to the clipboard', () => {
    const writeText = vi.fn();
    Object.assign(navigator, { clipboard: { writeText } });
    render(
      <SummaryCard
        title="Short Summary"
        content="some summary text"
        onSave={vi.fn()}
        saved={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /copy summary/i }));
    expect(writeText).toHaveBeenCalledWith('some summary text');
  });

  it('calls onSave and reflects the saved state', () => {
    const onSave = vi.fn();
    const { rerender } = render(
      <SummaryCard
        title="Short Summary"
        content="some summary text"
        onSave={onSave}
        saved={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /^save$/i }));
    expect(onSave).toHaveBeenCalledOnce();

    rerender(
      <SummaryCard title="Short Summary" content="some summary text" onSave={onSave} saved />
    );
    expect(screen.getByRole('button', { name: /^saved$/i })).toBeDisabled();
  });

  it('omits the save button entirely when onSave is not provided', () => {
    render(<SummaryCard title="Short Summary" content="some summary text" />);
    expect(screen.queryByRole('button', { name: /^save$/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy summary/i })).toBeInTheDocument();
  });
});
