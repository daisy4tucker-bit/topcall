import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Restore redirected route on static host hard refresh if captured
if (typeof window !== 'undefined') {
  try {
    const redirectPath = sessionStorage.getItem('spa_redirect_path');
    if (redirectPath && redirectPath !== '/' && window.location.pathname === '/') {
      sessionStorage.removeItem('spa_redirect_path');
      window.history.replaceState(null, '', redirectPath);
    }
  } catch (e) {}
}

createRoot(document.getElementById('root')!).render(<App />);
