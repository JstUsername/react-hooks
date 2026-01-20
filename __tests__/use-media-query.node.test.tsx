// @vitest-environment node
import { describe, expect, test } from 'vitest';
import { useMediaQuery } from '../src';
import { renderHook } from 'vitest-browser-react';

describe('useMediaQuery', () => {
  test('handles SSR environment (window undefined)', async () => {
    const { result } = await renderHook(() => useMediaQuery({ query: '(min-width: 768px)' }));
    expect(result.current).toBe(false);
  });
});
