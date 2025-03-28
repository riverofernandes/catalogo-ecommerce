<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_allows_user_to_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['name', 'email', 'created_at', 'updated_at']);
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    public function test_it_prevents_registration_with_invalid_data()
    {
        $response = $this->postJson('/api/register', [
            'name' => '',
            'email' => 'invalid-email',
            'password' => 'short',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'erro de validação',
                     'data' => [
                         'name' => ['O campo nome é obrigatório'],
                         'email' => ['O campo email deve ser um email válido'],
                         'password' => ['O campo senha deve ter no mínimo 8 caracteres'],
                     ],
                 ]);
    }

    public function test_it_allows_user_to_login()
    {
        $user = \App\Models\User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['user', 'token']);
    }

    public function test_it_prevents_login_with_invalid_credentials()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Invalid credentials']);
    }
}
