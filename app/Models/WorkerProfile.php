<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'bio',
        'location',
        'city',
        'state',
        'latitude',
        'longitude',
        'years_experience',
        'experience_level',
        'hourly_rate',
        'daily_rate',
        'availability',
        'available_from',
        'willing_to_relocate',
        'max_travel_distance',
        'certifications',
        'languages',
        'resume',
        'is_featured',
        'profile_views',
    ];

    protected function casts(): array
    {
        return [
            'certifications' => 'array',
            'languages' => 'array',
            'willing_to_relocate' => 'boolean',
            'is_featured' => 'boolean',
            'available_from' => 'date',
            'hourly_rate' => 'decimal:2',
            'daily_rate' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'worker_profile_skill')
            ->withPivot('proficiency')
            ->withTimestamps();
    }

    public function jobCategories()
    {
        return $this->belongsToMany(JobCategory::class, 'worker_profile_job_category')
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    public function workExperiences(): HasMany
    {
        return $this->hasMany(WorkExperience::class);
    }

    public function portfolioPhotos(): HasMany
    {
        return $this->hasMany(PortfolioPhoto::class);
    }

    public function primaryCategory()
    {
        return $this->jobCategories()->wherePivot('is_primary', true)->first();
    }

    public function savedByEmployers()
    {
        return $this->hasMany(SavedWorker::class);
    }
}
