import { useEffect, useMemo, useState } from 'react'

function useBackendBaseUrl() {
  return useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
}

function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-white/70 border-b border-emerald-100">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-emerald-500 text-white grid place-items-center font-bold">茶</span>
          <span className="text-xl font-semibold text-emerald-900">Midori Teehaus</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-emerald-800">
          <a href="#menu" className="hover:text-emerald-600">Menu</a>
          <a href="#about" className="hover:text-emerald-600">About</a>
          <a href="#visit" className="hover:text-emerald-600">Visit</a>
          <a href="#contact" className="px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Contact</a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="home" className="relative pt-28 md:pt-32 pb-16 md:pb-24 bg-gradient-to-b from-emerald-50 to-white overflow-hidden">
      <div className="absolute -top-20 -right-20 h-64 w-64 bg-emerald-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-emerald-100 rounded-full blur-3xl opacity-60"></div>
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-emerald-900">
              Serene sips. Hand-crafted matcha. Cozy moments.
            </h1>
            <p className="mt-4 text-emerald-800/80 leading-relaxed">
              Welcome to Midori Teehaus — your neighborhood destination for premium Japanese teas,
              specialty coffee, and freshly baked treats. Settle in and stay awhile.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#menu" className="px-5 py-2.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
                View Menu
              </a>
              <a href="#visit" className="px-5 py-2.5 rounded-md bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                Plan Your Visit
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-tr from-emerald-200 via-emerald-100 to-white p-4">
              <div className="h-full w-full rounded-xl bg-white shadow-xl grid place-items-center">
                <div className="text-center p-6">
                  <div className="mx-auto h-24 w-24 rounded-full bg-emerald-500/10 grid place-items-center">
                    <span className="text-4xl">🍵</span>
                  </div>
                  <p className="mt-4 text-emerald-900 font-semibold">Whisked fresh, daily.</p>
                  <p className="text-emerald-700/80 text-sm">Ceremonial-grade matcha & single-origin teas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {['All', ...categories].map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-3 py-1.5 rounded-full border ${active === cat ? 'bg-emerald-600 text-white border-emerald-600' : 'border-emerald-200 text-emerald-800 hover:bg-emerald-50'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  )}

function MenuCard({ item }) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold text-emerald-900">{item.name}</h4>
          {item.description && (
            <p className="text-sm text-emerald-700/80 mt-1">{item.description}</p>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{t}</span>
              ))}
            </div>
          )}
        </div>
        <div className="text-emerald-900 font-bold">${Number(item.price).toFixed(2)}</div>
      </div>
    </div>
  )
}

function Menu() {
  const baseUrl = useBackendBaseUrl()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCat, setActiveCat] = useState('All')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${baseUrl}/api/menu`)
        const data = await res.json()
        setItems(Array.isArray(data.items) ? data.items : [])
      } catch (e) {
        setError('Unable to load menu right now.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [baseUrl])

  const categories = useMemo(() => {
    const set = new Set(items.map(i => i.category).filter(Boolean))
    return Array.from(set)
  }, [items])

  const visible = useMemo(() => {
    return activeCat === 'All' ? items : items.filter(i => i.category === activeCat)
  }, [items, activeCat])

  return (
    <section id="menu" className="py-16 md:py-20 bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-900">Menu</h2>
            <p className="text-emerald-800/80 mt-1">Signature matcha, artisanal teas, and house-made pastries.</p>
          </div>
          <CategoryTabs categories={categories} active={activeCat} onChange={setActiveCat} />
        </div>
        {loading ? (
          <p className="text-emerald-700">Loading menu…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : visible.length === 0 ? (
          <p className="text-emerald-700">Menu coming soon. Check back shortly!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((item) => (
              <MenuCard key={item._id || item.name} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="py-16 md:py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-900">Our Story</h2>
        <p className="mt-4 text-emerald-800/80 leading-relaxed">
          Inspired by the calm of tea houses in Kyoto, Midori Teehaus blends Japanese tea traditions with
          a modern, neighborhood vibe. We whisk ceremonial-grade matcha to order and pair it with
          carefully sourced teas, espresso, and seasonal pastries baked every morning.
        </p>
      </div>
    </section>
  )
}

function Visit() {
  return (
    <section id="visit" className="py-16 md:py-20 bg-emerald-50">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-900">Visit Us</h2>
          <div className="mt-4 text-emerald-800/90 space-y-2">
            <p>123 Midori Lane, Green District</p>
            <p>Open daily: 8:00 – 18:00</p>
            <p>Weekend Brunch: 9:00 – 14:00</p>
          </div>
          <div className="mt-6 p-4 rounded-xl bg-white border border-emerald-100">
            <p className="text-sm text-emerald-700/80">Tip: Try our signature Matcha Latte with oat milk and a yuzu croissant.</p>
          </div>
        </div>
        <div className="h-64 md:h-full rounded-xl overflow-hidden border border-emerald-100">
          <div className="w-full h-full bg-emerald-200 grid place-items-center text-emerald-900">
            <span className="font-semibold">Map placeholder</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const baseUrl = useBackendBaseUrl()
  const [form, setForm] = useState({ name: '', email: '', message: '', subject: '' })
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus({ state: 'loading', message: 'Sending…' })
    try {
      const res = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to send')
      const data = await res.json()
      if (data.ok) {
        setStatus({ state: 'success', message: 'Thanks! We will get back to you soon.' })
        setForm({ name: '', email: '', message: '', subject: '' })
      } else {
        setStatus({ state: 'error', message: 'Something went wrong.' })
      }
    } catch (err) {
      setStatus({ state: 'error', message: 'Unable to send right now.' })
    }
  }

  return (
    <section id="contact" className="py-16 md:py-20 bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-900 text-center">Get in touch</h2>
        <p className="text-center mt-2 text-emerald-800/80">Questions, catering, or collaborations — we’d love to hear from you.</p>
        <form onSubmit={onSubmit} className="mt-8 grid gap-4 bg-white p-6 rounded-xl border border-emerald-100">
          <div className="grid md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={onChange} placeholder="Your name" required className="w-full rounded-md border border-emerald-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email address" required className="w-full rounded-md border border-emerald-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <input name="subject" value={form.subject} onChange={onChange} placeholder="Subject (optional)" className="w-full rounded-md border border-emerald-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          <textarea name="message" value={form.message} onChange={onChange} placeholder="Your message" required rows={5} className="w-full rounded-md border border-emerald-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          <div className="flex items-center gap-3">
            <button disabled={status.state === 'loading'} className="px-5 py-2.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
              {status.state === 'loading' ? 'Sending…' : 'Send message'}
            </button>
            {status.message && (
              <span className={`${status.state === 'success' ? 'text-emerald-700' : status.state === 'error' ? 'text-red-600' : 'text-emerald-700'}`}>{status.message}</span>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-10 bg-white border-t border-emerald-100">
      <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-emerald-800/80">© {new Date().getFullYear()} Midori Teehaus. All rights reserved.</p>
        <div className="flex items-center gap-4 text-emerald-800">
          <a href="#menu" className="hover:text-emerald-600">Menu</a>
          <a href="#visit" className="hover:text-emerald-600">Visit</a>
          <a href="#contact" className="hover:text-emerald-600">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen text-emerald-900 bg-white">
      <Navbar />
      <main>
        <Hero />
        <Menu />
        <About />
        <Visit />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
