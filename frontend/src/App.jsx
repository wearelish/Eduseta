import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CollegeDetails from "./pages/CollegeDetails";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/college/:id" element={<CollegeDetails />} />
      </Routes>
    </>
  );
}

export default App;
