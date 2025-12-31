import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppProviders from './providers/AppProviders'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import ChatPage from './pages/ChatPage'


function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />

          {/* protected routes */}
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  )
}

export default App
