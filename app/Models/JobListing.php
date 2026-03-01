<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'user_id',
        'job_category_id',
        'title',
        'slug',
        'description',
        'requirements',
        'responsibilities',
        'benefits',
        'employment_type',
        'salary_min',
        'salary_max',
        'salary_period',
        'location',
        'city',
        'state',
        'latitude',
        'longitude',
        'is_remote',
        'experience_level',
        'positions_available',
        'application_deadline',
        'start_date',
        'project_name',
        'project_duration_months',
        'status',
        'is_featured',
        'is_urgent',
        'views_count',
    ];

    protected function casts(): array
    {
        return [
            'is_remote' => 'boolean',
            'is_featured' => 'boolean',
            'is_urgent' => 'boolean',
            'application_deadline' => 'date',
            'start_date' => 'date',
            'salary_min' => 'decimal:2',
            'salary_max' => 'decimal:2',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jobCategory(): BelongsTo
    {
        return $this->belongsTo(JobCategory::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'job_listing_skill')
            ->withPivot('is_required')
            ->withTimestamps();
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function savedBy(): HasMany
    {
        return $this->hasMany(SavedJob::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeUrgent($query)
    {
        return $query->where('is_urgent', true);
    }

    public function isExpired(): bool
    {
        return $this->application_deadline && $this->application_deadline->isPast();
    }

    public function formattedSalary(): string
    {
        if ($this->salary_min && $this->salary_max) {
            return '$' . number_format($this->salary_min) . ' - $' . number_format($this->salary_max) . '/' . $this->salary_period;
        }
        if ($this->salary_min) {
            return 'From $' . number_format($this->salary_min) . '/' . $this->salary_period;
        }
        return 'Negotiable';
    }
}
