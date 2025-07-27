"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";
import MoodStep from "./steps/MoodStep"
import GenresStep from "./steps/GenresStep"
import ActorsStep from "./steps/ActorsStep"
import RuntimeStep from "./steps/RuntimeStep"
import { motion } from "framer-motion";  // Adding framer-motion for animations
import { useRecommendations } from "@/hooks/useRecommendations"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useRecStore } from "@/hooks/useRecStore"


export interface GenerateForm {
  mood: string
  genres: string[]
  actors: string[]
  maxRuntime: number
}

type Props = {
  watchlist: { movieid: string; liked: boolean | null }[]
}

const steps = [
  { id: "mood", label: "Mood", icon: "🎭", description: "How are you feeling?" },
  { id: "genres", label: "Genres", icon: "🎬", description: "Pick your favorites" },
  { id: "actors", label: "Actors", icon: "⭐", description: "Any preferred stars?" },
  { id: "runtime", label: "Runtime", icon: "⏱️", description: "How much time do you have?" },
]

export default function Carousel({ watchlist }: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(0)
  const backendUrl = process.env.NEXT_PUBLIC_URL_LOCAL_BACKEND;
  const {user, loading: userLoading} = useCurrentUser();
  const {fetchRecs, loading, error, data} = useRecommendations();
  const { setMovies } = useRecStore();

  const [form, setForm] = useState<GenerateForm>({
    mood: "",
    genres: [],
    actors: [],
    maxRuntime: 120,
  })

  const goNext = () => setCurrent((i) => Math.min(i + 1, steps.length - 1))
  const goBack = () => setCurrent((i) => Math.max(i - 1, 0))

  const submit = async () => {
    if (!user) return;
    console.log(`Get your Recommendations ${user?.firstName}!`);

    try {
      const result = await fetchRecs({
        user_id: user.email,
        mood: form.mood,
        genres: form.genres,
        actors: form.actors,
        max_runtime: form.maxRuntime
      })

      console.log(result)
      setMovies(result.movies)
      router.push("/recommendations")
    } catch(e) {
      console.log(e)
    }
  };

  const progress = ((current + 1) / steps.length) * 100

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-white text-lg animate-pulse">Generating your movie picks... 🎥</div>
        </div>
      )}
   <motion.div

              className="movie-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 space-y-8 shadow-2xl">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>
              Step {current + 1} of {steps.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-between">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={`flex flex-col items-center space-y-2 transition-all duration-300 ${
                i <= current ? "opacity-100" : "opacity-50"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                  i === current
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-110"
                    : i < current
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-gray-400"
                }`}
              >
                {i < current ? "✓" : step.icon}
              </div>
              <div className="text-center">
                <div
                  className={`text-sm font-medium ${
                    i === current ? "text-white" : i < current ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </div>
                {i === current && <div className="text-xs text-gray-400 mt-1">{step.description}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[300px] bg-gray-900/30 rounded-xl p-6 border border-gray-700/50">
          <div className="transition-all duration-300 ease-in-out">
            {current === 0 && <MoodStep value={form.mood} onChange={(m) => setForm((f) => ({ ...f, mood: m }))} />}
            {current === 1 && (
              <GenresStep selected={form.genres} onChange={(g) => setForm((f) => ({ ...f, genres: g }))} />
            )}
            {current === 2 && (
              <ActorsStep selected={form.actors} onChange={(a) => setForm((f) => ({ ...f, actors: a }))} />
            )}
            {current === 3 && (
              <RuntimeStep value={form.maxRuntime} onChange={(r) => setForm((f) => ({ ...f, maxRuntime: r }))} />
            )}
          </div>
        </div>
        
        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-900/60 border border-red-500 text-red-200 rounded">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={goBack}
            disabled={current === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            <span>←</span>
            <span>Previous</span>
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-400">
              {current < steps.length - 1 ? "Continue to next step" : ""}
            </div>
          </div>

          {current < steps.length - 1 ? (
            <button
              onClick={goNext}
              disabled={current === 0 && form.mood === ""}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              <span>Next</span>
              <span>→</span>
            </button>
          ) : (
            <button
              onClick={submit}
              className="flex items-center w-45 space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <span>🎯</span>
              <span>Generate Movies</span>
            </button>
          )}
        </div>
      </div>
      </motion.div>
    </>
  )
}
