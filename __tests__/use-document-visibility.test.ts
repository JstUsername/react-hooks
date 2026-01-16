import { describe, test, expect, beforeEach, vi } from 'vitest';
import { useDocumentVisibility } from '../src';
import { renderHook } from 'vitest-browser-react';

const setDocumentHidden = (hidden: boolean) => {
  Object.defineProperty(document, 'hidden', {
    writable: true,
    configurable: true,
    value: hidden,
  });

  document.dispatchEvent(new Event('visibilitychange'));
};

const hideDocument = () => setDocumentHidden(true);
const showDocument = () => setDocumentHidden(false);

describe('useDocumentVisibility', () => {
  beforeEach(() => showDocument());

  test('returns initial visible state as true when document is not hidden', async () => {
    showDocument();
    const { result } = await renderHook(() => useDocumentVisibility());
    expect(result.current.visible).toBe(true);
    expect(result.current.count).toBe(0);
  });

  test('returns initial visible state as false when document is hidden', async () => {
    hideDocument();
    const { result } = await renderHook(() => useDocumentVisibility());
    expect(result.current.visible).toBe(false);
    expect(result.current.count).toBe(0);
  });

  test('updates visible state when document visibility changes to hidden', async () => {
    const { result } = await renderHook(() => useDocumentVisibility());
    expect(result.current.visible).toBe(true);
    expect(result.current.count).toBe(0);
    hideDocument();

    await vi.waitFor(() => {
      expect(result.current.visible).toBe(false);
      expect(result.current.count).toBe(1);
    });
  });

  test('updates visible state when document visibility changes to visible', async () => {
    hideDocument();
    const { result } = await renderHook(() => useDocumentVisibility());
    expect(result.current.visible).toBe(false);
    showDocument();

    await vi.waitFor(() => {
      expect(result.current.visible).toBe(true);
      expect(result.current.count).toBe(0);
    });
  });

  test('increments count only when document becomes hidden', async () => {
    const { result } = await renderHook(() => useDocumentVisibility());
    expect(result.current.count).toBe(0);
    hideDocument();

    await vi.waitFor(() => {
      expect(result.current.count).toBe(1);
    });

    showDocument();

    await vi.waitFor(() => {
      expect(result.current.visible).toBe(true);
      expect(result.current.count).toBe(1);
    });

    hideDocument();

    await vi.waitFor(() => {
      expect(result.current.count).toBe(2);
    });
  });

  test('calls registered visibility change handler when document becomes hidden', async () => {
    const handler = vi.fn();
    const { result } = await renderHook(() => useDocumentVisibility());
    result.current.onVisibilityChange(handler);
    hideDocument();

    await vi.waitFor(() => {
      expect(handler).toHaveBeenCalledWith(false);
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  test('calls registered visibility change handler when document becomes visible', async () => {
    hideDocument();
    const handler = vi.fn();
    const { result } = await renderHook(() => useDocumentVisibility());
    result.current.onVisibilityChange(handler);
    showDocument();

    await vi.waitFor(() => {
      expect(handler).toHaveBeenCalledWith(true);
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  test('calls multiple registered handlers', async () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const handler3 = vi.fn();
    const { result } = await renderHook(() => useDocumentVisibility());
    result.current.onVisibilityChange(handler1);
    result.current.onVisibilityChange(handler2);
    result.current.onVisibilityChange(handler3);
    hideDocument();

    await vi.waitFor(() => {
      expect(handler1).toHaveBeenCalledWith(false);
      expect(handler2).toHaveBeenCalledWith(false);
      expect(handler3).toHaveBeenCalledWith(false);
    });
  });

  test('unsubscribes handler when cleanup function is called', async () => {
    const handler = vi.fn();
    const { result } = await renderHook(() => useDocumentVisibility());
    const unsubscribe = result.current.onVisibilityChange(handler);
    unsubscribe();
    hideDocument();

    await vi.waitFor(() => {
      expect(result.current.visible).toBe(false);
    });

    expect(handler).not.toHaveBeenCalled();
  });

  test('allows resubscribing after unsubscribing', async () => {
    const handler = vi.fn();
    const { result } = await renderHook(() => useDocumentVisibility());
    const unsubscribe1 = result.current.onVisibilityChange(handler);
    unsubscribe1();
    result.current.onVisibilityChange(handler);
    hideDocument();

    await vi.waitFor(() => {
      expect(handler).toHaveBeenCalledWith(false);
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  test('unsubscribes only specific handler', async () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const { result } = await renderHook(() => useDocumentVisibility());
    const unsubscribe1 = result.current.onVisibilityChange(handler1);
    result.current.onVisibilityChange(handler2);
    unsubscribe1();
    hideDocument();

    await vi.waitFor(() => {
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledWith(false);
    });
  });

  test('cleans up event listener on unmount', async () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = await renderHook(() => useDocumentVisibility());
    await unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  test('onVisibilityChange returns same function reference', async () => {
    const { result, rerender } = await renderHook(() => useDocumentVisibility());
    const firstCallback = result.current.onVisibilityChange;
    await rerender();
    const secondCallback = result.current.onVisibilityChange;
    expect(firstCallback).toBe(secondCallback);
  });

  test('handles multiple visibility changes correctly', async () => {
    const { result } = await renderHook(() => useDocumentVisibility());
    expect(result.current.visible).toBe(true);
    expect(result.current.count).toBe(0);
    hideDocument();

    await vi.waitFor(() => {
      expect(result.current.visible).toBe(false);
      expect(result.current.count).toBe(1);
    });

    showDocument();

    await vi.waitFor(() => {
      expect(result.current.visible).toBe(true);
      expect(result.current.count).toBe(1);
    });

    hideDocument();

    await vi.waitFor(() => {
      expect(result.current.visible).toBe(false);
      expect(result.current.count).toBe(2);
    });

    showDocument();

    await vi.waitFor(() => {
      expect(result.current.visible).toBe(true);
      expect(result.current.count).toBe(2);
    });
  });

  test('handler receives correct visibility state through multiple changes', async () => {
    const handler = vi.fn();
    const { result } = await renderHook(() => useDocumentVisibility());
    result.current.onVisibilityChange(handler);
    hideDocument();

    await vi.waitFor(() => {
      expect(handler).toHaveBeenCalledWith(false);
    });

    showDocument();

    await vi.waitFor(() => {
      expect(handler).toHaveBeenCalledWith(true);
    });

    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler).toHaveBeenNthCalledWith(1, false);
    expect(handler).toHaveBeenNthCalledWith(2, true);
  });
});
