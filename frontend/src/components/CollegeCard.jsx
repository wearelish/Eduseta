import { Link } from "react-router-dom";

export default function CollegeCard({
  college,
  compareList,
  setCompareList,
}) {
  const toggleCompare = () => {
    if (compareList.some((c) => c.id === college.id)) {
      setCompareList(compareList.filter((c) => c.id !== college.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, college]);
    }
  };

  return (
    <div className="relative">

      <input
        type="checkbox"
        checked={compareList.some((c) => c.id === college.id)}
        onChange={toggleCompare}
        className="absolute top-4 right-4 z-10"
      />

      <Link to={`/college/${college.id}`}>

        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-blue-500 transition cursor-pointer">

          <h3 className="text-xl font-semibold mb-2">{college.name}</h3>

          <p className="text-white/60 text-sm">{college.city}</p>

          <div className="mt-3 flex gap-2 flex-wrap">
            {college.courses.map((course) => (
              <span
                key={course}
                className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded"
              >
                {course}
              </span>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center text-sm">
            <span>{college.type}</span>
            <span>₹{college.fees}</span>
          </div>

        </div>
      </Link>

    </div>
  );
}
