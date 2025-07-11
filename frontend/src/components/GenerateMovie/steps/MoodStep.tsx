"use client"
import { motion } from "framer-motion";  // Adding framer-motion for animations

const MOODS = [
  { name: "Happy", emoji: "😊", color: "from-yellow-500 to-orange-500" },
  { name: "Sad", emoji: "😢", color: "from-blue-500 to-indigo-500" },
  { name: "Excited", emoji: "🤩", color: "from-pink-500 to-red-500" },
  { name: "Scary", emoji: "😱", color: "from-purple-500 to-gray-800" },
  { name: "Romantic", emoji: "💕", color: "from-rose-500 to-pink-500" },
]

type Props = {
  value: string
  onChange: (m: string) => void
}

export default function MoodStep({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">What's your mood?</h2>
        <p className="text-gray-400">Choose the mood that matches how you're feeling right now</p>
      </div>
  <motion.div

              className="movie-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {MOODS.map((mood) => (
          <button
            key={mood.name}
            onClick={() => onChange(mood.name)}
            className={`group relative p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
              value === mood.name
                ? "border-blue-500 bg-sky-900 from-blue-600/80 to-purple-600/80 shadow-lg"
                : "border-gray-600 bg-gray-800/50 hover:border-gray-500"
            }`}
          >
            <div className="text-center space-y-2">
              <div className="text-3xl">{mood.emoji}</div>
              <div
                className={`font-medium transition-colors ${
                  value === mood.name ? "text-white" : "text-gray-300 group-hover:text-white"
                }`}
              >
                {mood.name}
              </div>
            </div>

            {value === mood.name && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
</motion.div>
      <div className="text-center">
        <p className="text-sm text-gray-500">
          <span className="text-red-400">*</span> Required field
        </p>
      </div>
    </div>
  )
}
