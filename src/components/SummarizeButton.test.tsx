import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SummarizeButton from './SummarizeButton';

describe('SummarizeButton', () => {
  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<SummarizeButton onClick={onClick} loading={false} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('shows a loading state and disables the button', () => {
    render(<SummarizeButton onClick={vi.fn()} loading />);

    const button = screen.getByRole('button', { name: /summarizing/i });
    expect(button).toBeDisabled();
  });
});
