import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const NavBar = () => {
  const { currentUser, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <div className="px-6 py-4">Loading...</div>;
  }

  return (
    <nav className="relative w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center z-40">
      <Link
        to="/dashboard"
        className="flex items-center gap-3 group transition-all"
      >
        <div className="bg-blue-600 p-2 rounded-lg text-white group-hover:bg-blue-700 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-200">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors duration-200">
          My Household
        </span>
      </Link>

      <div
        ref={menuRef}
        className="relative"
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 ml-20 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute top-full right-0 pt-5 pb-5 w-48 z-50">
            <div className="bg-white border border-gray-100 rounded-xl shadow-lg py-2 overflow-hidden">
              {(currentUser?.role === "admin" || currentUser?.super) && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}

              <Link
                to="/settings"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Settings
              </Link>
              <hr className="my-1 border-gray-100" />

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="w-full text-left block px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
