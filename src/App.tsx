import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { aggregateSearch } from './services/aggregate'
import type { SearchResult } from './types'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const hasQuery = useMemo(() => query.trim().length > 0, [query])

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!hasQuery) return
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    setError(null)
    try {
      const r = await aggregateSearch(query, controller.signal)
      setResults(r)
    } catch (err: any) {
      setError(err?.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">6<span>oogle</span></div>
        <form className="search" onSubmit={onSubmit}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the web"
            aria-label="Search"
          />
          <button type="submit" disabled={!hasQuery || loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
      </header>

      <main className="results">
        {error && <div className="error">{error}</div>}
        {!loading && results.length === 0 && (
          <div className="empty">Try searching for something like "React hooks"</div>
        )}
        {results.map((r) => (
          <article key={r.id} className="result">
            <a href={r.url} target="_blank" rel="noreferrer" className="title">
              {r.title}
            </a>
            <div className="meta">
              <span className={`badge ${r.source}`}>{r.source}</span>
              <a className="link" href={r.url} target="_blank" rel="noreferrer">
                {r.url}
              </a>
            </div>
            {r.snippet && <p className="snippet">{r.snippet}</p>}
          </article>
        ))}
      </main>
    </div>
  )
}

export default App
