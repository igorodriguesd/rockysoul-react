import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

let resizeTimer: ReturnType<typeof setTimeout>

(function initTheme() {
  try {
    const t = localStorage.getItem('rocky_theme')
    if (t !== 'light' && t !== 'dark') return
    document.documentElement.dataset.theme = t
    document.documentElement.style.colorScheme = t
  } catch {
    /* armazenamento indisponível */
  }
})()

window.addEventListener('resize', () => {
  document.documentElement.classList.add('resizing')
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => document.documentElement.classList.remove('resizing'), 180)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)