import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, getCategories } from "../services/api";

const ProductDetailsPage = () => {
  const { id } = useParams(); // Captura o ID do produto da URL
  const navigate = useNavigate(); // Para redirecionar ao clicar em uma categoria
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  // Busca os detalhes do produto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Busca as categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response); // Assume que a API retorna um array de categorias
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, []);

  if (!product) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-start">
        {/* Barra lateral de categorias */}
        <aside className="w-1/4 pr-4">
          <h2 className="text-lg font-semibold mb-4">Categorias</h2>
          <ul className="space-y-2">
            {/* Botão para mostrar todos os produtos */}
            <li>
              <button
                onClick={() => navigate("/")}
                className="text-blue-500 hover:underline"
              >
                Todos
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => navigate(`/category/${category.id}`)}
                  className="text-blue-500 hover:underline"
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Detalhes do produto */}
        <div className="w-3/4">
          <div className="flex">
            <img
              //src={product.image_url}
              src={`https://placehold.co/600x400?text=${product.name}`}
              alt={product.name}
              className="w-1/2 h-auto object-cover rounded-md"
            />
            <div className="ml-6">
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-green-600 text-xl font-bold mb-4">
                R$ {product.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;