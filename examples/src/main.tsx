import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { HashRouter, Route, Routes } from 'react-router';
import { DocumentVisibilityHookPage } from './pages/document-visibility-hook-page.tsx';
import { MediaQueryHookPage } from './pages/media-query-hook-page.tsx';
import { MediaQueryComponentPage } from './pages/media-query-component-page.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<App />} index />
        <Route path="/document-visibility-hook" element={<DocumentVisibilityHookPage />} />
        <Route path="/media-query-hook" element={<MediaQueryHookPage />} />
        <Route path="/media-query-component" element={<MediaQueryComponentPage />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
);
