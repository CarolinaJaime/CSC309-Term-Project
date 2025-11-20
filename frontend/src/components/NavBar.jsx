import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", to: "/" },
    { name: "Events", to: "/events" },
    { name: "Transactions", to: "/transactions" },
  ];

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authTokenExpiresAt");
    navigate("/login", { replace: true });
  }

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <Link to="/" className="text-xl font-bold text-pink-600">
          MyApp
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 items-center">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="font-medium hover:text-pink-600 transition"
            >
              {item.name}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <div>X</div> : <div>Menu</div>}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-md">
          <div className="flex flex-col px-4 py-2 space-y-2">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-2 font-medium border-b last:border-none hover:text-pink-600"
              >
                {item.name}
              </Link>
            ))}

            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="py-2 text-left font-medium text-red-600 border-b last:border-none"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
