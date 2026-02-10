import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CollegeDetails from "./pages/CollegeDetails";
import Compare from "./pages/Compare";

function App() {
  const [compareList, setCompareList] = useState([]);

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              compareList={compareList}
              setCompareList={setCompareList}
            />
          }
        />

        <Route
          path="/college/:id"
          element={<CollegeDetails />}
        />

        <Route
          path="/compare"
          element={<Compare compareList={compareList} />}
        />
      </Routes>
    </>
  );
}

export default App;
