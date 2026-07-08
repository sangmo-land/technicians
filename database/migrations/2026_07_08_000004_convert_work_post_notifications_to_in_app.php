<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('work_post_notifications', function (Blueprint $table) {
            $table->dropUnique(['work_post_id', 'user_id', 'channel']);
            $table->dropIndex(['wa_message_id']);
        });

        Schema::table('work_post_notifications', function (Blueprint $table) {
            $table->dropColumn(['channel', 'status', 'wa_message_id', 'error']);
        });

        Schema::table('work_post_notifications', function (Blueprint $table) {
            $table->timestamp('read_at')->nullable();
            $table->unique(['work_post_id', 'user_id']);
            $table->index(['user_id', 'read_at']);
        });
    }

    public function down(): void
    {
        Schema::table('work_post_notifications', function (Blueprint $table) {
            $table->dropUnique(['work_post_id', 'user_id']);
            $table->dropIndex(['user_id', 'read_at']);
            $table->dropColumn('read_at');
        });

        Schema::table('work_post_notifications', function (Blueprint $table) {
            $table->string('channel')->default('whatsapp');
            $table->string('status')->default('queued');
            $table->string('wa_message_id')->nullable()->index();
            $table->string('error')->nullable();
            $table->unique(['work_post_id', 'user_id', 'channel']);
        });
    }
};
