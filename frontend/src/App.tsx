import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Results from "./pages/Results";
import Nussinov from "./pages/Nussinov"
import SmithWaterman from "./pages/SmithWaterman"
import DL from "./pages/DL"
import "./index.css"

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/Nussinov" element={<Nussinov />} />
        <Route path="/SmithWaterman" element={<SmithWaterman />} />
        <Route path="/DL" element={<DL />} />
      </Routes>
    </div>
  );
}
