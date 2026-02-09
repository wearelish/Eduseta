import { colleges } from "../data/colleges";
import CollegeCard from "../components/CollegeCard";
export default function Home() {
  return (
    <section className="pt-32 px-6 max-w-7xl mx-auto">

      <h1 className="text-5xl font-bold mb-6">
        Find the Best Colleges in Haryana
      </h1>

      <p className="text-white/70 max-w-2xl mb-10">
        Search, compare, and explore colleges by course, city, budget and type —
        built for Haryana students.
      </p>

      {/* Search Bar */}
      {/* College Grid */}
<div className="grid md:grid-cols-3 gap-6 mt-14">
  {colleges.map((college) => (
    <CollegeCard key={college.id} college={college} />
  ))}
</div>
<div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 grid md:grid-cols-4 gap-4">

        <input
          placeholder="Course (B.Tech, MBA...)"
          className="bg-black/40 p-3 rounded-xl outline-none"
        />

        <input
          placeholder="City"
          className="bg-black/40 p-3 rounded-xl outline-none"
        />

        <input
          placeholder="Max Fees (₹)"
          className="bg-black/40 p-3 rounded-xl outline-none"
        />

        <button className="bg-blue-600 hover:bg-blue-700 rounded-xl p-3 font-semibold">
          Search
        </button>

      </div>

    </section>
  );
}
