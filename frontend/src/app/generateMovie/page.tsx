"use client"
import { useEffect, useState } from "react"
import Carousel from "@/components/GenerateMovie/Carousel"
import Link from "next/link"

export interface WatchListItemDto {
  movieid: string
  title: string
  description: string
  image: string
  runTime: number
  rating: number
  liked: boolean | null
}

export default function GenerateMoviePage() {
  const [watchlist, setWatchlist] = useState<WatchListItemDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const backendUrl = process.env.NEXT_PUBLIC_URL_LOCAL_BACKEND

  // ❶ On mount, fetch the user's watchlist
  useEffect(() => {
    fetch(`${backendUrl}/api/watchlist`, {
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch watchlist")
        return r.json()
      })
      .then((data: WatchListItemDto[]) => setWatchlist(data))
      .catch((err) => {
        console.error(err)
        setError("Failed to load your watchlist. Please try again.")
      })
      .finally(() => setLoading(false))
  }, [backendUrl])

  // Check if user has enough rated movies
  const ratedMovies = watchlist.filter((movie) => movie.liked !== null)
  const hasEnoughRatedMovies = ratedMovies.length >= 8

  // ❂ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-300 text-lg">Loading your watchlist...</p>
        </div>
      </div>
    )
  }

  // ❸ Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 text-center max-w-md">
          <div className="text-red-400 text-5xl mb-4">⚠</div>
          <h2 className="text-xl font-bold text-red-400 mb-2">Oops!</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // ❹ Insufficient watchlist state
  if (!hasEnoughRatedMovies) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center max-w-lg">
          <div className="text-6xl mb-6">🎬</div>
          <h2 className="text-2xl font-bold text-white mb-4">Almost Ready for Recommendations!</h2>
          <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Rated Movies:</span>
              <span className={`font-bold ${ratedMovies.length >= 8 ? "text-green-400" : "text-yellow-400"}`}>
                {ratedMovies.length} / 8
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((ratedMovies.length / 8) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-300 mb-6 leading-relaxed">
            You need at least <span className="text-blue-400 font-bold">8 rated movies</span> in your watchlist to
            generate personalized recommendations. Rate more movies by liking or disliking them!
          </p>
          <Link
            href="/watchedList"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            <span className="mr-2">📝</span>
            Rate Your Movies
          </Link>
        </div>
      </div>
    )
  }

  // ❺ All good—render the carousel
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Generate Movie Recommendations
          </h1>
          <p className="text-gray-400 text-lg">
            Tell us what you're in the mood for, and we'll find the perfect movie for you
          </p>
        </div>
        <Carousel watchlist={watchlist} />
      </div>
    </div>
  )
}