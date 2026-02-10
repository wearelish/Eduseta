import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/" className="text-xl font-bold">
          Eduseta
        </Link>

        <div className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-blue-400">
            Home
          </Link>
          <Link to="/compare" className="hover:text-blue-400">
            Compare
          </Link>
        </div>

      </div>
    </nav>
  );
}
