<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'job_category_id',
    ];

    public function jobCategory(): BelongsTo
    {
        return $this->belongsTo(JobCategory::class);
    }

    public function workerProfiles()
    {
        return $this->belongsToMany(WorkerProfile::class, 'worker_profile_skill')
            ->withPivot('proficiency')
            ->withTimestamps();
    }

    public function jobListings()
    {
        return $this->belongsToMany(JobListing::class, 'job_listing_skill')
            ->withPivot('is_required')
            ->withTimestamps();
    }
}
