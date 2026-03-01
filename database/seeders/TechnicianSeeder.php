<?php

namespace Database\Seeders;

use App\Models\JobCategory;
use App\Models\PortfolioPhoto;
use App\Models\Skill;
use App\Models\User;
use App\Models\WorkerProfile;
use App\Models\WorkExperience;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class TechnicianSeeder extends Seeder
{
    /**
     * Generate a professional avatar image using GD.
     */
    private function generateAvatar(string $name, int $index): string
    {
        $size = 256;
        $img = imagecreatetruecolor($size, $size);
        imagesavealpha($img, true);

        // Unique gradient colors per person
        $gradients = [
            [[41, 128, 185], [44, 62, 80]],     // blue → dark
            [[22, 160, 133], [44, 62, 80]],     // teal → dark
            [[142, 68, 173], [44, 62, 80]],     // purple → dark
            [[211, 84, 0], [44, 62, 80]],       // orange → dark
            [[39, 174, 96], [44, 62, 80]],      // green → dark
            [[192, 57, 43], [52, 73, 94]],      // red → slate
            [[41, 128, 185], [142, 68, 173]],   // blue → purple
            [[22, 160, 133], [39, 174, 96]],    // teal → green
            [[52, 152, 219], [41, 128, 185]],   // light blue → blue
            [[155, 89, 182], [192, 57, 43]],    // purple → red
            [[230, 126, 34], [211, 84, 0]],     // light orange → orange
            [[26, 188, 156], [22, 160, 133]],   // turquoise → teal
            [[46, 134, 193], [23, 32, 42]],     // ocean → charcoal
            [[125, 60, 152], [52, 73, 94]],     // violet → slate
            [[243, 156, 18], [211, 84, 0]],     // yellow → orange
            [[231, 76, 60], [192, 57, 43]],     // coral → crimson
            [[52, 73, 94], [23, 32, 42]],       // slate → charcoal
            [[46, 204, 113], [39, 174, 96]],    // emerald → green
            [[149, 165, 166], [52, 73, 94]],    // silver → slate
            [[44, 62, 80], [22, 160, 133]],     // dark → teal
        ];

        [$topColor, $bottomColor] = $gradients[$index % count($gradients)];

        // Draw vertical gradient
        for ($y = 0; $y < $size; $y++) {
            $ratio = $y / $size;
            $r = (int)($topColor[0] + ($bottomColor[0] - $topColor[0]) * $ratio);
            $g = (int)($topColor[1] + ($bottomColor[1] - $topColor[1]) * $ratio);
            $b = (int)($topColor[2] + ($bottomColor[2] - $topColor[2]) * $ratio);
            $color = imagecolorallocate($img, $r, $g, $b);
            imageline($img, 0, $y, $size - 1, $y, $color);
        }

        // Add subtle pattern overlay (diagonal lines)
        $patternColor = imagecolorallocatealpha($img, 255, 255, 255, 120);
        for ($i = -$size; $i < $size * 2; $i += 20) {
            imageline($img, $i, 0, $i + $size, $size, $patternColor);
        }

        // Get initials (up to 2 chars)
        $parts = explode(' ', trim($name));
        $initials = strtoupper(substr($parts[0], 0, 1));
        if (count($parts) > 1) {
            $initials .= strtoupper(substr(end($parts), 0, 1));
        }

        // Draw initials centered
        $white = imagecolorallocate($img, 255, 255, 255);
        $fontSize = 5; // Built-in font size (1-5)
        $fontWidth = imagefontwidth($fontSize);
        $fontHeight = imagefontheight($fontSize);

        // Use built-in fonts scaled up - draw large by using multiple passes
        $textLen = strlen($initials);

        // Draw a circle behind initials
        $circleColor = imagecolorallocatealpha($img, 255, 255, 255, 95);
        $cx = (int)($size / 2);
        $cy = (int)($size / 2);
        $radius = 70;
        imagefilledellipse($img, $cx, $cy, $radius * 2, $radius * 2, $circleColor);

        // Draw border ring
        $ringColor = imagecolorallocatealpha($img, 255, 255, 255, 80);
        imageellipse($img, $cx, $cy, $radius * 2 + 6, $radius * 2 + 6, $ringColor);

        // Scale up the text by drawing it on a small image and resampling
        $textImg = imagecreatetruecolor($textLen * $fontWidth, $fontHeight);
        $transparent = imagecolorallocatealpha($textImg, 0, 0, 0, 127);
        imagefill($textImg, 0, 0, $transparent);
        imagesavealpha($textImg, true);
        $textWhite = imagecolorallocate($textImg, 255, 255, 255);
        imagestring($textImg, $fontSize, 0, 0, $initials, $textWhite);

        // Scale up 7x
        $scale = 7;
        $scaledW = $textLen * $fontWidth * $scale;
        $scaledH = $fontHeight * $scale;
        $destX = (int)(($size - $scaledW) / 2);
        $destY = (int)(($size - $scaledH) / 2);
        imagecopyresampled($img, $textImg, $destX, $destY, 0, 0, $scaledW, $scaledH, $textLen * $fontWidth, $fontHeight);
        imagedestroy($textImg);

        // Save
        $dir = storage_path('app/public/avatars');
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $filename = 'avatars/' . str_replace(' ', '_', strtolower($name)) . '.png';
        $filepath = storage_path('app/public/' . $filename);
        imagepng($img, $filepath, 6);
        imagedestroy($img);

        return $filename;
    }

    /**
     * Download a real portfolio photo from the internet.
     */
    private function generatePortfolioPhoto(string $name, string $category, int $photoIndex): string
    {
        $dir = storage_path('app/public/portfolio');
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $safeName = preg_replace('/[^a-z0-9_]/', '_', strtolower($name));
        $filename = "portfolio/{$safeName}_{$photoIndex}.jpg";
        $filepath = storage_path('app/public/' . $filename);

        // Category-specific search terms for themed images
        $searchTerms = [
            'Formwork' => ['construction+formwork', 'concrete+construction', 'building+framework', 'construction+site+wood'],
            'Iron' => ['steel+construction', 'rebar+construction', 'iron+worker', 'metal+fabrication'],
            'Mason' => ['bricklaying', 'masonry+wall', 'brick+construction', 'stone+masonry'],
            'Concrete' => ['concrete+pouring', 'concrete+construction', 'cement+work', 'concrete+slab'],
            'Carpenter' => ['carpentry+work', 'wood+construction', 'timber+framing', 'woodworking'],
            'Electrician' => ['electrical+work', 'electrician+wiring', 'electrical+panel', 'cable+installation'],
            'Plumber' => ['plumbing+work', 'pipe+installation', 'plumbing+pipes', 'water+pipeline'],
            'Welder' => ['welding+sparks', 'steel+welding', 'metal+welding', 'welder+work'],
            'Crane' => ['crane+construction', 'tower+crane', 'heavy+equipment', 'crane+lifting'],
            'Painter' => ['house+painting', 'wall+painting', 'paint+roller', 'building+painting'],
            'Tile' => ['tile+installation', 'tile+floor', 'ceramic+tile', 'tiling+work'],
            'Scaffold' => ['scaffolding+construction', 'scaffolding+building', 'scaffold+worker', 'scaffolding'],
            'Heavy' => ['excavator+construction', 'bulldozer', 'heavy+machinery', 'construction+equipment'],
            'Survey' => ['land+surveying', 'surveyor+construction', 'theodolite', 'construction+survey'],
            'Safety' => ['construction+safety', 'safety+helmet', 'safety+construction', 'worker+safety'],
            'HVAC' => ['hvac+installation', 'air+conditioning', 'ductwork', 'hvac+system'],
            'Waterproof' => ['waterproofing', 'membrane+construction', 'roof+waterproof', 'waterproof+coating'],
            'Road' => ['road+construction', 'asphalt+paving', 'road+roller', 'highway+construction'],
        ];

        // Find matching category search terms
        $terms = ['construction+site', 'building+construction', 'construction+worker', 'civil+engineering'];
        foreach ($searchTerms as $key => $catTerms) {
            if (stripos($category, $key) !== false) {
                $terms = $catTerms;
                break;
            }
        }

        $searchTerm = $terms[$photoIndex % count($terms)];

        // Try downloading from loremflickr (themed images)
        $lockId = abs(crc32("{$safeName}_{$photoIndex}")) % 9999;
        $url = "https://loremflickr.com/640/480/{$searchTerm}?lock={$lockId}";

        try {
            $response = Http::timeout(20)
                ->withOptions([
                    'allow_redirects' => ['max' => 5],
                    'verify' => false,
                ])
                ->get($url);

            if ($response->successful() && strlen($response->body()) > 1000) {
                file_put_contents($filepath, $response->body());
                $this->command->info("  ✓ Downloaded: {$filename} ({$searchTerm})");
                return $filename;
            }
        } catch (\Exception $e) {
            $this->command->warn("  ⚠ loremflickr failed for {$safeName}_{$photoIndex}: {$e->getMessage()}");
        }

        // Fallback: picsum.photos (high quality real photos)
        $seed = urlencode("{$safeName}_{$category}_{$photoIndex}");
        $fallbackUrl = "https://picsum.photos/seed/{$seed}/640/480";

        try {
            $response = Http::timeout(20)
                ->withOptions([
                    'allow_redirects' => ['max' => 5],
                    'verify' => false,
                ])
                ->get($fallbackUrl);

            if ($response->successful() && strlen($response->body()) > 1000) {
                file_put_contents($filepath, $response->body());
                $this->command->info("  ✓ Downloaded (picsum): {$filename}");
                return $filename;
            }
        } catch (\Exception $e) {
            $this->command->warn("  ⚠ picsum failed for {$safeName}_{$photoIndex}: {$e->getMessage()}");
        }

        // Final fallback: generate simple GD placeholder
        $this->command->warn("  ⚠ Using GD fallback for {$filename}");
        $img = imagecreatetruecolor(640, 480);
        $bg = imagecolorallocate($img, 45, 55, 72);
        imagefill($img, 0, 0, $bg);
        $white = imagecolorallocate($img, 255, 255, 255);
        $text = strtoupper($category);
        imagestring($img, 5, 250, 220, $text, $white);
        imagestring($img, 3, 240, 250, "Portfolio Photo " . ($photoIndex + 1), $white);
        imagejpeg($img, $filepath, 85);
        imagedestroy($img);

        return $filename;
    }

    public function run(): void
    {
        $technicians = [
            // Formwork Makers
            [
                'name' => 'Ahmed Al-Rashid',
                'email' => 'ahmed.rashid@example.com',
                'phone' => '+971501234567',
                'profile' => [
                    'title' => 'Senior Formwork Maker',
                    'bio' => 'Experienced formwork specialist with over 12 years in large-scale commercial and residential projects. Proficient in timber, steel, and aluminium formwork systems. Known for precision work and strict adherence to safety protocols.',
                    'location' => 'Dubai, UAE',
                    'city' => 'Dubai',
                    'state' => 'Dubai',
                    'latitude' => 25.2048493,
                    'longitude' => 55.2707828,
                    'years_experience' => 12,
                    'experience_level' => 'expert',
                    'hourly_rate' => 35.00,
                    'daily_rate' => 250.00,
                    'availability' => 'available',
                    'willing_to_relocate' => true,
                    'max_travel_distance' => 100,
                    'certifications' => ['OSHA 30-Hour', 'Formwork Design Certificate', 'First Aid'],
                    'languages' => ['Arabic', 'English', 'Hindi'],
                    'is_featured' => true,
                ],
                'category' => 'Formwork Maker',
                'skills' => ['Timber Formwork', 'Steel Formwork', 'Aluminium Formwork', 'Slip Forming', 'Blueprint Reading'],
                'experiences' => [
                    ['job_title' => 'Lead Formwork Carpenter', 'company_name' => 'Arabtec Construction', 'location' => 'Dubai, UAE', 'start_date' => '2019-03-01', 'end_date' => null, 'is_current' => true, 'description' => 'Leading a team of 15 formwork carpenters on a 40-story commercial tower project. Responsible for reading structural drawings and planning formwork layouts.'],
                    ['job_title' => 'Formwork Carpenter', 'company_name' => 'Al Habtoor Group', 'location' => 'Abu Dhabi, UAE', 'start_date' => '2014-06-01', 'end_date' => '2019-02-28', 'is_current' => false, 'description' => 'Built and installed formwork for columns, slabs, and retaining walls across multiple residential projects.'],
                ],
            ],
            [
                'name' => 'Rajesh Kumar',
                'email' => 'rajesh.kumar@example.com',
                'phone' => '+971502345678',
                'profile' => [
                    'title' => 'Formwork Specialist',
                    'bio' => 'Dedicated formwork maker with 8 years of experience in high-rise building construction. Skilled in both traditional timber and modern system formwork. Detail-oriented with a strong focus on quality.',
                    'location' => 'Abu Dhabi, UAE',
                    'city' => 'Abu Dhabi',
                    'state' => 'Abu Dhabi',
                    'latitude' => 24.4539,
                    'longitude' => 54.3773,
                    'years_experience' => 8,
                    'experience_level' => 'experienced',
                    'hourly_rate' => 28.00,
                    'daily_rate' => 200.00,
                    'availability' => 'available',
                    'willing_to_relocate' => true,
                    'max_travel_distance' => 80,
                    'certifications' => ['OSHA 10-Hour', 'Scaffold Safety'],
                    'languages' => ['Hindi', 'English', 'Tamil'],
                    'is_featured' => false,
                ],
                'category' => 'Formwork Maker',
                'skills' => ['Timber Formwork', 'Steel Formwork', 'Form Stripping', 'Shoring Systems'],
                'experiences' => [
                    ['job_title' => 'Formwork Carpenter', 'company_name' => 'BESIX Group', 'location' => 'Abu Dhabi, UAE', 'start_date' => '2020-01-01', 'end_date' => null, 'is_current' => true, 'description' => 'Working on mega infrastructure projects including bridges and elevated highways.'],
                ],
            ],

            // Iron Benders / Steel Fixers
            [
                'name' => 'Mohammad Farid',
                'email' => 'mohammad.farid@example.com',
                'phone' => '+971503456789',
                'profile' => [
                    'title' => 'Expert Steel Fixer',
                    'bio' => 'Highly skilled steel fixer with deep knowledge of reinforcement detailing and bar bending schedules. 15 years of experience in mega construction projects across the Middle East.',
                    'location' => 'Sharjah, UAE',
                    'city' => 'Sharjah',
                    'state' => 'Sharjah',
                    'latitude' => 25.3463,
                    'longitude' => 55.4209,
                    'years_experience' => 15,
                    'experience_level' => 'expert',
                    'hourly_rate' => 38.00,
                    'daily_rate' => 270.00,
                    'availability' => 'available',
                    'willing_to_relocate' => false,
                    'max_travel_distance' => 60,
                    'certifications' => ['Rebar Specialist Certificate', 'OSHA 30-Hour', 'Working at Heights'],
                    'languages' => ['Arabic', 'English', 'Urdu'],
                    'is_featured' => true,
                ],
                'category' => 'Iron Bender / Steel Fixer',
                'skills' => ['Rebar Cutting', 'Rebar Bending', 'Bar Tying', 'BBS (Bar Bending Schedule)', 'Structural Steel Reading', 'Welding Rebar'],
                'experiences' => [
                    ['job_title' => 'Senior Steel Fixer', 'company_name' => 'Samsung C&T', 'location' => 'Dubai, UAE', 'start_date' => '2018-05-01', 'end_date' => null, 'is_current' => true, 'description' => 'Supervising steel fixing operations for a landmark skyscraper. Managing team of 25 fixers and coordinating with structural engineers.'],
                    ['job_title' => 'Steel Fixer', 'company_name' => 'Dar Al Handasah', 'location' => 'Riyadh, Saudi Arabia', 'start_date' => '2011-09-01', 'end_date' => '2018-04-30', 'is_current' => false, 'description' => 'Performed rebar cutting, bending and fixing for residential and commercial buildings.'],
                ],
            ],
            [
                'name' => 'Suresh Bahadur',
                'email' => 'suresh.bahadur@example.com',
                'phone' => '+971504567890',
                'profile' => [
                    'title' => 'Steel Fixer & Rebar Specialist',
                    'bio' => 'Reliable steel fixer with 6 years of hands-on experience. Proficient in reading structural drawings and executing complex rebar configurations for foundations and superstructures.',
                    'location' => 'Ajman, UAE',
                    'city' => 'Ajman',
                    'state' => 'Ajman',
                    'latitude' => 25.4052,
                    'longitude' => 55.5136,
                    'years_experience' => 6,
                    'experience_level' => 'intermediate',
                    'hourly_rate' => 22.00,
                    'daily_rate' => 160.00,
                    'availability' => 'available',
                    'willing_to_relocate' => true,
                    'max_travel_distance' => 50,
                    'certifications' => ['OSHA 10-Hour'],
                    'languages' => ['Nepali', 'Hindi', 'English'],
                    'is_featured' => false,
                ],
                'category' => 'Iron Bender / Steel Fixer',
                'skills' => ['Rebar Cutting', 'Rebar Bending', 'Bar Tying', 'Mesh Fixing'],
                'experiences' => [
                    ['job_title' => 'Rebar Worker', 'company_name' => 'Drake & Scull International', 'location' => 'Ajman, UAE', 'start_date' => '2021-02-01', 'end_date' => null, 'is_current' => true, 'description' => 'Fixing reinforcement steel for villa and low-rise building projects.'],
                ],
            ],

            // Masons / Bricklayers
            [
                'name' => 'James Okonkwo',
                'email' => 'james.okonkwo@example.com',
                'phone' => '+971505678901',
                'profile' => [
                    'title' => 'Master Mason',
                    'bio' => 'Master mason with exceptional block-laying and plastering skills. 10 years of experience delivering high-quality masonry work in commercial and residential construction projects.',
                    'location' => 'Dubai, UAE',
                    'city' => 'Dubai',
                    'state' => 'Dubai',
                    'latitude' => 25.1972,
                    'longitude' => 55.2744,
                    'years_experience' => 10,
                    'experience_level' => 'expert',
                    'hourly_rate' => 30.00,
                    'daily_rate' => 220.00,
                    'availability' => 'available',
                    'willing_to_relocate' => true,
                    'max_travel_distance' => 75,
                    'certifications' => ['Masonry NVQ Level 3', 'OSHA 10-Hour', 'First Aid'],
                    'languages' => ['English', 'Igbo'],
                    'is_featured' => true,
                ],
                'category' => 'Mason / Bricklayer',
                'skills' => ['Block Laying', 'Brick Laying', 'Plastering', 'Pointing & Jointing', 'Foundation Work', 'Tiling'],
                'experiences' => [
                    ['job_title' => 'Lead Mason', 'company_name' => 'Emaar Properties', 'location' => 'Dubai, UAE', 'start_date' => '2020-07-01', 'end_date' => null, 'is_current' => true, 'description' => 'Leading masonry works for luxury residential towers in Downtown Dubai. Overseeing blockwork, plastering and finishing.'],
                    ['job_title' => 'Mason', 'company_name' => 'Razel Cameroon', 'location' => 'Douala, Cameroon', 'start_date' => '2016-01-01', 'end_date' => '2020-06-30', 'is_current' => false, 'description' => 'Performed block laying and plastering for multi-story residential buildings.'],
                ],
            ],

            // Concrete Workers
            [
                'name' => 'Carlos Rivera',
                'email' => 'carlos.rivera@example.com',
                'phone' => '+971506789012',
                'profile' => [
                    'title' => 'Concrete Finishing Specialist',
                    'bio' => 'Expert concrete finisher with 9 years of experience in decorative and structural concrete work. Skilled in stamped concrete, polished surfaces, and high-strength concrete applications.',
                    'location' => 'Dubai, UAE',
                    'city' => 'Dubai',
                    'state' => 'Dubai',
                    'latitude' => 25.2285,
                    'longitude' => 55.3273,
                    'years_experience' => 9,
                    'experience_level' => 'experienced',
                    'hourly_rate' => 32.00,
                    'daily_rate' => 230.00,
                    'availability' => 'available',
                    'willing_to_relocate' => false,
                    'max_travel_distance' => 50,
                    'certifications' => ['ACI Concrete Finisher', 'OSHA 10-Hour'],
                    'languages' => ['Spanish', 'English', 'Portuguese'],
                    'is_featured' => false,
                ],
                'category' => 'Concrete Worker',
                'skills' => ['Concrete Mixing', 'Concrete Pouring', 'Concrete Finishing', 'Stamped Concrete', 'Concrete Curing', 'Quality Testing'],
                'experiences' => [
                    ['job_title' => 'Concrete Finisher', 'company_name' => 'Nakheel Properties', 'location' => 'Dubai, UAE', 'start_date' => '2021-01-01', 'end_date' => null, 'is_current' => true, 'description' => 'Executing concrete finishing works for waterfront development projects including polished concrete for public areas.'],
                    ['job_title' => 'Concrete Worker', 'company_name' => 'Odebrecht S.A.', 'location' => 'São Paulo, Brazil', 'start_date' => '2017-03-01', 'end_date' => '2020-12-31', 'is_current' => false, 'description' => 'Performed concrete mixing, pouring and finishing for highway infrastructure projects.'],
                ],
            ],

            // Carpenter
            [
                'name' => 'Anil Patel',
                'email' => 'anil.patel@example.com',
                'phone' => '+971507890123',
                'profile' => [
                    'title' => 'Finish Carpentry Expert',
                    'bio' => 'Skilled carpenter with 11 years of experience in both rough and finish carpentry. Specializes in custom cabinetry, door installations, and fine woodworking for luxury residences.',
                    'location' => 'Dubai, UAE',
                    'city' => 'Dubai',
                    'state' => 'Dubai',
                    'latitude' => 25.0657,
                    'longitude' => 55.1713,
                    'years_experience' => 11,
                    'experience_level' => 'expert',
                    'hourly_rate' => 33.00,
                    'daily_rate' => 240.00,
                    'availability' => 'available',
                    'willing_to_relocate' => true,
                    'max_travel_distance' => 90,
                    'certifications' => ['Carpentry NVQ Level 3', 'OSHA 10-Hour', 'Furniture Making Diploma'],
                    'languages' => ['Hindi', 'English', 'Gujarati'],
                    'is_featured' => true,
                ],
                'category' => 'Carpenter',
                'skills' => ['Finish Carpentry', 'Cabinet Making', 'Door & Window Installation', 'Rough Carpentry', 'Wood Finishing', 'Structural Timber'],
                'experiences' => [
                    ['job_title' => 'Lead Carpenter', 'company_name' => 'Damac Properties', 'location' => 'Dubai, UAE', 'start_date' => '2019-08-01', 'end_date' => null, 'is_current' => true, 'description' => 'Leading carpentry team for luxury villa fitout. Custom millwork, cabinetry and fine woodworking for high-end clients.'],
                    ['job_title' => 'Carpenter', 'company_name' => 'Shapoorji Pallonji', 'location' => 'Mumbai, India', 'start_date' => '2015-02-01', 'end_date' => '2019-07-31', 'is_current' => false, 'description' => 'Framing, roofing and general carpentry work on commercial building projects.'],
                ],
            ],

            // Electrician
            [
                'name' => 'David Mensah',
                'email' => 'david.mensah@example.com',
                'phone' => '+971508901234',
                'profile' => [
                    'title' => 'Construction Electrician',
                    'bio' => 'Certified construction electrician with 7 years of experience in commercial and industrial electrical installations. Expert in conduit systems, power distribution, and lighting layouts.',
                    'location' => 'Abu Dhabi, UAE',
                    'city' => 'Abu Dhabi',
                    'state' => 'Abu Dhabi',
                    'latitude' => 24.4539,
                    'longitude' => 54.3773,
                    'years_experience' => 7,
                    'experience_level' => 'experienced',
                    'hourly_rate' => 35.00,
                    'daily_rate' => 260.00,
                    'availability' => 'available',
                    'willing_to_relocate' => true,
                    'max_travel_distance' => 70,
                    'certifications' => ['Electrical License Grade A', 'OSHA 30-Hour', 'Low Voltage Systems'],
                    'languages' => ['English', 'Twi', 'French'],
                    'is_featured' => false,
                ],
                'category' => 'Electrician (Construction)',
                'skills' => ['Conduit Installation', 'Wire Pulling', 'Panel Boards', 'Lighting Systems', 'Power Distribution', 'Electrical Testing'],
                'experiences' => [
                    ['job_title' => 'Electrician', 'company_name' => 'Aldar Properties', 'location' => 'Abu Dhabi, UAE', 'start_date' => '2022-03-01', 'end_date' => null, 'is_current' => true, 'description' => 'Installing electrical systems for a mixed-use development project including conduit, wiring and panel boards.'],
                    ['job_title' => 'Apprentice Electrician', 'company_name' => 'VoltTech Ghana', 'location' => 'Accra, Ghana', 'start_date' => '2019-01-01', 'end_date' => '2022-02-28', 'is_current' => false, 'description' => 'Assisted senior electricians with residential and commercial wiring installations.'],
                ],
            ],

            // Plumber
            [
                'name' => 'Bilal Hassan',
                'email' => 'bilal.hassan@example.com',
                'phone' => '+971509012345',
                'profile' => [
                    'title' => 'Senior Plumber',
                    'bio' => 'Seasoned plumber with 13 years of experience in large-scale plumbing systems for high-rise buildings, hospitals, and industrial facilities. Expert in drainage design and fire protection systems.',
                    'location' => 'Dubai, UAE',
                    'city' => 'Dubai',
                    'state' => 'Dubai',
                    'latitude' => 25.2048,
                    'longitude' => 55.2708,
                    'years_experience' => 13,
                    'experience_level' => 'expert',
                    'hourly_rate' => 36.00,
                    'daily_rate' => 265.00,
                    'availability' => 'busy',
                    'willing_to_relocate' => false,
                    'max_travel_distance' => 40,
                    'certifications' => ['Master Plumber License', 'OSHA 30-Hour', 'Fire Sprinkler Installer'],
                    'languages' => ['Arabic', 'English', 'Urdu'],
                    'is_featured' => true,
                ],
                'category' => 'Plumber',
                'skills' => ['Pipe Fitting', 'Drainage Systems', 'Water Supply', 'Sewage Systems', 'Fire Sprinkler', 'Leak Detection'],
                'experiences' => [
                    ['job_title' => 'Senior Plumber', 'company_name' => 'Meraas Holding', 'location' => 'Dubai, UAE', 'start_date' => '2020-01-01', 'end_date' => null, 'is_current' => true, 'description' => 'Leading plumbing team for luxury hotel and entertainment complex. Managing drainage, water supply and fire protection systems.'],
                    ['job_title' => 'Plumber', 'company_name' => 'Saudi Binladin Group', 'location' => 'Jeddah, Saudi Arabia', 'start_date' => '2013-04-01', 'end_date' => '2019-12-31', 'is_current' => false, 'description' => 'Installed plumbing systems for healthcare facilities and residential compounds.'],
                ],
            ],

            // Welder
            [
                'name' => 'Viktor Petrov',
                'email' => 'viktor.petrov@example.com',
                'phone' => '+971510123456',
                'profile' => [
                    'title' => 'Certified Structural Welder',
                    'bio' => 'AWS-certified structural welder with 10 years of experience in steel fabrication and construction welding. Proficient in SMAW, MIG, and TIG welding processes for structural and piping applications.',
                    'location' => 'Sharjah, UAE',
                    'city' => 'Sharjah',
                    'state' => 'Sharjah',
                    'latitude' => 25.3463,
                    'longitude' => 55.4209,
                    'years_experience' => 10,
                    'experience_level' => 'expert',
                    'hourly_rate' => 40.00,
                    'daily_rate' => 290.00,
                    'availability' => 'available',
                    'willing_to_relocate' => true,
                    'max_travel_distance' => 100,
                    'certifications' => ['AWS Certified Welder', '6G Pipe Welding', 'OSHA 30-Hour', 'NDT Level 1'],
                    'languages' => ['Russian', 'English', 'Ukrainian'],
                    'is_featured' => true,
                ],
                'category' => 'Welder / Fabricator',
                'skills' => ['Arc Welding (SMAW)', 'MIG Welding', 'TIG Welding', 'Structural Welding', 'Pipe Welding', 'Metal Fabrication', 'Blueprint Reading'],
                'experiences' => [
                    ['job_title' => 'Lead Welder', 'company_name' => 'Lamprell PLC', 'location' => 'Sharjah, UAE', 'start_date' => '2019-06-01', 'end_date' => null, 'is_current' => true, 'description' => 'Leading welding operations for offshore oil and gas platform fabrication. Performing structural and pipe welding to international codes.'],
                    ['job_title' => 'Welder', 'company_name' => 'Evraz Steel', 'location' => 'Yekaterinburg, Russia', 'start_date' => '2016-01-01', 'end_date' => '2019-05-31', 'is_current' => false, 'description' => 'Structural steel welding in a heavy industrial manufacturing environment.'],
                ],
            ],

            // Crane Operator
            [
                'name' => 'Patrick O\'Brien',
                'email' => 'patrick.obrien@example.com',
                'phone' => '+971511234567',
                'profile' => [
                    'title' => 'Licensed Tower Crane Operator',
                    'bio' => 'Experienced tower crane operator with 14 years of safe operation record. Zero-incident track record across multiple high-rise construction projects. Certified for tower cranes up to 600 ton-meters.',
                    'location' => 'Dubai, UAE',
                    'city' => 'Dubai',
                    'state' => 'Dubai',
                    'latitude' => 25.1885,
                    'longitude' => 55.2422,
                    'years_experience' => 14,
                    'experience_level' => 'expert',
                    'hourly_rate' => 45.00,
                    'daily_rate' => 320.00,
                    'availability' => 'available',
                    'willing_to_relocate' => true,
                    'max_travel_distance' => 120,
                    'certifications' => ['Tower Crane License', 'Mobile Crane License', 'Rigger Certificate', 'OSHA 30-Hour'],
                    'languages' => ['English', 'Irish'],
                    'is_featured' => false,
                ],
                'category' => 'Crane Operator',
                'skills' => ['Tower Crane', 'Mobile Crane', 'Rigging & Slinging', 'Load Charts', 'Signal Communication', 'Crane Inspection'],
                'experiences' => [
                    ['job_title' => 'Tower Crane Operator', 'company_name' => 'Multiplex Construction', 'location' => 'Dubai, UAE', 'start_date' => '2018-09-01', 'end_date' => null, 'is_current' => true, 'description' => 'Operating Liebherr tower crane for a 65-story super-tall building. Coordinating lifts with ground crews and maintaining daily operation logs.'],
                    ['job_title' => 'Crane Operator', 'company_name' => 'BAM Construction', 'location' => 'Dublin, Ireland', 'start_date' => '2012-03-01', 'end_date' => '2018-08-31', 'is_current' => false, 'description' => 'Operated mobile and tower cranes across various commercial construction sites in Ireland.'],
                ],
            ],

            // Heavy Equipment Operator
            [
                'name' => 'Abdul Rahman',
                'email' => 'abdul.rahman@example.com',
                'phone' => '+971512345678',
                'profile' => [
                    'title' => 'Heavy Equipment Operator',
                    'bio' => 'Versatile heavy equipment operator with 8 years of experience operating excavators, bulldozers, and loaders in road construction and earthworks projects.',
                    'location' => 'Al Ain, UAE',
                    'city' => 'Al Ain',
                    'state' => 'Abu Dhabi',
                    'latitude' => 24.1917,
                    'longitude' => 55.7606,
                    'years_experience' => 8,
                    'experience_level' => 'experienced',
                    'hourly_rate' => 30.00,
                    'daily_rate' => 220.00,
                    'availability' => 'available',
                    'willing_to_relocate' => false,
                    'max_travel_distance' => 60,
                    'certifications' => ['Heavy Equipment License', 'OSHA 10-Hour'],
                    'languages' => ['Arabic', 'English'],
                    'is_featured' => false,
                ],
                'category' => 'Heavy Equipment Operator',
                'skills' => ['Excavator Operation', 'Bulldozer Operation', 'Loader Operation', 'Compactor Operation', 'Dump Truck'],
                'experiences' => [
                    ['job_title' => 'Equipment Operator', 'company_name' => 'National Projects & Construction', 'location' => 'Al Ain, UAE', 'start_date' => '2021-04-01', 'end_date' => null, 'is_current' => true, 'description' => 'Operating CAT excavators and Komatsu bulldozers for highway expansion project.'],
                ],
            ],

            // Surveyor
            [
                'name' => 'Daniel Woo',
                'email' => 'daniel.woo@example.com',
                'phone' => '+971513456789',
                'profile' => [
                    'title' => 'Land Surveyor',
                    'bio' => 'Professional land surveyor with 9 years of experience in setting out, topographic surveys, and construction monitoring. Proficient with total stations, GPS/GNSS receivers and AutoCAD.',
                    'location' => 'Dubai, UAE',
                    'city' => 'Dubai',
                    'state' => 'Dubai',
                    'latitude' => 25.2631,
                    'longitude' => 55.3010,
                    'years_experience' => 9,
                    'experience_level' => 'experienced',
                    'hourly_rate' => 40.00,
                    'daily_rate' => 300.00,
                    'availability' => 'available',
                    'willing_to_relocate' => true,
                    'max_travel_distance' => 80,
                    'certifications' => ['Licensed Surveyor', 'AutoCAD Certified Professional', 'Drone Survey License'],
                    'languages' => ['English', 'Korean', 'Mandarin'],
                    'is_featured' => false,
                ],
                'category' => 'Surveyor',
                'skills' => ['Land Surveying', 'Setting Out', 'Total Station', 'GPS/GNSS', 'AutoCAD', 'Leveling'],
                'experiences' => [
                    ['job_title' => 'Senior Surveyor', 'company_name' => 'KEO International Consultants', 'location' => 'Dubai, UAE', 'start_date' => '2020-11-01', 'end_date' => null, 'is_current' => true, 'description' => 'Conducting topographic surveys and setting out for large-scale infrastructure projects. Managing survey data and producing as-built drawings.'],
                    ['job_title' => 'Surveyor', 'company_name' => 'Hyundai Engineering', 'location' => 'Seoul, South Korea', 'start_date' => '2017-06-01', 'end_date' => '2020-10-31', 'is_current' => false, 'description' => 'Performed land surveys and construction monitoring for metro rail extension projects.'],
                ],
            ],

            // Scaffolder
            [
                'name' => 'Deepak Sharma',
                'email' => 'deepak.sharma@example.com',
                'phone' => '+971514567890',
                'profile' => [
                    'title' => 'Advanced Scaffolder',
                    'bio' => 'Certified advanced scaffolder with 7 years of experience erecting and dismantling complex scaffolding systems. Experienced in tube & fitting, system scaffolding, and suspended platforms.',
                    'location' => 'Dubai, UAE',
                    'city' => 'Dubai',
                    'state' => 'Dubai',
                    'latitude' => 25.1124,
                    'longitude' => 55.1390,
                    'years_experience' => 7,
                    'experience_level' => 'experienced',
                    'hourly_rate' => 27.00,
                    'daily_rate' => 195.00,
                    'availability' => 'available',
                    'willing_to_relocate' => true,
                    'max_travel_distance' => 70,
                    'certifications' => ['CISRS Advanced Scaffolder', 'Working at Heights', 'OSHA 10-Hour'],
                    'languages' => ['Hindi', 'English', 'Punjabi'],
                    'is_featured' => false,
                ],
                'category' => 'Scaffolder',
                'skills' => ['Tube & Fitting', 'System Scaffolding', 'Suspended Scaffolding', 'Scaffold Inspection', 'Working at Heights', 'Safety Compliance'],
                'experiences' => [
                    ['job_title' => 'Scaffolder', 'company_name' => 'Al Futtaim Group', 'location' => 'Dubai, UAE', 'start_date' => '2022-01-01', 'end_date' => null, 'is_current' => true, 'description' => 'Erecting scaffolding for mall renovation project. Installing tube & fitting and system scaffolding for facade access.'],
                ],
            ],

            // Painter / Decorator
            [
                'name' => 'Emmanuel Adeyemi',
                'email' => 'emmanuel.adeyemi@example.com',
                'phone' => '+971515678901',
                'profile' => [
                    'title' => 'Professional Painter & Decorator',
                    'bio' => 'Experienced painter and decorator with 8 years in the construction industry. Specializes in interior/exterior painting, spray painting, and decorative finishing for luxury properties.',
                    'location' => 'Abu Dhabi, UAE',
                    'city' => 'Abu Dhabi',
                    'state' => 'Abu Dhabi',
                    'latitude' => 24.4539,
                    'longitude' => 54.3773,
                    'years_experience' => 8,
                    'experience_level' => 'experienced',
                    'hourly_rate' => 25.00,
                    'daily_rate' => 180.00,
                    'availability' => 'available',
                    'willing_to_relocate' => true,
                    'max_travel_distance' => 60,
                    'certifications' => ['Painting & Decorating NVQ', 'OSHA 10-Hour'],
                    'languages' => ['English', 'Yoruba'],
                    'is_featured' => false,
                ],
                'category' => 'Painter / Decorator',
                'skills' => ['Interior Painting', 'Exterior Painting', 'Spray Painting', 'Surface Preparation', 'Texture Finishing', 'Protective Coatings'],
                'experiences' => [
                    ['job_title' => 'Painter', 'company_name' => 'TDIC Abu Dhabi', 'location' => 'Abu Dhabi, UAE', 'start_date' => '2021-05-01', 'end_date' => null, 'is_current' => true, 'description' => 'Executing painting and decorating works for cultural district development. Interior and exterior finishes for museum buildings.'],
                ],
            ],

            // Site Engineer
            [
                'name' => 'Hassan Al-Mahmoud',
                'email' => 'hassan.mahmoud@example.com',
                'phone' => '+971516789012',
                'profile' => [
                    'title' => 'Senior Site Engineer',
                    'bio' => 'Civil engineering graduate with 11 years of site engineering experience. Expert in quality control, site supervision, and project coordination for building and infrastructure projects.',
                    'location' => 'Dubai, UAE',
                    'city' => 'Dubai',
                    'state' => 'Dubai',
                    'latitude' => 25.2048,
                    'longitude' => 55.2708,
                    'years_experience' => 11,
                    'experience_level' => 'expert',
                    'hourly_rate' => 50.00,
                    'daily_rate' => 380.00,
                    'availability' => 'busy',
                    'willing_to_relocate' => false,
                    'max_travel_distance' => 50,
                    'certifications' => ['PE (Professional Engineer)', 'PMP', 'OSHA 30-Hour', 'Chartered Engineer'],
                    'languages' => ['Arabic', 'English', 'French'],
                    'is_featured' => true,
                ],
                'category' => 'Site Engineer',
                'skills' => ['Quality Control', 'Site Supervision', 'Method Statements', 'Progress Reporting', 'AutoCAD', 'Safety Management'],
                'experiences' => [
                    ['job_title' => 'Senior Site Engineer', 'company_name' => 'Dubai Properties', 'location' => 'Dubai, UAE', 'start_date' => '2019-01-01', 'end_date' => null, 'is_current' => true, 'description' => 'Managing site operations for waterfront development. Supervising subcontractors, reviewing method statements, and ensuring quality standards.'],
                    ['job_title' => 'Site Engineer', 'company_name' => 'Bouygues Construction', 'location' => 'Doha, Qatar', 'start_date' => '2015-06-01', 'end_date' => '2018-12-31', 'is_current' => false, 'description' => 'Supervised structural and finishing works for FIFA World Cup stadium project.'],
                ],
            ],

            // Waterproofing Specialist
            [
                'name' => 'Prasad Wickrama',
                'email' => 'prasad.wickrama@example.com',
                'phone' => '+971517890123',
                'profile' => [
                    'title' => 'Waterproofing Expert',
                    'bio' => 'Specialized waterproofing technician with 10 years of experience in basement, roof, and wet-area waterproofing. Expert in membrane application, injection grouting and joint sealing systems.',
                    'location' => 'Dubai, UAE',
                    'city' => 'Dubai',
                    'state' => 'Dubai',
                    'latitude' => 25.1653,
                    'longitude' => 55.2480,
                    'years_experience' => 10,
                    'experience_level' => 'expert',
                    'hourly_rate' => 34.00,
                    'daily_rate' => 245.00,
                    'availability' => 'available',
                    'willing_to_relocate' => true,
                    'max_travel_distance' => 80,
                    'certifications' => ['IWA Certified Waterproofer', 'OSHA 10-Hour', 'Sika Applicator Certificate'],
                    'languages' => ['Sinhala', 'English', 'Tamil'],
                    'is_featured' => false,
                ],
                'category' => 'Waterproofing Specialist',
                'skills' => ['Membrane Application', 'Basement Waterproofing', 'Roof Waterproofing', 'Joint Sealing', 'Injection Grouting', 'Damp Proofing'],
                'experiences' => [
                    ['job_title' => 'Waterproofing Foreman', 'company_name' => 'Fosroc International', 'location' => 'Dubai, UAE', 'start_date' => '2020-02-01', 'end_date' => null, 'is_current' => true, 'description' => 'Leading waterproofing application crews for mega projects. Basement tanking, podium waterproofing and wet-area treatment.'],
                    ['job_title' => 'Waterproofing Applicator', 'company_name' => 'Maga Engineering', 'location' => 'Colombo, Sri Lanka', 'start_date' => '2016-05-01', 'end_date' => '2020-01-31', 'is_current' => false, 'description' => 'Applied waterproofing membranes and coatings for high-rise residential and commercial buildings.'],
                ],
            ],

            // Road / Asphalt Worker
            [
                'name' => 'Tariq Dewan',
                'email' => 'tariq.dewan@example.com',
                'phone' => '+971518901234',
                'profile' => [
                    'title' => 'Road Construction Specialist',
                    'bio' => 'Dedicated road construction worker with 6 years of experience in asphalt paving, road grading, and highway maintenance. Skilled in operating paving machines and compaction equipment.',
                    'location' => 'Ras Al Khaimah, UAE',
                    'city' => 'Ras Al Khaimah',
                    'state' => 'Ras Al Khaimah',
                    'latitude' => 25.7895,
                    'longitude' => 55.9432,
                    'years_experience' => 6,
                    'experience_level' => 'intermediate',
                    'hourly_rate' => 24.00,
                    'daily_rate' => 175.00,
                    'availability' => 'available',
                    'willing_to_relocate' => true,
                    'max_travel_distance' => 100,
                    'certifications' => ['Asphalt Paving Certificate', 'OSHA 10-Hour'],
                    'languages' => ['Bengali', 'Hindi', 'English'],
                    'is_featured' => false,
                ],
                'category' => 'Road / Asphalt Worker',
                'skills' => ['Asphalt Paving', 'Road Grading', 'Base Course Laying', 'Compaction', 'Line Marking'],
                'experiences' => [
                    ['job_title' => 'Road Worker', 'company_name' => 'RAK Public Works', 'location' => 'Ras Al Khaimah, UAE', 'start_date' => '2022-06-01', 'end_date' => null, 'is_current' => true, 'description' => 'Performing asphalt paving and road repair works on municipal roads and highways.'],
                ],
            ],

            // Tiler / Floor Layer
            [
                'name' => 'Marco Santos',
                'email' => 'marco.santos@example.com',
                'phone' => '+971519012345',
                'profile' => [
                    'title' => 'Master Tiler',
                    'bio' => 'Expert tiler with 12 years of experience in ceramic, porcelain, marble, and mosaic installations. Known for flawless precision in luxury residential and hospitality projects.',
                    'location' => 'Dubai, UAE',
                    'city' => 'Dubai',
                    'state' => 'Dubai',
                    'latitude' => 25.2285,
                    'longitude' => 55.2867,
                    'years_experience' => 12,
                    'experience_level' => 'expert',
                    'hourly_rate' => 32.00,
                    'daily_rate' => 235.00,
                    'availability' => 'available',
                    'willing_to_relocate' => false,
                    'max_travel_distance' => 50,
                    'certifications' => ['Tiling NVQ Level 3', 'OSHA 10-Hour', 'Natural Stone Installation'],
                    'languages' => ['Portuguese', 'English', 'Spanish'],
                    'is_featured' => true,
                ],
                'category' => 'Tiler / Floor Layer',
                'skills' => ['Ceramic Tiling', 'Porcelain Tiling', 'Marble Installation', 'Mosaic Work', 'Grouting', 'Epoxy Flooring'],
                'experiences' => [
                    ['job_title' => 'Master Tiler', 'company_name' => 'Jumeirah Group', 'location' => 'Dubai, UAE', 'start_date' => '2019-03-01', 'end_date' => null, 'is_current' => true, 'description' => 'Installing premium marble and porcelain tiles in 5-star hotel renovation. Custom mosaic patterns in lobbies and pool areas.'],
                    ['job_title' => 'Tiler', 'company_name' => 'Grupo Portucel', 'location' => 'Lisbon, Portugal', 'start_date' => '2014-08-01', 'end_date' => '2019-02-28', 'is_current' => false, 'description' => 'Ceramic and porcelain tiling for residential apartments and commercial spaces.'],
                ],
            ],

            // Pile Driver / Foundation Specialist
            [
                'name' => 'Wei Chen',
                'email' => 'wei.chen@example.com',
                'phone' => '+971520123456',
                'profile' => [
                    'title' => 'Foundation & Piling Engineer',
                    'bio' => 'Specialized piling technician with 9 years of experience in driven piles, bored piles, and sheet piling. Experienced in deep foundation works for high-rise and infrastructure projects.',
                    'location' => 'Abu Dhabi, UAE',
                    'city' => 'Abu Dhabi',
                    'state' => 'Abu Dhabi',
                    'latitude' => 24.4667,
                    'longitude' => 54.3667,
                    'years_experience' => 9,
                    'experience_level' => 'experienced',
                    'hourly_rate' => 38.00,
                    'daily_rate' => 275.00,
                    'availability' => 'available',
                    'willing_to_relocate' => true,
                    'max_travel_distance' => 90,
                    'certifications' => ['Piling Specialist Certificate', 'OSHA 30-Hour', 'Geotechnical Safety'],
                    'languages' => ['Mandarin', 'English', 'Cantonese'],
                    'is_featured' => false,
                ],
                'category' => 'Pile Driver / Foundation Specialist',
                'skills' => ['Driven Piles', 'Bored Piles', 'Sheet Piling', 'Pile Testing', 'Foundation Layout', 'Dewatering'],
                'experiences' => [
                    ['job_title' => 'Piling Foreman', 'company_name' => 'China State Construction', 'location' => 'Abu Dhabi, UAE', 'start_date' => '2020-08-01', 'end_date' => null, 'is_current' => true, 'description' => 'Supervising bored piling operations for a waterfront development. Managing CFA and rotary bored pile installations.'],
                    ['job_title' => 'Piling Technician', 'company_name' => 'CCCC Fourth Harbor', 'location' => 'Shenzhen, China', 'start_date' => '2017-01-01', 'end_date' => '2020-07-31', 'is_current' => false, 'description' => 'Assisted in driven pile and sheet pile installations for port expansion project.'],
                ],
            ],
        ];

        foreach ($technicians as $index => $data) {
            // Generate avatar
            $avatarPath = $this->generateAvatar($data['name'], $index);

            // Create user
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'role' => 'worker',
                'avatar' => $avatarPath,
                'password' => bcrypt('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]);

            // Create worker profile
            $profile = WorkerProfile::create([
                'user_id' => $user->id,
                ...$data['profile'],
            ]);

            // Attach job category
            $category = JobCategory::where('name', $data['category'])->first();
            if ($category) {
                $profile->jobCategories()->attach($category->id, ['is_primary' => true]);

                // Attach skills
                foreach ($data['skills'] as $skillName) {
                    $skill = Skill::where('name', $skillName)->first();
                    if ($skill) {
                        $proficiencies = ['beginner', 'intermediate', 'advanced', 'expert'];
                        $profile->skills()->attach($skill->id, [
                            'proficiency' => $proficiencies[array_rand($proficiencies)],
                        ]);
                    }
                }
            }

            // Create work experiences
            foreach ($data['experiences'] as $exp) {
                WorkExperience::create([
                    'worker_profile_id' => $profile->id,
                    ...$exp,
                ]);
            }

            // Generate portfolio photos (2-4 per technician)
            $photoCount = 2 + ($index % 3); // 2, 3, or 4 photos
            $captions = [
                'Project site work in progress',
                'Completed structural work',
                'Team collaboration on site',
                'Quality finishing details',
            ];
            for ($p = 0; $p < $photoCount; $p++) {
                $photoPath = $this->generatePortfolioPhoto($data['name'], $data['category'], $p);
                PortfolioPhoto::create([
                    'worker_profile_id' => $profile->id,
                    'path' => $photoPath,
                    'caption' => $captions[$p % count($captions)],
                    'sort_order' => $p,
                ]);
            }
        }
    }
}
