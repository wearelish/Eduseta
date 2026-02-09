export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-xl font-bold tracking-wide">
          Eduseta
        </h1>

        <div className="hidden md:flex gap-6 text-sm">
          <a className="hover:text-blue-400 cursor-pointer">Home</a>
          <a className="hover:text-blue-400 cursor-pointer">Colleges</a>
          <a className="hover:text-blue-400 cursor-pointer">Compare</a>
          <a className="hover:text-blue-400 cursor-pointer">Admissions</a>
        </div>

      </div>
    </nav>
  );
}
