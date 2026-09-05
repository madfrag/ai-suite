import { describe, expect, it } from 'vitest';
import { isOverThreshold, shouldRefreshSummary } from './summarize';

describe('isOverThreshold', () => {
  it('is false at or under the window', () => {
    expect(isOverThreshold(5)).toBe(false);
    expect(isOverThreshold(3)).toBe(false);
  });

  it('is true once past the window', () => {
    expect(isOverThreshold(6)).toBe(true);
  });
});

describe('shouldRefreshSummary', () => {
  it('is false under the threshold, even with no summary yet', () => {
    expect(shouldRefreshSummary(5, false)).toBe(false);
  });

  it('refreshes on the first crossing, when there is no summary yet', () => {
    expect(shouldRefreshSummary(6, false)).toBe(true);
  });

  it('reuses the existing summary between refresh points', () => {
    expect(shouldRefreshSummary(7, true)).toBe(false);
    expect(shouldRefreshSummary(9, true)).toBe(false);
  });

  it('refreshes again on the next multiple of 5', () => {
    expect(shouldRefreshSummary(10, true)).toBe(true);
  });
});
