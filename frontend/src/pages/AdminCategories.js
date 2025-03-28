import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, storeCategory, updateCategory, deleteCategory } from "../services/api";

const AdminCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ id: null, name: "" });
  const [errors, setErrors] = useState({}); // Estado para armazenar os erros

  useEffect(() => {
    // Verifica se o usuário está logado
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redireciona para a página de login se não estiver logado
    }

    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const handleOpenModal = (category = { id: null, name: "" }) => {
    setModalData(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData({ id: null, name: "" });
    setErrors({});
  };

  const handleSaveCategory = async () => {
    try {
      if (modalData.id) {
        // Editar categoria
        await updateCategory(modalData.id, { name: modalData.name });
        alert("Categoria atualizada com sucesso!");
      } else {
        // Criar categoria
        await storeCategory({ name: modalData.name });
        alert("Categoria criada com sucesso!");
      }
      handleCloseModal();
      await fetchCategories(); // Atualiza a lista de categorias
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors); // Define os erros retornados pela API
      } else {
        console.error("Erro ao salvar categoria:", error);
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      alert("Categoria deletada com sucesso!");
      await fetchCategories(); // Atualiza a lista de categorias
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        {/* Menu lateral */}
        <aside className="w-1/4 pr-4">
          <h2 className="text-lg font-semibold mb-4">Administração</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate("/admin")}
                className="text-blue-500 hover:underline"
              >
                Gerenciar Produtos
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/admin/categories")}
                className="text-blue-500 hover:underline"
              >
                Gerenciar Categorias
              </button>
            </li>
          </ul>
        </aside>

        {/* Conteúdo principal */}
        <div className="w-3/4">
          <h1 className="text-2xl font-bold mb-4">Gerenciar Categorias</h1>

          {/* Botão de adicionar */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => handleOpenModal()}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Adicionar Categoria
            </button>
          </div>

          {/* Tabela de categorias */}
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Nome</th>
                <th className="border border-gray-300 px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="border border-gray-300 px-4 py-2">{category.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {modalData.id ? "Editar Categoria" : "Adicionar Categoria"}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700">Nome</label>
              <input
                type="text"
                value={modalData.name}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                className="border rounded-lg p-2 w-full"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCategory}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;