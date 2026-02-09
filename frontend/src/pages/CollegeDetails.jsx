import { useParams } from "react-router-dom";
import { colleges } from "../data/colleges";

export default function CollegeDetails() {
  const { id } = useParams();

  const college = colleges.find((c) => c.id === Number(id));

  if (!college) {
    return (
      <div className="pt-32 text-center text-white">
        College not found.
      </div>
    );
  }

  return (
    <section className="pt-32 px-6 max-w-5xl mx-auto">

      <h1 className="text-4xl font-bold mb-4">{college.name}</h1>

      <p className="text-white/60 mb-6">
        {college.city} • {college.type}
      </p>

      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10">

        <h3 className="text-xl mb-3">Courses Offered</h3>
        <ul className="list-disc ml-6">
          {college.courses.map((course) => (
            <li key={course}>{course}</li>
          ))}
        </ul>

        <p className="mt-6">
          <span className="font-semibold">Fees:</span> ₹{college.fees}
        </p>

      </div>

    </section>
  );
}
