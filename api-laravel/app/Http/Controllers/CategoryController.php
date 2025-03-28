<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Listar categorias
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $categories = $this->categoryService->listCategories();
        return response()->json($categories);
    }

    /**
     * Cadastrar categoria
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $category = $this->categoryService->createCategory($request->all());
        return response()->json($category, 201);
    }

    /**
     * Exibir categoria
     *
     * @param Category $category
     * @return JsonResponse
     */
    public function show(Category $category): JsonResponse
    {
        return response()->json($category);
    }

    /**
     * Atualizar categoria
     *
     * @param Request $request
     * @param Category $category
     * @return JsonResponse
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $category = $this->categoryService->updateCategory($category, $request->all());
        return response()->json($category);
    }

    /**
     * Deletar categoria
     *
     * @param Category $category
     * @return JsonResponse
     */
    public function destroy(Category $category): JsonResponse
    {
        $this->categoryService->deleteCategory($category);
        return response()->json(null, 204);
    }
}