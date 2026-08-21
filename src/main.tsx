import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
if (favicon) favicon.href = `${import.meta.env.BASE_URL}Logo.png`

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
