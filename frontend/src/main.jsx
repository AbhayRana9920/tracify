import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global fallback for broken images (e.g. wiped uploads on free tier Render)
window.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    e.target.onerror = null; // prevents infinite loop
    e.target.src = 'https://placehold.co/400x300?text=No+Image';
  }
}, true);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
