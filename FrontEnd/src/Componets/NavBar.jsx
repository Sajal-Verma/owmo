import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useState, useEffect, useContext } from "react";
import { store } from "../context/StoreProvider";

import logo from "../assets/image/SiteLogo.png";
import logo2 from "../assets/image/owmo1.png";

function NavBar() {
  const [open, setOpen] = useState(false);
  const { isLogin } = useContext(store);

  useEffect(() => {
    const closeMenu = () => setOpen(false);
    window.addEventListener("scroll", closeMenu);
    return () => window.removeEventListener("scroll", closeMenu);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-[#F2F0EF]/70 backdrop-blur-md shadow-sm px-4 py-2 flex justify-between items-center">
      
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-1">
        <img src={logo} className="h-10" alt="logo" />
        <img src={logo2} className="h-5 pt-1" alt="owmo" />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-8 text-lg font-medium">
        <li><Link className="hover:text-[#52AB98] transition" to="/">Home</Link></li>
        <li><Link className="hover:text-[#52AB98] transition" to="/about">About</Link></li>
        <li><Link className="hover:text-[#52AB98] transition" to="/faq">FAQs</Link></li>
      </ul>

      {/* Desktop Button */}
      {isLogin ? (
        <Link to="/lala" className="hidden md:block">
          <button className="bg-[#52AB98] text-black px-5 py-2 rounded-md hover:bg-[#64d0b9] transition">
            Welcome
          </button>
        </Link>
      ) : (
        <Link to="/login" className="hidden md:block">
          <button className="bg-[#52AB98] text-black px-5 py-2 rounded-md hover:bg-[#64d0b9] transition">
            Login
          </button>
        </Link>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-3xl px-2 py-1 rounded-md border border-gray-400"
      >
        {open ? "✖" : "☰"}
      </button>

      {/* Mobile Drawer */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden animate-slideDown">
          <ul className="flex flex-col items-center py-4 space-y-5 text-lg font-medium">
            <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
            <li><Link to="/about" onClick={() => setOpen(false)}>About</Link></li>
            <li><Link to="/faq" onClick={() => setOpen(false)}>FAQs</Link></li>

            {isLogin ? (
              <Link to="/lala" onClick={() => setOpen(false)}>
                <button className="bg-[#52AB98] text-black px-6 py-2 rounded-md">
                  Welcome
                </button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}>
                <button className="bg-[#52AB98] text-black px-6 py-2 rounded-md">
                  Login
                </button>
              </Link>
            )}
          </ul>
        </div>
      )}

    </nav>
  );
}

export default NavBar;
