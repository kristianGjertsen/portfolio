import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import IntroanimationPage from './Pages/IntroAnimation/IntroanimationPage'
import ContactPage from './Pages/ContactPage/Contact'
import ProjectPage from './Pages/ProjectPage/ProjectPage'
import CvPage from './Pages/Cv/Cv'
import FrontPageError from './Pages/FrontPage/FrontPageError'

import "./languages/LanguageText"

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<IntroanimationPage />} path="/" />
        <Route element={<ProjectPage />} path="/project" />
        <Route element={<ContactPage />} path="/contact" />
        <Route element={<CvPage />} path="/cv" />
        {/* Mukighet for å se error siden direkte, finnes ikke knapp for dette på nettsiden */}
        <Route element={<FrontPageError />} path="/errorSite" />
      </Routes>
    </>
  )
}

export default App
