<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // MySQL requires an index on work_post_id for its foreign key at all
        // times; give it a temporary one before dropping the unique index
        // that currently serves that role (error 1553 otherwise).
        Schema::table('work_post_notifications', function (Blueprint $table) {
            $table->index('work_post_id', 'wpn_work_post_id_tmp');
        });

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

        // The new unique index has work_post_id leftmost, so the foreign key
        // no longer needs the temporary index.
        Schema::table('work_post_notifications', function (Blueprint $table) {
            $table->dropIndex('wpn_work_post_id_tmp');
        });
    }

    public function down(): void
    {
        Schema::table('work_post_notifications', function (Blueprint $table) {
            $table->index('work_post_id', 'wpn_work_post_id_tmp');
        });

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

        Schema::table('work_post_notifications', function (Blueprint $table) {
            $table->dropIndex('wpn_work_post_id_tmp');
        });
    }
};
