import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ProductProvider } from './context/ProductProvider.tsx'
import TransactionProvider from './context/TransactionProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ProductProvider>
        <TransactionProvider>
          <App />
        </TransactionProvider>
      </ProductProvider>
    </BrowserRouter>
  </StrictMode>,
)
