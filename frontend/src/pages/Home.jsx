import { useState } from "react";
import { colleges } from "../data/colleges";
import CollegeCard from "../components/CollegeCard";

export default function Home({ compareList, setCompareList }) {
  const [course, setCourse] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  const filteredColleges = colleges.filter((college) => {
    return (
      (course === "" || college.courses.includes(course)) &&
      (city === "" ||
        college.city.toLowerCase().includes(city.toLowerCase())) &&
      (type === "" || college.type === type) &&
      (budget === "" || college.fees <= Number(budget))
    );
  });

  return (
    <section className="pt-32 px-6 max-w-7xl mx-auto">

      <h1 className="text-5xl font-bold mb-6">
        Find the Best Colleges in Haryana
      </h1>

      <p className="text-white/70 max-w-2xl mb-10">
        Search, compare, and explore colleges by course, city, budget and type.
      </p>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 grid md:grid-cols-5 gap-4">

        <input
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="bg-black/40 p-3 rounded-xl outline-none"
        />

        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-black/40 p-3 rounded-xl outline-none"
        />

        <input
          type="number"
          placeholder="Max Fees"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="bg-black/40 p-3 rounded-xl outline-none"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-black/40 p-3 rounded-xl outline-none"
        >
          <option value="">All Types</option>
          <option value="Government">Government</option>
          <option value="Private">Private</option>
        </select>

        <button className="bg-blue-600 rounded-xl font-semibold">
          Search
        </button>

      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-14">
        {filteredColleges.length > 0 ? (
          filteredColleges.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              compareList={compareList}
              setCompareList={setCompareList}
            />
          ))
        ) : (
          <p className="text-white/60 col-span-3 text-center">
            No colleges match your filters.
          </p>
        )}
      </div>

    </section>
  );
}
