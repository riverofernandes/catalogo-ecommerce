<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Category;


class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_allows_anyone_to_view_categories()
    {
        Category::factory()->count(3)->create();

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     '*' => ['id', 'name', 'created_at', 'updated_at']
                 ]);
    }

    public function test_it_allows_authenticated_user_to_create_category()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/categories/store', [
            'name' => 'New Category',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['id', 'name', 'created_at', 'updated_at']);
        $this->assertDatabaseHas('categories', ['name' => 'New Category']);
    }

    public function test_it_prevents_unauthenticated_user_from_creating_category()
    {
        $response = $this->postJson('/api/categories/store', [
            'name' => 'Unauthorized Category',
        ]);

        $response->assertStatus(401);
    }

    public function test_it_allows_authenticated_user_to_view_a_category()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/categories/{$category->id}");

        $response->assertStatus(200)
                 ->assertJsonStructure(['id', 'name', 'created_at', 'updated_at']);
    }

    public function test_it_prevents_unauthenticated_user_from_viewing_a_category()
    {
        $category = Category::factory()->create();

        $response = $this->getJson("/api/categories/{$category->id}");

        $response->assertStatus(401);
    }

    public function test_it_allows_authenticated_user_to_update_a_category()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson("/api/categories/update/{$category->id}", [
            'name' => 'Updated Category',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('categories', ['id' => $category->id, 'name' => 'Updated Category']);
    }

    public function test_it_prevents_unauthenticated_user_from_updating_a_category()
    {
        $category = Category::factory()->create();

        $response = $this->postJson("/api/categories/update/{$category->id}", [
            'name' => 'Unauthorized Update',
        ]);

        $response->assertStatus(401);
    }

    public function test_it_allows_authenticated_user_to_delete_a_category()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson("/api/categories/delete/{$category->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_it_prevents_unauthenticated_user_from_deleting_a_category()
    {
        $category = Category::factory()->create();

        $response = $this->postJson("/api/categories/delete/{$category->id}");

        $response->assertStatus(401);
    }
}
