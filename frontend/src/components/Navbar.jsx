import Link from "next/link";

export default function Navbar() {
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

        {/* Right-side links for unauthenticated users */}
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
      </nav>
    </header>
  );
}
