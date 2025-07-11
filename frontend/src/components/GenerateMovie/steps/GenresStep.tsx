"use client"
import { motion } from "framer-motion";  // Adding framer-motion for animations

const ALL_GENRES = [
  { name: "Drama", emoji: "🎭" },
  { name: "Action", emoji: "💥" },
  { name: "Comedy", emoji: "😂" },
  { name: "Horror", emoji: "👻" },
  { name: "Mystery", emoji: "🔍" },
  { name: "Romance", emoji: "💖" },
  { name: "Thriller", emoji: "😰" },
  { name: "Sci-Fi", emoji: "🚀" },
]

type Props = {
  selected: string[]
  onChange: (g: string[]) => void
}

export default function GenresStep({ selected, onChange }: Props) {
  const toggle = (genre: string) =>
    selected.includes(genre)
      ? onChange(selected.filter((x) => x !== genre))
      : selected.length < 3
        ? onChange([...selected, genre])
        : null

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Pick your genres</h2>
        <p className="text-gray-400">Select up to 3 genres you're interested in (optional)</p>
      </div>
 <motion.div

              className="movie-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ALL_GENRES.map((genre) => {
          const isSelected = selected.includes(genre.name)
          const isDisabled = !isSelected && selected.length >= 3

          return (
            <button
              key={genre.name}
              onClick={() => toggle(genre.name)}
              disabled={isDisabled}
              className={`group relative p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${
                isSelected
                  ? "border-blue-500 bg-gradient-to-br from-blue-600/80 to-purple-600/80 text-white shadow-lg bg-sky-900"
                  : isDisabled
                    ? "border-gray-700 bg-gray-800/30 text-gray-500 cursor-not-allowed"
                    : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:text-white"
              }`}
            >
              <div className="text-center space-y-1">
                <div className="text-xl">{genre.emoji}</div>
                <div className="text-sm font-medium">{genre.name}</div>
              </div>

              {isSelected && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
            </motion.div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Selected: {selected.length} / 3</span>
        {selected.length > 0 && (
          <button onClick={() => onChange([])} className="text-red-400 hover:text-red-300 transition-colors">
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}