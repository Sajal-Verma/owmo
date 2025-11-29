import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './TellWind.css'
import App from './App.jsx'
import StoreProvider from './context/StoreProvider' // import your context provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>  {/* Wrap App with provider */}
      <App />
    </StoreProvider>
  </StrictMode>
)
