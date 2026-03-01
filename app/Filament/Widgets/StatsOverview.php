<?php

namespace App\Filament\Widgets;

use App\Models\Company;
use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Workers', User::where('role', 'worker')->count())
                ->description('Registered workers')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('success'),
            Stat::make('Total Employers', User::where('role', 'employer')->count())
                ->description('Registered employers')
                ->descriptionIcon('heroicon-m-building-office')
                ->color('info'),
            Stat::make('Active Jobs', JobListing::where('status', 'active')->count())
                ->description('Currently active listings')
                ->descriptionIcon('heroicon-m-briefcase')
                ->color('warning'),
            Stat::make('Applications', JobApplication::count())
                ->description('Total applications')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('danger'),
            Stat::make('Companies', Company::count())
                ->description('Registered companies')
                ->descriptionIcon('heroicon-m-building-office-2')
                ->color('primary'),
            Stat::make('Pending Applications', JobApplication::where('status', 'pending')->count())
                ->description('Awaiting review')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
        ];
    }
}
