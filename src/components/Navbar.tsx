import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Info,
  Menu,
  LogIn,
  LogOut,
  X,
  ChevronDown,
  FileText,
  FileCheck,
  Package,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../img/Group 1.png";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onSearch: (searchTerm: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  onSearch,
}) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const navigate = useNavigate();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-700 lg:hidden"
              >
                <Menu size={24} />
              </button>
              <Link to="/" className="flex items-center space-x-2 ml-2">
                <img
                  src={logo}
                  alt="Unique Instruments Logo"
                  className="h-10 w-8"
                />
                <span className="text-xl font-bold text-blue-900">
                  Unique Instruments
                </span>
              </Link>
            </div>

            {/* Center - Search Bar */}
            {/* {(location.pathname === '/inventory' || location.pathname === '/products') && (
              <div className="hidden md:flex flex-1 max-w-xl mx-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={location.pathname === '/products' ? "Search products..." : "Search inventory items..."}
                    className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-red-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
            )} */}

            {/* Right side - Navigation Links */}
            <div className="flex items-center space-x-4">
              {/* About/Contact Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    document
                      .getElementById("about")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <Info size={20} />
                  <span className="hidden md:inline">About Us</span>
                </button>
              </div>

              {/* <Link 
                to="/brochures" 
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
              >
                <FileText size={20} />
                <span className="hidden md:inline">Brochures</span>
              </Link> */}

              {currentUser ? (
                <>
                  <div className="hidden lg:flex items-center space-x-4">
                    <Link
                      to="/products"
                      className={`flex items-center space-x-1 ${
                        location.pathname === "/products"
                          ? "text-red-600 border-b-2 border-red-600 pb-0.5"
                          : "text-gray-700 hover:text-red-600"
                      }`}
                    >
                      <FileCheck size={20} />
                      <span>Quotation</span>
                    </Link>
                    <Link
                      to="/inventory"
                      className={`flex items-center space-x-1 ${
                        location.pathname === "/inventory"
                          ? "text-red-600 border-b-2 border-red-600 pb-0.5"
                          : "text-gray-700 hover:text-red-600"
                      }`}
                    >
                      <Package size={20} />
                      <span>Inventory</span>
                    </Link>
                    {/* <Link 
                      to="/brochures" 
                      className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                    >
                      <FileText size={20} />
                      <span className="hidden md:inline">Brochures</span>
                    </Link>*/}
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                  >
                    <LogOut size={20} />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogIn size={20} />
                  <span className="hidden md:inline">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {(location.pathname === "/inventory" ||
          location.pathname === "/products") && (
          <div className="md:hidden px-4 pb-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={
                  location.pathname === "/products"
                    ? "Search products..."
                    : "Search inventory items..."
                }
                className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-red-500"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-md text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col py-4">
                <Link
                  to="/about"
                  className="px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  About Us
                </Link>

                <Link
                  to="/contact"
                  className="px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Contact Us
                </Link>

                {/* <Link 
                  to="/brochures" 
                  className="px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FileText size={20} className="mr-2" />
                  Brochures
                </Link> */}

                {currentUser ? (
                  <>
                    <Link
                      to="/products"
                      className="px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center lg:hidden"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <FileCheck size={20} className="mr-2" />
                      Quotation
                    </Link>
                    <Link
                      to="/inventory"
                      className="px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center lg:hidden"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Package size={20} className="mr-2" />
                      Inventory
                    </Link>
                    {/* <Link 
                      to="/brochures" 
                      className="px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center lg:hidden"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <FileText size={20} className="mr-2" />
                      Brochures
                    </Link> */}

                    <button
                      onClick={() => {
                        logout();
                        setIsSidebarOpen(false);
                      }}
                      className="px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center"
                    >
                      <LogOut size={20} className="mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <LogIn size={20} className="mr-2" />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
