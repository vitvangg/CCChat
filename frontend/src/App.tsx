import { BrowserRouter, Routes, Route } from 'react-router'
import { Toaster } from 'sonner'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import ChatPage from './pages/ChatPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useThemeStore } from './stores/useThemeStore'
import { useEffect } from 'react'

function App() {
  const { isDark, setTheme } = useThemeStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  return (
    <>
      <Toaster richColors/>
      <BrowserRouter>
        <Routes>
          {/** Public Routes */}
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />

          {/** Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App