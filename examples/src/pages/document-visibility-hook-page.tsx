import { useEffect } from 'react';
import { useDocumentVisibility } from '@g4ndy/react-hooks';

export const DocumentVisibilityHookPage = () => {
  const { count, visible, onVisibilityChange } = useDocumentVisibility();

  useEffect(() => {
    onVisibilityChange((isVisible) => {
      console.info('First handler: ', isVisible);
    });

    const unsubscribeSecondHandler = onVisibilityChange((isVisible) => {
      console.info('Second handler: ', isVisible);
    });

    setTimeout(() => unsubscribeSecondHandler(), 5000);
  }, [onVisibilityChange]);

  return (
    <div>
      <span>You have left the page {count} times</span>
      <br />
      <span>
        Is the tab active? - <span>{visible ? 'yes' : 'no'}</span>
      </span>
    </div>
  );
};
