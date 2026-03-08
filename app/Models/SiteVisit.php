<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteVisit extends Model
{
    protected $fillable = [
        'ip_address',
        'visited_at',
    ];

    protected function casts(): array
    {
        return [
            'visited_at' => 'date',
        ];
    }
}
