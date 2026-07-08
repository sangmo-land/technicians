<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'description',
        'category_id',
        'city',
        'state',
        'technicians_needed',
        'budget',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'technicians_needed' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(JobCategory::class, 'category_id');
    }

    public function interests(): HasMany
    {
        return $this->hasMany(WorkPostInterest::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(WorkPostNotification::class);
    }

    public function scopeOpen(Builder $query): Builder
    {
        return $query->where('status', 'open');
    }
}
