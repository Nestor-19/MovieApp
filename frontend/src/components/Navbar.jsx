import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [userCredits, setUserCredits] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCredits = async () => {
      await new Promise((r) => setTimeout(r, 500));
      setUserCredits(42);
    };
    fetchCredits();
  }, []);

  return (
    <header style={{ backgroundColor: "#384c6e" }}>
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap">
        {/* Logo */}
        <Link href="/dashboard" legacyBehavior>
          <a
            className="text-xl font-bold text-blue-400 hover:text-blue-300 no-underline cursor-pointer"
            aria-label="Go to dashboard"
          >
            MovieApp
          </a>
        </Link>

        {/* Hamburger button for mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded bg-transparent focus:outline-none"
          aria-label="Toggle menu"
          style={{ backgroundColor: "transparent" }}
        >
          <svg
            className="w-6 h-6 stroke-pink-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Menu links & credits */}
        <div
          className={`w-full md:flex md:items-center md:w-auto ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-6 space-y-3 md:space-y-0 p-0 m-0 list-none">
            {/* Added list-none here to remove bullet points */}
            <li>
              <a href="/generateMovie" className="no-underline">
                <div
                  className="text-white bg-pink-700 px-3 py-1 rounded-md font-semibold flex items-center space-x-2"
                  aria-label="Generate Movie"
                  title="Generate Movie"
                >
                  <img
                    src="/navIcons/generateMovie.png"
                    alt="Generate Movie"
                    className="w-5 h-5 mr-2"
                  />
                  Generate Movies
                </div>
              </a>
            </li>
            <li>
              <a href="/watchedList" className="no-underline">
                <div
                  className="text-white bg-orange-500 px-3 py-1 rounded-md font-semibold flex items-center space-x-2"
                  aria-label="Watched List"
                  title="Watched List"
                >
                  <img
                    src="/navIcons/watchedList.png"
                    alt="Watched List"
                    className="w-5 h-5 mr-2"
                  />
                  Watched List
                </div>
              </a>
            </li>
            <li>
              <a href="/wishlist" className="no-underline">
                <div
                  className="text-white bg-green-500 px-3 py-1 rounded-md font-semibold flex items-center space-x-2"
                  aria-label="Wishlist"
                  title="Wishlist"
                >
                  <img
                    src="/navIcons/wishlist.png"
                    alt="wishlist"
                    className="w-5 h-5 mr-2"
                  />
                  Wishlist
                </div>
              </a>
            </li>
          </ul>

          {/* User credits display */}
          <a href="/buyCredits" className="no-underline mt-4 md:mt-0 md:ml-6 block">
            <div
              className="text-white bg-pink-700 px-3 py-1 rounded-md font-semibold flex items-center space-x-2"
              aria-label="User credits"
              title="Your available credits"
            >
              <img src="/icons/coin.png" alt="Coin" className="w-5 h-5" />
              <span>Credits Left: {userCredits}</span>
            </div>
          </a>
        </div>
      </nav>
    </header>
  );
}
