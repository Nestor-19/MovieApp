import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  // Example: user credits fetched or passed as props
  const backendUrl = process.env.NEXT_PUBLIC_URL_LOCAL_BACKEND;
  const router = useRouter();
  const [userCredits, setUserCredits] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false); // To manage the state of search pane/modal
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false); // Dropdown for profile

  useEffect(() => {
    const fetchCredits = async () => {
      await new Promise((r) => setTimeout(r, 500));
      setUserCredits(42); // Replace with real credits
    };
    fetchCredits();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearchPane = () => {
    setSearchOpen(!searchOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${backendUrl}/api/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.log(error)
    } finally {
      router.push("/")
    }
  }

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
              <div
                className="text-white bg-purple-700 px-3 py-1 rounded-md font-semibold flex items-center space-x-2"
                aria-label="Search"
                title="Search"
                onClick={toggleSearchPane}
              >
                <img
                  src="/navIcons/search.png"
                  alt="Search"
                  className="w-5 h-5 mr-2"
                />
                Search
              </div>
            </li>
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
                    alt="Wishlist"
                    className="w-5 h-5 mr-2"
                  />
                  Wishlist
                </div>
              </a>
            </li>

              {/* User credits display */}
          <a href="/buyCredits" className="no-underline">
            <div
              className="text-white bg-pink-700 px-3 py-1 rounded-md font-semibold flex items-center space-x-2"
              aria-label="User credits"
              title="Your available credits"
            >
              <img src="/icons/coin.png" alt="Coin" className="w-5 h-5" />
              <span>Credits Left: {userCredits}</span>
            </div>
          </a>

            {/* Profile Dropdown */}
            <li className="relative">
              <div

                onClick={toggleProfileDropdown}
                className="text-white bg-blue-600 px-3 py-1 rounded-md font-semibold flex items-center space-x-2"
              >
                <img
                  src="/navIcons/profileIcon.png"
                  alt="Profile"
                  className="w-5 h-5 mr-2"
                  
                />
                Profile
              </div>
              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute top-12 right-0 bg-white shadow-lg rounded-md w-48 z-50">
                  <ul>
                    <li>
                        <a className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                          View Profile
                        </a>
                    </li>
                    <li>
                        <a className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                          Settings
                        </a>
                    </li>
                    <li>
                        <a className="block px-4 py-2 text-gray-700 hover:bg-gray-200" onClick={handleLogout}> 
                          Logout 
                        </a>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>

        
        </div>
      </nav>

      {/* Search Pane/Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={toggleSearchPane}
        >
          <div
            className="bg-thio from-slate-800 to-black p-6 rounded-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-white">Search Movies</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Type movie name..."
              className="w-4/5 p-2 border border-gray-300 rounded-md"
            />
            <div className="mt-4 flex justify-start">
              <button
                onClick={toggleSearchPane}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Close
              </button>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
