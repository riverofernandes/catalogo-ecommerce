<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\ProductRepository;

class ProductService
{
    protected ProductRepository $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function listProducts(array $filters)
    {
        return $this->productRepository->getAllWithFilters($filters);
    }

    public function createProduct(array $data): Product
    {
        // Exemplo de lógica de negócios: aplicar desconto antes de salvar
        if (isset($data['discount'])) {
            $data['price'] = $data['price'] - ($data['price'] * $data['discount'] / 100);
        }

        return $this->productRepository->create($data);
    }

    public function updateProduct(Product $product, array $data): Product
    {
        return $this->productRepository->update($product, $data);
    }

    public function deleteProduct(Product $product): void
    {
        $this->productRepository->delete($product);
    }
}