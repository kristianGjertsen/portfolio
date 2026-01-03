import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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

function MetaUpdater() {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const siteUrl = 'https://kristiangjertsen.no'
    const lang = i18n.language.startsWith('en') ? 'en' : 'no'
    const locale = lang === 'en' ? 'en_US' : 'nb_NO'
    const metaByPath = {
      '/': {
        title: t('seo.site_title'),
        description: t('frontpage.description'),
      },
      '/project': {
        title: `${t('frontpage.title')} - ${t('projectPage.title')}`,
        description: t('projectPage.description'),
      },
      '/contact': {
        title: `${t('frontpage.title')} - ${t('contactPage.title')}`,
        description: t('contactPage.description'),
      },
      '/cv': {
        title: `${t('frontpage.title')} - CV`,
        description: t('seo.cv_description'),
      },
      '/errorSite': {
        title: t('seo.error_title'),
        description: t('frontpageError.description'),
      },
    }
    const meta = metaByPath[pathname as keyof typeof metaByPath] ?? metaByPath['/']
    const canonicalUrl = `${siteUrl}${pathname === '/' ? '/' : pathname}`

    document.title = meta.title
    document.documentElement.setAttribute('lang', lang)

    const setMetaContent = (selector: string, content: string) => {
      const element = document.querySelector(selector)
      if (element) {
        element.setAttribute('content', content)
      }
    }

    const setLinkHref = (selector: string, href: string) => {
      const element = document.querySelector(selector)
      if (element) {
        element.setAttribute('href', href)
      }
    }

    setMetaContent('meta[name="description"]', meta.description)
    setMetaContent('meta[property="og:title"]', meta.title)
    setMetaContent('meta[property="og:description"]', meta.description)
    setMetaContent('meta[property="og:url"]', canonicalUrl)
    setMetaContent('meta[property="og:locale"]', locale)
    setMetaContent('meta[name="twitter:title"]', meta.title)
    setMetaContent('meta[name="twitter:description"]', meta.description)
    setLinkHref('link[rel="canonical"]', canonicalUrl)
  }, [pathname, i18n.language, t])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <MetaUpdater />
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
