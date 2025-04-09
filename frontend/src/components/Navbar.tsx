import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Separator } from "./ui/separator";
import { DnaIcon } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-2 shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-semibold text-white hover:text-gray-300 transition flex items-center gap-2"
        >
          <DnaIcon className="size-6 cursor-pointer" />
          lncRNA
        </Link>

        {/* Navigation Links and Theme Toggle */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-gray-300 transition">Home</Link>
            <Separator className="bg-gray-600 h-5 w-0.5" orientation="vertical" />

            <Link to="/nussinov" className="hover:text-gray-300 transition">Nussinov</Link>
            <Separator className="bg-gray-600 h-5 w-0.5" orientation="vertical" />

            <Link to="/smithwaterman" className="hover:text-gray-300 transition">Smith-Waterman</Link>
            <Separator className="bg-gray-600 h-5 w-0.5" orientation="vertical" />

            <Link to="/DL" className="hover:text-gray-300 transition">Deep Learning</Link>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
