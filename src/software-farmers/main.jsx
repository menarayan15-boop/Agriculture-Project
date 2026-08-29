import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'

// Register Service Worker for offline capability
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('[SmartFarm] New content available, please refresh.');
  },
  onOfflineReady() {
    console.log('[SmartFarm] App is ready to work offline.');
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
