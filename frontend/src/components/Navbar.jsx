import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  // Example: user credits fetched or passed as props
  // Replace this with your actual data source!
  const [userCredits, setUserCredits] = useState(0);

  // Simulate fetching user credits on mount (replace with real fetch)
  useEffect(() => {
    // Example: fetch credits from API or context
    const fetchCredits = async () => {
      // Fake delay and set credits
      await new Promise((r) => setTimeout(r, 500));
      setUserCredits(42); // Replace with real credits
    };
    fetchCredits();
  }, []);

  return (
    <header style={{ backgroundColor: "#384c6e" }}>
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" legacyBehavior>
          <a
            className="text-xl font-bold text-blue-400 hover:text-blue-300 no-underline cursor-pointer"
            aria-label="Go to dashboard"
          >
            MovieApp
          </a>
        </Link>

        {/* Right-side links and credits */}
        <div className="flex items-center space-x-6">
          <ul className="flex items-center list-none p-0 m-0 space-x-6">
            <li>
              <a
                href="/generateMovie"
                className="text-white hover:text-yellow-500 transition"
              >
                Generate Movie
              </a>
            </li>
            <li>
              <a
                href="/watchedList"
                className="text-white hover:text-yellow-500 transition"
              >
                Watched List
              </a>
            </li>
            <li>
              <a
                href="/generateMovie"
                className="text-white hover:text-yellow-500 transition"
              >
                WishList
              </a>
            </li>
            <li>
              <a
                href="/actors"
                className="text-white hover:text-yellow-500 transition"
              >
                Actors
              </a>
            </li>
          </ul>

          {/* User credits display */}

          <a href="/buyCredits">
                 <div
  className="text-white bg-blue-700 px-3 py-1 rounded-md font-semibold flex items-center space-x-2"
  aria-label="User credits"
  title="Your available credits"
>
  <img src="/icons/coin.png" alt="Coin" className="w-5 h-5" />
  <span>Credits Lefts: {userCredits}</span>
</div>
          </a>

        </div>
      </nav>
    </header>
  );
}
