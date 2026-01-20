import { beforeEach, describe, expect, test, vi } from 'vitest';
import { MediaQuery, useMediaQuery } from '../src';
import { page } from '@vitest/browser/context';
import { render, renderHook } from 'vitest-browser-react';

describe('useMediaQuery', () => {
  beforeEach(async () => {
    await page.viewport(1024, 768);
  });

  test('returns true when media query matches', async () => {
    const { result } = await renderHook(() => useMediaQuery({ query: '(min-width: 768px)' }));

    await vi.waitFor(async () => {
      expect(result.current).toBe(true);
    });
  });

  test('returns false when media query does not match', async () => {
    const { result } = await renderHook(() => useMediaQuery({ query: '(min-width: 2000px)' }));

    await vi.waitFor(async () => {
      expect(result.current).toBe(false);
    });
  });

  test('updates when window size changes', async () => {
    const { result } = await renderHook(() => useMediaQuery({ query: '(min-width: 768px)' }));

    await vi.waitFor(async () => {
      expect(result.current).toBe(true);
    });

    await page.viewport(500, 768);

    await vi.waitFor(async () => {
      expect(result.current).toBe(false);
    });

    await page.viewport(1024, 768);

    await vi.waitFor(async () => {
      expect(result.current).toBe(true);
    });
  });

  test('updates when query changes', async () => {
    const { result, rerender } = await renderHook(
      (initialProps: { query: string } | undefined) => useMediaQuery({ query: initialProps?.query || '' }),
      {
        initialProps: { query: '(min-width: 768px)' },
      },
    );

    await page.viewport(1024, 768);

    await vi.waitFor(async () => {
      expect(result.current).toBe(true);
    });

    await rerender({ query: '(min-width: 2000px)' });

    await vi.waitFor(async () => {
      expect(result.current).toBe(false);
    });
  });

  test('works with max-width', async () => {
    await page.viewport(500, 768);
    const { result } = await renderHook(() => useMediaQuery({ query: '(max-width: 768px)' }));

    await vi.waitFor(async () => {
      expect(result.current).toBe(true);
    });
  });

  test('works with orientation', async () => {
    await page.viewport(1024, 768);
    const { result } = await renderHook(() => useMediaQuery({ query: '(orientation: landscape)' }));

    await vi.waitFor(async () => {
      expect(result.current).toBe(true);
    });
  });

  test('works with height', async () => {
    await page.viewport(1024, 500);
    const { result } = await renderHook(() => useMediaQuery({ query: '(min-height: 400px)' }));

    await vi.waitFor(async () => {
      expect(result.current).toBe(true);
    });
  });

  test('works with complex queries', async () => {
    await page.viewport(1024, 768);
    const { result } = await renderHook(() => useMediaQuery({ query: '(min-width: 768px) and (max-width: 1200px)' }));

    await vi.waitFor(async () => {
      expect(result.current).toBe(true);
    });
  });
});

describe('MediaQuery Component', () => {
  beforeEach(async () => {
    await page.viewport(1024, 768);
  });

  test('renders children when media query matches (minWidth)', async () => {
    const { getByTestId } = await render(
      <MediaQuery minWidth={768}>
        <div data-testid="content">Visible Content</div>
      </MediaQuery>,
    );

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).toBeInTheDocument();
    });
  });

  test('does not render children when media query does not match (minWidth)', async () => {
    const { getByTestId } = await render(
      <MediaQuery minWidth={2000}>
        <div data-testid="content">Hidden Content</div>
      </MediaQuery>,
    );

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).not.toBeInTheDocument();
    });
  });

  test('works with maxWidth', async () => {
    await page.viewport(500, 768);

    const { getByTestId } = await render(
      <MediaQuery maxWidth={768}>
        <div data-testid="content">Mobile Content</div>
      </MediaQuery>,
    );

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).toBeInTheDocument();
    });
  });

  test('works with minHeight', async () => {
    const { getByTestId } = await render(
      <MediaQuery minHeight={500}>
        <div data-testid="content">Tall Content</div>
      </MediaQuery>,
    );

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).toBeInTheDocument();
    });
  });

  test('works with maxHeight', async () => {
    await page.viewport(1024, 500);

    const { getByTestId } = await render(
      <MediaQuery maxHeight={600}>
        <div data-testid="content">Short Content</div>
      </MediaQuery>,
    );

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).toBeInTheDocument();
    });
  });

  test('works with orientation landscape', async () => {
    await page.viewport(1024, 768);

    const { getByTestId } = await render(
      <MediaQuery orientation="landscape">
        <div data-testid="content">Landscape Content</div>
      </MediaQuery>,
    );

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).toBeInTheDocument();
    });
  });

  test('works with orientation portrait', async () => {
    await page.viewport(768, 1024);

    const { getByTestId } = await render(
      <MediaQuery orientation="portrait">
        <div data-testid="content">Portrait Content</div>
      </MediaQuery>,
    );

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).toBeInTheDocument();
    });
  });

  test('works with function as children', async () => {
    const { getByTestId } = await render(
      <MediaQuery minWidth={768}>
        {(isMatches) => <div data-testid="content">{isMatches ? 'Desktop' : 'Mobile'}</div>}
      </MediaQuery>,
    );

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).toHaveTextContent('Desktop');
    });
  });

  test('function children updates when size changes', async () => {
    const { getByTestId } = await render(
      <MediaQuery minWidth={768}>
        {(isMatches) => <div data-testid="content">{isMatches ? 'Desktop' : 'Mobile'}</div>}
      </MediaQuery>,
    );

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).toHaveTextContent('Desktop');
    });

    await page.viewport(500, 768);

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).toHaveTextContent('Mobile');
    });
  });

  test('updates when viewport changes', async () => {
    const { getByTestId, rerender } = await render(
      <MediaQuery minWidth={768}>
        <div data-testid="content">Visible</div>
      </MediaQuery>,
    );

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).toBeInTheDocument();
    });

    await page.viewport(500, 768);

    await rerender(
      <MediaQuery minWidth={768}>
        <div data-testid="content">Visible</div>
      </MediaQuery>,
    );

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).not.toBeInTheDocument();
    });
  });

  test('works with minResolution', async () => {
    const { getByTestId } = await render(
      <MediaQuery minResolution="1dppx">
        <div data-testid="content">High DPI</div>
      </MediaQuery>,
    );

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).toBeInTheDocument();
    });
  });

  test('works with maxResolution', async () => {
    const { getByTestId } = await render(
      <MediaQuery maxResolution="10dppx">
        <div data-testid="content">Normal DPI</div>
      </MediaQuery>,
    );

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).toBeInTheDocument();
    });
  });

  test('correctly generates query for each prop', async () => {
    const testCases = [
      { props: { minWidth: 500 }, shouldRender: true },
      { props: { maxWidth: 2000 }, shouldRender: true },
      { props: { minHeight: 500 }, shouldRender: true },
      { props: { maxHeight: 1000 }, shouldRender: true },
    ];

    for (const { props, shouldRender } of testCases) {
      const { getByTestId, unmount } = await render(
        <MediaQuery {...props}>
          <div data-testid="content">Content</div>
        </MediaQuery>,
      );

      if (shouldRender) {
        await vi.waitFor(async () => {
          await expect.element(getByTestId('content')).toBeInTheDocument();
        });
      }

      await unmount();
    }
  });

  test('handles invalid/unknown prop gracefully', async () => {
    const { getByTestId } = await render(
      // @ts-expect-error intentionally passing an invalid prop
      <MediaQuery unknownProp={123}>
        <div data-testid="content">Content</div>
      </MediaQuery>,
    );

    await expect.element(getByTestId('content')).not.toBeInTheDocument();
  });

  test('renders nothing when query is empty string', async () => {
    const { getByTestId } = await render(
      <MediaQuery minWidth={undefined}>
        <div data-testid="content">Content</div>
      </MediaQuery>,
    );

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).not.toBeInTheDocument();
    });
  });

  test('renders nothing when no media query props are provided', async () => {
    const { getByTestId } = await render(
      <MediaQuery>
        <div data-testid="content">Content</div>
      </MediaQuery>,
    );

    await vi.waitFor(async () => {
      await expect.element(getByTestId('content')).not.toBeInTheDocument();
    });
  });
});
