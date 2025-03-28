import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, updateProduct, deleteProduct, storeProduct } from "../services/api";
import axios from "axios";

const AdminPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    category_id: "",
    image_url: "",
  });
  const [errors, setErrors] = useState({}); // Estado para armazenar os erros

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  useEffect(() => {
    // Verifica se o usuário está logado
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redireciona para a página de login se não estiver logado
    }

    fetchData();
  }, [navigate, currentPage]);

  const fetchData = async () => {
    try {
    const response = await axios.get(
      `${process.env.REACT_APP_PUBLIC_APP_URL_API}/products?page=${currentPage}`
    );
      const categoriesData = await getCategories();

      setProducts(response.data.data); // Produtos da página atual
      setCategories(categoriesData);

      // Atualiza informações de paginação
      setNextPageUrl(response.data.next_page_url);
      setPrevPageUrl(response.data.prev_page_url);
      setTotalPages(Math.ceil(response.data.total / response.data.per_page));
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); // Reseta para a primeira página ao buscar
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOpenModal = (product = { id: null, name: "", description: "", price: "", category_id: "", image_url: "" }) => {
    setModalData(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData({ id: null, name: "", description: "", price: "", category_id: "", image_url: "" });
  };

  const handleSaveProduct = async () => {
    try {
      if (modalData.id) {
        // Editar produto
        await updateProduct(modalData.id, modalData);
        alert("Produto atualizado com sucesso!");
      } else {
        // Criar produto
        await storeProduct(modalData);
        alert("Produto criado com sucesso!");
      }
      handleCloseModal();
      await fetchData(); // Atualiza a tabela após salvar
      setErrors({}); // Limpa os erros após sucesso
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors); // Define os erros retornados pela API
      } else {
        console.error("Erro ao salvar produto:", error);
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      alert("Produto deletado com sucesso!");
      await fetchData(); // Atualiza a tabela após deletar
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
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
          <h1 className="text-2xl font-bold mb-4">Gerenciar Produtos</h1>

          {/* Barra de busca e botão de adicionar */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchText}
              onChange={handleSearch}
              className="border rounded-lg p-2 w-1/2"
            />
            <button
              onClick={() => handleOpenModal()}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Adicionar Produto
            </button>
          </div>

          {/* Tabela de produtos */}
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Nome</th>
                <th className="border border-gray-300 px-4 py-2">Preço</th>
                <th className="border border-gray-300 px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    R$ {product.price.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginação */}
          <div className="flex justify-center mt-4 space-x-2">
            {prevPageUrl && (
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Anterior
              </button>
            )}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
            {nextPageUrl && (
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Próxima
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {modalData.id ? "Editar Produto" : "Adicionar Produto"}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700">Nome</label>
              <input
                type="text"
                value={modalData.name}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                className="border rounded-lg p-2 w-full"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Descrição</label>
              <textarea
                value={modalData.description}
                onChange={(e) =>
                  setModalData({ ...modalData, description: e.target.value })
                }
                className="border rounded-lg p-2 w-full"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Preço</label>
              <input
                type="number"
                value={modalData.price}
                onChange={(e) =>
                  setModalData({ ...modalData, price: e.target.value })
                }
                className="border rounded-lg p-2 w-full"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Categoria</label>
              <select
                value={modalData.category_id}
                onChange={(e) =>
                  setModalData({ ...modalData, category_id: e.target.value })
                }
                className="border rounded-lg p-2 w-full"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">URL da Imagem</label>
              <input
                type="text"
                value={modalData.image_url}
                onChange={(e) =>
                  setModalData({ ...modalData, image_url: e.target.value })
                }
                className="border rounded-lg p-2 w-full"
              />
              {errors.image_url && <p className="text-red-500 text-sm">{errors.image_url}</p>}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProduct}
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

export default AdminPage;