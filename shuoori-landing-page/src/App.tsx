import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/Landing"
import ContactPage from "./pages/Contact"
import { localeMeta, type Locale } from "./i18n"

function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem("shuoori-locale") as Locale | null
    return saved || "en"
  })

  useEffect(() => {
    const meta = localeMeta[locale]
    document.documentElement.lang = locale
    document.documentElement.dir = meta.dir
    localStorage.setItem("shuoori-locale", locale)
  }, [locale])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg">
        <Routes>
          <Route path="/" element={<LandingPage locale={locale} setLocale={setLocale} />} />
          <Route path="/contact" element={<ContactPage locale={locale} setLocale={setLocale} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
