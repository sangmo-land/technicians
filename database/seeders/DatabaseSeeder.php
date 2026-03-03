<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@nexjobs.com',
            'role' => 'admin',
            'password' => bcrypt('password'),
        ]);

        // Create test employer
        User::factory()->create([
            'name' => 'Demo Employer',
            'email' => 'employer@nexjobs.com',
            'role' => 'employer',
            'password' => bcrypt('password'),
        ]);

        // Create test worker
        User::factory()->create([
            'name' => 'Demo Worker',
            'email' => 'worker@nexjobs.com',
            'role' => 'worker',
            'password' => bcrypt('password'),
        ]);

        $this->call([
            JobCategorySeeder::class,
            TechnicianSeeder::class,
            JobListingSeeder::class,
        ]);
    }
}
