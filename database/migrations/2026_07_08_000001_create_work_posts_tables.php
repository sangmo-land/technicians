<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('description');
            $table->foreignId('category_id')->nullable()->constrained('job_categories')->nullOnDelete();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->unsignedTinyInteger('technicians_needed')->nullable();
            $table->string('budget')->nullable();
            $table->string('status')->default('open'); // open | filled | closed
            $table->timestamps();

            $table->index(['status', 'created_at']);
        });

        Schema::create('work_post_interests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('message', 500)->nullable();
            $table->timestamps();

            $table->unique(['work_post_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_post_interests');
        Schema::dropIfExists('work_posts');
    }
};
