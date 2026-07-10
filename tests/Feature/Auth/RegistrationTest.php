<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Models\WorkerProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_technicians_can_register(): void
    {
        $response = $this->post('/register', [
            'role' => 'worker',
            'name' => 'Test Technician',
            'email' => 'tech@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $this->assertSame('worker', User::where('email', 'tech@example.com')->value('role'));
        $response->assertRedirect(route('worker.profile.edit', absolute: false));
    }

    public function test_employers_can_register(): void
    {
        $response = $this->post('/register', [
            'role' => 'employer',
            'name' => 'Test Employer',
            'email' => 'employer@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $user = User::where('email', 'employer@example.com')->first();
        $this->assertSame('employer', $user->role);
        $this->assertNull($user->workerProfile);
        $response->assertRedirect(route('home', absolute: false));
    }

    public function test_registration_requires_an_account_type(): void
    {
        $response = $this->post('/register', [
            'name' => 'No Role',
            'email' => 'norole@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('role');
        $this->assertGuest();
    }

    public function test_employers_never_get_a_worker_profile_and_are_not_listed(): void
    {
        $employer = User::factory()->create(['role' => 'employer']);

        // Visiting the worker profile editor must not auto-create a profile
        $this->actingAs($employer)
            ->get(route('worker.profile.edit'))
            ->assertRedirect(route('profile.edit'));

        $this->assertNull($employer->fresh()->workerProfile);

        // Even a stray profile row tied to an employer must stay out of listings
        WorkerProfile::create(['user_id' => $employer->id, 'title' => 'Stray Profile']);
        $worker = User::factory()->create(['role' => 'worker']);
        WorkerProfile::create(['user_id' => $worker->id, 'title' => 'Real Technician']);

        $this->assertSame(1, WorkerProfile::workersOnly()->count());
        $this->assertSame($worker->id, WorkerProfile::workersOnly()->first()->user_id);
    }
}
