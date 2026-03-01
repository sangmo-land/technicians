<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('worker_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title')->nullable(); // e.g. "Senior Formwork Maker"
            $table->text('bio')->nullable();
            $table->string('location')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->integer('years_experience')->default(0);
            $table->enum('experience_level', ['entry', 'intermediate', 'experienced', 'expert'])->default('entry');
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->decimal('daily_rate', 8, 2)->nullable();
            $table->enum('availability', ['available', 'busy', 'not_available'])->default('available');
            $table->date('available_from')->nullable();
            $table->boolean('willing_to_relocate')->default(false);
            $table->integer('max_travel_distance')->nullable(); // in km
            $table->json('certifications')->nullable();
            $table->json('languages')->nullable();
            $table->string('resume')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('profile_views')->default(0);
            $table->timestamps();
        });

        Schema::create('worker_profile_skill', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('skill_id')->constrained()->cascadeOnDelete();
            $table->enum('proficiency', ['beginner', 'intermediate', 'advanced', 'expert'])->default('intermediate');
            $table->timestamps();
        });

        Schema::create('worker_profile_job_category', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_category_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('worker_profile_job_category');
        Schema::dropIfExists('worker_profile_skill');
        Schema::dropIfExists('worker_profiles');
    }
};
