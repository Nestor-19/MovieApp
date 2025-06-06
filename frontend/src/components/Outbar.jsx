export default function Outbar() {
  return (
    <header style={{ backgroundColor: "#384c6e" }}>
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-blue-400">MovieApp</div>

        {/* Right-side links for unauthenticated users */}
        <ul className="flex items-center list-none p-0 m-0 space-x-6">
          <li>
            <a
              href="/generateMovie"
              className="text-white hover:text-yellow-500 transition"
            >
             About us
            </a>
          </li>
          <li>
            <a
              href="/generateMovie"
              className="text-white hover:text-yellow-500 transition"
            >
              Why MovieApp
            </a>
          </li>
        
        </ul>
      </nav>
    </header>
  );
}
