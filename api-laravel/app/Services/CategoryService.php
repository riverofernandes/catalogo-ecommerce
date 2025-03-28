<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\CategoryRepository;

class CategoryService
{
    protected CategoryRepository $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function listCategories()
    {
        return $this->categoryRepository->getAll();
    }

    public function createCategory(array $data): Category
    {
        // Exemplo de lógica de negócios: verificar duplicidade de nome
        if (Category::where('name', $data['name'])->exists()) {
            throw new \Exception('Categoria com este nome já existe.');
        }

        return $this->categoryRepository->create($data);
    }

    public function updateCategory(Category $category, array $data): Category
    {
        return $this->categoryRepository->update($category, $data);
    }

    public function deleteCategory(Category $category): void
    {
        $this->categoryRepository->delete($category);
    }
}