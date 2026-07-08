<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_post_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('channel')->default('whatsapp');
            $table->string('status')->default('queued'); // queued | sent | failed | skipped
            $table->string('error')->nullable();
            $table->timestamps();

            $table->unique(['work_post_id', 'user_id', 'channel']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_post_notifications');
    }
};
