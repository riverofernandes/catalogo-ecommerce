import React from "react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove o token do localStorage
    navigate("/login"); // Redireciona para a página de login
  };

  const isLoggedIn = !!localStorage.getItem("token"); // Verifica se o token existe

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Catálogo E-commerce
      </h1>
      <div className="flex items-center space-x-4">
        {isLoggedIn && (
          <button
            onClick={() => navigate("/admin")}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          >
            Admin
          </button>
        )}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;