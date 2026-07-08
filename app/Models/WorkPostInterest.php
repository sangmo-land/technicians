<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkPostInterest extends Model
{
    use HasFactory;

    protected $fillable = [
        'work_post_id',
        'user_id',
        'message',
    ];

    public function workPost(): BelongsTo
    {
        return $this->belongsTo(WorkPost::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
