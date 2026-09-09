import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

let resizeTimer: ReturnType<typeof setTimeout>

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