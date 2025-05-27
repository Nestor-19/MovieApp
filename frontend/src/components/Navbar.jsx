export default function Navbar() {
  return (
        <header style={{ backgroundColor: '#365074' }}>
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-3xl font-bold text-white">MovieApp</div>

        {/* Horizontal nav links */}
 <ul className="flex items-center list-none p-0 ">
          <li>
            <a
              href="/"
              className="text-gray-200 hover:text-yellow-500 transition pr-3 text-2xl"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/"
              className="text-gray-200 hover:text-yellow-500 transition pr-3 text-2xl"
            >
              Generate Film
            </a>
          </li>
          <li>
            <a
              href="/watchedlist"
              className="text-gray-200 hover:text-yellow-500 transition pr-3 text-2xl"
            >
              Watched List
            </a>
          </li>
          <li>
            <a
              href="/watchlist"
              className="text-gray-200 hover:text-yellow-500 transition pr-3 text-2xl"
            >
              Watchlist
            </a>
          </li>

          <li>
            <a
              href="/logout"
              className="text-gray-200 hover:text-yellow-500 transition pr-3"
            >
              <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">
  Log out
</button>

              
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
