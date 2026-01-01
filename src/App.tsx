import { Navigate, Route, Routes } from 'react-router-dom'
import IntroanimationPage from './Pages/IntroAnimation/IntroanimationPage'
import ContactPage from './Pages/ContactPage/Contact'
import ProjectPage from './Pages/ProjectPage/ProjectPage'
import "./languages/LanguageText"

function App() {
  return (
    <Routes>
      <Route element={<IntroanimationPage />} path="/" />
      <Route element={<Navigate to="/project" replace />} path="/portfolio" />
      <Route element={<ProjectPage />} path="/project" />
      <Route element={<ContactPage />} path="/contact" />
    </Routes>
  )
}

export default App
