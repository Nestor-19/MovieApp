"use client"

import { useState, useEffect } from "react"

type Props = {
  selected: string[]
  onChange: (a: string[]) => void
}

export default function ActorsStep({ selected, onChange }: Props) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const backendUrl = process.env.NEXT_PUBLIC_URL_LOCAL_BACKEND

  // ❶ Fetch actor names as user types
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    const timeoutId = setTimeout(() => {
      fetch(
        `${backendUrl}/api/actors?search=${query}`, // TODO: Implement this Endpoint
        { credentials: "include" },
      )
        .then((r) => r.json())
        .then((data: { fullName: string }[]) => setSuggestions(data.map((a) => a.fullName)))
        .catch(console.error)
        .finally(() => setLoading(false))
    }, 300) // Debounce

    return () => clearTimeout(timeoutId)
  }, [query, backendUrl])

  const add = (name: string) => {
    if (!selected.includes(name)) {
      onChange([...selected, name])
      setQuery("")
      setSuggestions([])
    }
  }

  const remove = (name: string) => {
    onChange(selected.filter((actor) => actor !== name))
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Favorite actors</h2>
        <p className="text-gray-400">Search and add actors you'd like to see (optional)</p>
      </div>

      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            placeholder="Type actor name..."
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-sm"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</div>
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-48 overflow-auto">
            {suggestions.map((name) => (
              <button
                key={name}
                onClick={() => add(name)}
                className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
              >
                <div className="flex items-center space-x-2">
                  <span>⭐</span>
                  <span>{name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Selected Actors</h3>
            <button onClick={() => onChange([])} className="text-red-400 hover:text-red-300 text-sm transition-colors">
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selected.map((name) => (
              <div
                key={name}
                className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm shadow-md"
              >
                <span className="mr-2">⭐</span>
                <span>{name}</span>
                <button onClick={() => remove(name)} className="ml-2 hover:text-red-300 transition-colors font-bold">
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {query.length > 0 && query.length < 2 && (
        <p className="text-sm text-gray-500 text-center">Type at least 2 characters to search for actors</p>
      )}
    </div>
  )
}
