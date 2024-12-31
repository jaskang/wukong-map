import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import App from './App.tsx'

import './index.css'
import Button from './docs/button.mdx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index path="button" element={<Button />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
