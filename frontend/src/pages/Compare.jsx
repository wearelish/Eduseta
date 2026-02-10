export default function Compare({ compareList }) {
  if (compareList.length < 2) {
    return (
      <div className="pt-32 text-center text-white">
        Select at least two colleges to compare.
      </div>
    );
  }

  return (
    <section className="pt-32 px-6 max-w-7xl mx-auto">

      <h1 className="text-4xl font-bold mb-6">
        Compare Colleges
      </h1>

      <table className="w-full border border-white/10">

        <thead>
          <tr className="bg-white/10">
            <th className="p-4 text-left">Metric</th>
            {compareList.map((c) => (
              <th key={c.id} className="p-4">
                {c.name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          <tr>
            <td className="p-4">City</td>
            {compareList.map((c) => (
              <td key={c.id} className="p-4">
                {c.city}
              </td>
            ))}
          </tr>

          <tr>
            <td className="p-4">Type</td>
            {compareList.map((c) => (
              <td key={c.id} className="p-4">
                {c.type}
              </td>
            ))}
          </tr>

          <tr>
            <td className="p-4">Fees</td>
            {compareList.map((c) => (
              <td key={c.id} className="p-4">
                ₹{c.fees}
              </td>
            ))}
          </tr>

          <tr>
            <td className="p-4">Courses</td>
            {compareList.map((c) => (
              <td key={c.id} className="p-4">
                {c.courses.join(", ")}
              </td>
            ))}
          </tr>

        </tbody>
      </table>

    </section>
  );
}
