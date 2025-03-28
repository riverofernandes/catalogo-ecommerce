import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../services/api";

const CategoryBar = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(); // Busca as categorias da API
        setCategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Categorias</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <Link to={`/category/${category.id}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryBar;