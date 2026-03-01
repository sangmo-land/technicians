<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedWorker extends Model
{
    protected $fillable = ['user_id', 'worker_profile_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function workerProfile(): BelongsTo
    {
        return $this->belongsTo(WorkerProfile::class);
    }
}
