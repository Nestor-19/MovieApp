export default function Navbar() {
  return (
    <header className="bg-pink-800">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-blue-400">MyApp</div>

        {/* Horizontal nav links */}
 <ul className="flex items-center list-none p-0 m-0">
          <li>
            <a
              href="/"
              className="text-yellow-400 hover:text-yellow-500 transition "
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/about"
              className="text-yellow-400 hover:text-yellow-500 transition"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="/contact"
              className="text-yellow-400 hover:text-yellow-500 transition"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
