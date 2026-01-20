import { ReactNode, useEffect, useMemo, useState } from 'react';
import { RequireOnlyOne } from '../types';

interface UseMediaQueryProps {
  query: string | undefined;
}

interface BaseMediaQueryProps {
  orientation?: 'landscape' | 'portrait';
  minResolution?: number | `${number}dppx`;
  maxResolution?: number | `${number}dppx`;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

type MediaQueryProps = RequireOnlyOne<BaseMediaQueryProps> & {
  children: ReactNode | ((isMatches: boolean) => ReactNode);
};

export const useMediaQuery = ({ query }: UseMediaQueryProps) => {
  const [isMatches, setIsMatches] = useState<boolean>(
    typeof window === 'undefined' || !query ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !query) return;
    const mql = window.matchMedia(query);
    // eslint-disable-next-line
    setIsMatches(mql.matches);

    const handler = (event: MediaQueryListEvent) => {
      setIsMatches(event.matches);
    };

    mql.addEventListener('change', handler);

    return () => {
      mql.removeEventListener('change', handler);
    };
  }, [query]);

  return isMatches;
};

export const MediaQuery = ({ children, ...props }: MediaQueryProps) => {
  const query = useMemo(() => {
    const queryMap: Record<keyof BaseMediaQueryProps, (val: string | number | undefined) => string> = {
      orientation: (val) => `(orientation: ${val})`,
      minResolution: (val) => `(min-resolution: ${val})`,
      maxResolution: (val) => `(max-resolution: ${val})`,
      minWidth: (val) => `(min-width: ${val}px)`,
      maxWidth: (val) => `(max-width: ${val}px)`,
      minHeight: (val) => `(min-height: ${val}px)`,
      maxHeight: (val) => `(max-height: ${val}px)`,
    };

    const key = Object.keys(props)[0]! as keyof BaseMediaQueryProps | undefined;
    if (!key) return undefined;
    return queryMap[key]?.(props[key]);
  }, [props]);

  const isMatches = useMediaQuery({ query });
  if (typeof children === 'function') return children(isMatches);
  return isMatches ? children : null;
};
