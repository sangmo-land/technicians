<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('can_add_users')->default(false)->after('is_active');
            $table->foreignId('added_by')->nullable()->after('can_add_users')->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['added_by']);
            $table->dropColumn(['can_add_users', 'added_by']);
        });
    }
};
