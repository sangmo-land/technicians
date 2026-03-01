<?php

namespace App\Filament\Resources;

use App\Filament\Resources\JobListingResource\Pages;
use App\Models\JobListing;
use App\Models\JobCategory;
use App\Models\Company;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class JobListingResource extends Resource
{
    protected static ?string $model = JobListing::class;
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-briefcase';
    protected static string|\UnitEnum|null $navigationGroup = 'Job Management';
    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\Section::make('Job Details')->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, $set) => $set('slug', Str::slug($state) . '-' . rand(1000, 9999))),
                Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true),
                Forms\Components\Select::make('company_id')
                    ->relationship('company', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required()
                    ->searchable(),
                Forms\Components\Select::make('job_category_id')
                    ->relationship('jobCategory', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),
                Forms\Components\Select::make('employment_type')
                    ->options([
                        'full_time' => 'Full Time',
                        'part_time' => 'Part Time',
                        'contract' => 'Contract',
                        'temporary' => 'Temporary',
                        'daily' => 'Daily',
                    ])->required(),
                Forms\Components\Select::make('experience_level')
                    ->options([
                        'entry' => 'Entry Level',
                        'intermediate' => 'Intermediate',
                        'experienced' => 'Experienced',
                        'expert' => 'Expert',
                    ])->required(),
                Forms\Components\Select::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'active' => 'Active',
                        'paused' => 'Paused',
                        'closed' => 'Closed',
                        'expired' => 'Expired',
                    ])->default('draft'),
            ])->columns(2),

            Forms\Components\Section::make('Description')->schema([
                Forms\Components\RichEditor::make('description')->required(),
                Forms\Components\RichEditor::make('requirements'),
                Forms\Components\RichEditor::make('responsibilities'),
                Forms\Components\RichEditor::make('benefits'),
            ]),

            Forms\Components\Section::make('Location & Salary')->schema([
                Forms\Components\TextInput::make('location')->required(),
                Forms\Components\TextInput::make('city'),
                Forms\Components\TextInput::make('state'),
                Forms\Components\Toggle::make('is_remote'),
                Forms\Components\TextInput::make('salary_min')->numeric()->prefix('$'),
                Forms\Components\TextInput::make('salary_max')->numeric()->prefix('$'),
                Forms\Components\Select::make('salary_period')
                    ->options([
                        'hourly' => 'Hourly',
                        'daily' => 'Daily',
                        'weekly' => 'Weekly',
                        'monthly' => 'Monthly',
                        'yearly' => 'Yearly',
                    ])->default('monthly'),
                Forms\Components\TextInput::make('positions_available')->numeric()->default(1),
            ])->columns(2),

            Forms\Components\Section::make('Project & Dates')->schema([
                Forms\Components\TextInput::make('project_name'),
                Forms\Components\TextInput::make('project_duration_months')->numeric(),
                Forms\Components\DatePicker::make('application_deadline'),
                Forms\Components\DatePicker::make('start_date'),
                Forms\Components\Toggle::make('is_featured'),
                Forms\Components\Toggle::make('is_urgent'),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')->searchable()->sortable()->limit(40),
                Tables\Columns\TextColumn::make('company.name')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('jobCategory.name')->sortable(),
                Tables\Columns\TextColumn::make('location')->searchable(),
                Tables\Columns\BadgeColumn::make('employment_type')
                    ->colors([
                        'success' => 'full_time',
                        'info' => 'contract',
                        'warning' => 'temporary',
                        'danger' => 'daily',
                    ]),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'success' => 'active',
                        'warning' => 'draft',
                        'info' => 'paused',
                        'danger' => fn ($state) => in_array($state, ['closed', 'expired']),
                    ]),
                Tables\Columns\IconColumn::make('is_featured')->boolean(),
                Tables\Columns\IconColumn::make('is_urgent')->boolean(),
                Tables\Columns\TextColumn::make('applications_count')->counts('applications')->label('Apps'),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'active' => 'Active',
                        'paused' => 'Paused',
                        'closed' => 'Closed',
                    ]),
                Tables\Filters\SelectFilter::make('job_category_id')
                    ->relationship('jobCategory', 'name')
                    ->label('Category'),
                Tables\Filters\TernaryFilter::make('is_featured'),
                Tables\Filters\TernaryFilter::make('is_urgent'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListJobListings::route('/'),
            'create' => Pages\CreateJobListing::route('/create'),
            'edit' => Pages\EditJobListing::route('/{record}/edit'),
        ];
    }
}
