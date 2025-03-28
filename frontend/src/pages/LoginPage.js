import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false); // Alterna entre login e registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Campo adicional para registro
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Estado para mensagens de sucesso
  const [errors, setErrors] = useState({}); // Estado para armazenar os erros de validação

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      // Armazena o token no localStorage
      localStorage.setItem("token", response.data.token);

      // Redireciona para a página de administração
      navigate("/admin");
    } catch (err) {
      setError("Credenciais inválidas! Verifique seu email e senha.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
      });

      // Exibe a mensagem de sucesso retornada pela API
      setSuccessMessage(response.data.message || "Registro realizado com sucesso!");
      setError(""); // Limpa mensagens de erro
      setErrors({}); // Limpa os erros de validação
      setIsRegister(false); // Alterna para a aba de login após o registro
    } catch (err) {
      if (err.response && err.response.data.data) {
        setErrors(err.response.data.data); // Define os erros retornados pela API
      } else {
        setError(err.response?.data?.message || "Erro ao registrar. Verifique os dados e tente novamente.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{isRegister ? "Registrar" : "Login"}</h1>
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form
        onSubmit={isRegister ? handleRegister : handleLogin}
        className="max-w-md mx-auto"
      >
        {isRegister && (
          <div className="mb-4">
            <label className="block text-gray-700">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg p-2 w-full"
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg p-2 w-full"
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg p-2 w-full"
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isRegister ? "Registrar" : "Entrar"}
        </button>
      </form>
      <div className="mt-4 text-center">
        {isRegister ? (
          <p>
            Já tem uma conta?{" "}
            <button
              onClick={() => {
                setIsRegister(false);
                setError("");
                setSuccessMessage("");
                setErrors({});
              }}
              className="text-blue-500 hover:underline"
            >
              Faça login
            </button>
          </p>
        ) : (
          <p>
            Não tem uma conta?{" "}
            <button
              onClick={() => {
                setIsRegister(true);
                setError("");
                setSuccessMessage("");
                setErrors({});
              }}
              className="text-blue-500 hover:underline"
            >
              Registre-se
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;