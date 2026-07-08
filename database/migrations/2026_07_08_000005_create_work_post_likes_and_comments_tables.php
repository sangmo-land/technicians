<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_post_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['work_post_id', 'user_id']);
        });

        Schema::create('work_post_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('body', 1000);
            $table->timestamps();

            $table->index(['work_post_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_post_comments');
        Schema::dropIfExists('work_post_likes');
    }
};
