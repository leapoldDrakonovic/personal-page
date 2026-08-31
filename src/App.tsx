import { Contact, Footer } from './components/Contact'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Skills } from './components/Skills'
import { Terminal } from './components/Terminal'
import { Work } from './components/Work'
import { ThemeProvider } from './theme'

function App() {
  return (
    <ThemeProvider>
      <a className="skip" href="#top">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Terminal />
        <Work />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  )
}

export default App
