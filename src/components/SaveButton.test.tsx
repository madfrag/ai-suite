import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SaveButton from './SaveButton';

describe('SaveButton', () => {
  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<SaveButton onClick={onClick} disabled={false} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('respects the disabled prop', () => {
    render(<SaveButton onClick={vi.fn()} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
