import { useState, useEffect, useRef, useCallback } from 'react';

type VisibilityChangeHandler = (isVisible: boolean) => void;

interface UseDocumentVisibilityReturn {
  visible: boolean;
  count: number;
  onVisibilityChange: (handler: VisibilityChangeHandler) => () => void;
}

export const useDocumentVisibility = (): UseDocumentVisibilityReturn => {
  const [visible, setVisible] = useState<boolean>(!document.hidden);
  const [count, setCount] = useState<number>(0);

  const handlersRef = useRef<Set<VisibilityChangeHandler>>(new Set());

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setVisible(isVisible);
      if (!isVisible) setCount((prev) => prev + 1);

      handlersRef.current.forEach((handler) => {
        handler(isVisible);
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const onVisibilityChange = useCallback((handler: VisibilityChangeHandler) => {
    handlersRef.current.add(handler);

    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  return {
    visible,
    count,
    onVisibilityChange,
  };
};
