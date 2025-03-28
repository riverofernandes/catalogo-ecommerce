import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Adicionado useNavigate
import { getProducts, getCategories } from "../services/api";

const ProductsPage = () => {
  const { id } = useParams(); // Captura o ID da categoria da URL
  const navigate = useNavigate(); // Hook para redirecionar
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Busca produtos com base na categoria ou texto de busca
  const fetchProducts = async (categoryId = id, search = searchText) => {
    try {
      const response = await getProducts(search, categoryId);
      setProducts(response.data); // Acessa a propriedade "data" do JSON retornado
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  // Busca categorias
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response); // Assume que a API retorna um array de categorias
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [id]);

  // Atualiza os produtos em tempo real ao digitar no campo de busca
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500); // Aguarda 500ms após o usuário parar de digitar

    return () => clearTimeout(delayDebounceFn); // Limpa o timeout anterior
  }, [searchText]);

  // Manipula o clique em uma categoria
  const handleCategoryClick = (categoryId) => {
    fetchProducts(categoryId);
  };

  // Manipula o clique em um produto
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`); // Redireciona para a rota do produto
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>

      {/* Barra de busca */}
      <div className="mb-6 text-right">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border rounded-lg p-2 w-full sm:w-1/2"
        />
      </div>

      <div className="flex items-start">
        {/* Barra lateral de categorias */}
        <aside className="w-1/4 pr-4">
          <h2 className="text-lg font-semibold mb-4">Categorias</h2>
          <ul className="space-y-2">
            {/* Botão para mostrar todos os produtos */}
            <li>
              <button
                onClick={() => fetchProducts(null)}
                className="text-blue-500 hover:underline"
              >
                Todos
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className="text-blue-500 hover:underline"
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Lista de produtos */}
        <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-full">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleProductClick(product.id)} // Adicionado clique no produto
              >
                <img
                  //src={product.image_url}
                  src={`https://placehold.co/600x400?text=${product.name}`}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <p className="text-green-600 font-bold">
                  R$ {product.price.toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              Nenhum produto encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;