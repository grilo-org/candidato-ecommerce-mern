import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, UserPlus, LogOut, LogIn, Lock } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-red-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link
            to={"/"}
            className="text-2xl font-bold text-red-600 items-center space-x-2 flex hover:text-red-800 transition duration-200 ease-in-out"
          >
            Z-Store
          </Link>

          <nav className="flex flex-warp items-center gap-4 font-semibold">
            <Link
              to={"/"}
              className="text-gray-300 font-bold hover:text-red-500 transition duration-300 ease-in-out"
            >
              Home
            </Link>
            {user && (
              <Link
                to={"/cart"}
                className="relative group text-gray-300 hover:text-red-400 transition duration-300 ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-red-400"
                  size={20}
                />
                <span className="hidden sm-inline">Cart</span>
                {cart.length > 0 && <span className="absolute -top-2 -left-2 bg-gray-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-red-400 transition duration-300 ease-in-out">
                  {cart.length}
                </span>}
              </Link>
            )}

            {isAdmin && (
              <Link
                className="bg-red-800 hover:bg-red-500 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
                to={"/secret-dashboard"}
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hiddend sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out cursor-pointer"
                onClick={logout}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-gray-700 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  <span>Sign Up</span>
                </Link>

                <Link
                  to={"/login"}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  <span>Login</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
