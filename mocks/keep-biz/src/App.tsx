import '@/lib/i18n'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import { HomePage } from '@/pages/HomePage'

function App() {
  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}

export default App
