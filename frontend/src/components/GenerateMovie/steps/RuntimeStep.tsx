"use client"
import { motion } from "framer-motion";  // Adding framer-motion for animations

type Props = {
  value: number
  onChange: (v: number) => void
}

export default function RuntimeStep({ value, onChange }: Props) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getTimeCategory = (minutes: number) => {
    if (minutes <= 90) return { label: "Quick Watch", emoji: "⚡", color: "text-green-400" }
    if (minutes <= 120) return { label: "Standard", emoji: "🎬", color: "text-blue-400" }
    if (minutes <= 150) return { label: "Long", emoji: "📽️", color: "text-yellow-400" }
    return { label: "Epic", emoji: "🎭", color: "text-purple-400" }
  }

  const timeCategory = getTimeCategory(value)

  return (
     <motion.div

              className="movie-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
    <div className="space-y-6 max-h-full overflow-y-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Maximum runtime</h2>
        <p className="text-gray-400">How much time do you have for a movie? (optional)</p>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 px-6 py-4 bg-gray-800/50 rounded-xl border border-gray-600">
            <span className="text-2xl">{timeCategory.emoji}</span>
            <div>
              <div className="text-3xl font-bold text-white">{formatTime(value)}</div>
              <div className={`text-sm font-medium ${timeCategory.color}`}>{timeCategory.label}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="range"
              min={30}
              max={200}
              step={5}
              value={value}
              onChange={(e) => onChange(+e.target.value)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #8b5cf6 ${((value - 30) / (200 - 30)) * 100}%, #374151 ${((value - 30) / (200 - 30)) * 100}%, #374151 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>30m</span>
              <span>1h</span>
              <span>1.5h</span>
              <span>2h</span>
              <span>2.5h</span>
              <span>3h+</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { minutes: 90, label: "Quick" },
              { minutes: 120, label: "Standard" },
              { minutes: 150, label: "Long" },
              { minutes: 180, label: "Epic" },
            ].map((preset) => (
              <button
                key={preset.minutes}
                onClick={() => onChange(preset.minutes)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  value === preset.minutes ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {formatTime(preset.minutes)}
                <div className="text-xs opacity-75">{preset.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        Perfect for{" "}
        {value <= 90
          ? "a quick evening watch"
          : value <= 120
            ? "a standard movie night"
            : value <= 150
              ? "when you have extra time"
              : "an epic movie marathon"}
      </div>
    </div>
    </motion.div>
  )
}