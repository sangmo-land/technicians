<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('work_post_notifications', function (Blueprint $table) {
            $table->string('wa_message_id')->nullable()->index()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('work_post_notifications', function (Blueprint $table) {
            $table->dropColumn('wa_message_id');
        });
    }
};
