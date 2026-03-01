<?php

namespace Database\Seeders;

use App\Models\JobCategory;
use App\Models\Skill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class JobCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Formwork Maker',
                'description' => 'Specialists in building and installing formwork for concrete structures including walls, columns, slabs and beams.',
                'icon' => 'building',
                'skills' => ['Timber Formwork', 'Steel Formwork', 'Aluminium Formwork', 'Slip Forming', 'Form Stripping', 'Blueprint Reading', 'Shoring Systems'],
            ],
            [
                'name' => 'Iron Bender / Steel Fixer',
                'description' => 'Experts in cutting, bending, and fixing reinforcement steel bars for concrete structures.',
                'icon' => 'wrench',
                'skills' => ['Rebar Cutting', 'Rebar Bending', 'Bar Tying', 'Mesh Fixing', 'Structural Steel Reading', 'BBS (Bar Bending Schedule)', 'Welding Rebar'],
            ],
            [
                'name' => 'Mason / Bricklayer',
                'description' => 'Skilled workers who lay bricks, blocks, stones and other materials to build walls, foundations and structures.',
                'icon' => 'cube',
                'skills' => ['Block Laying', 'Brick Laying', 'Stone Masonry', 'Plastering', 'Pointing & Jointing', 'Foundation Work', 'Tiling'],
            ],
            [
                'name' => 'Concrete Worker',
                'description' => 'Workers specializing in mixing, pouring, and finishing concrete for various construction applications.',
                'icon' => 'beaker',
                'skills' => ['Concrete Mixing', 'Concrete Pouring', 'Concrete Finishing', 'Concrete Curing', 'Stamped Concrete', 'Concrete Pumping', 'Quality Testing'],
            ],
            [
                'name' => 'Carpenter',
                'description' => 'Craftspeople who work with wood and timber for construction framing, finishing, and custom structures.',
                'icon' => 'hammer',
                'skills' => ['Rough Carpentry', 'Finish Carpentry', 'Roof Framing', 'Door & Window Installation', 'Cabinet Making', 'Structural Timber', 'Wood Finishing'],
            ],
            [
                'name' => 'Surveyor',
                'description' => 'Professionals who measure and map land, set out construction points, and monitor building alignments.',
                'icon' => 'map',
                'skills' => ['Land Surveying', 'Setting Out', 'Leveling', 'Total Station', 'GPS/GNSS', 'AutoCAD', 'GIS Mapping'],
            ],
            [
                'name' => 'Crane Operator',
                'description' => 'Licensed operators of tower cranes, mobile cranes, and other lifting equipment on construction sites.',
                'icon' => 'arrow-up',
                'skills' => ['Tower Crane', 'Mobile Crane', 'Overhead Crane', 'Rigging & Slinging', 'Load Charts', 'Signal Communication', 'Crane Inspection'],
            ],
            [
                'name' => 'Heavy Equipment Operator',
                'description' => 'Operators of bulldozers, excavators, loaders, graders, and other heavy earth-moving machinery.',
                'icon' => 'truck',
                'skills' => ['Excavator Operation', 'Bulldozer Operation', 'Loader Operation', 'Grader Operation', 'Backhoe Operation', 'Compactor Operation', 'Dump Truck'],
            ],
            [
                'name' => 'Electrician (Construction)',
                'description' => 'Electrical workers who install, maintain, and repair electrical systems in construction projects.',
                'icon' => 'bolt',
                'skills' => ['Conduit Installation', 'Wire Pulling', 'Panel Boards', 'Lighting Systems', 'Power Distribution', 'Grounding Systems', 'Electrical Testing'],
            ],
            [
                'name' => 'Plumber',
                'description' => 'Skilled workers who install and maintain water supply, drainage, and sewage systems in buildings.',
                'icon' => 'droplet',
                'skills' => ['Pipe Fitting', 'Drainage Systems', 'Water Supply', 'Sewage Systems', 'Fire Sprinkler', 'Pipe Welding', 'Leak Detection'],
            ],
            [
                'name' => 'Welder / Fabricator',
                'description' => 'Specialists in joining metals through welding and fabricating structural steel components.',
                'icon' => 'fire',
                'skills' => ['Arc Welding (SMAW)', 'MIG Welding', 'TIG Welding', 'Structural Welding', 'Pipe Welding', 'Metal Fabrication', 'Blueprint Reading'],
            ],
            [
                'name' => 'Painter / Decorator',
                'description' => 'Workers who prepare surfaces and apply paint, coatings, and decorative finishes to buildings.',
                'icon' => 'paint-brush',
                'skills' => ['Surface Preparation', 'Interior Painting', 'Exterior Painting', 'Spray Painting', 'Wallpapering', 'Protective Coatings', 'Texture Finishing'],
            ],
            [
                'name' => 'Scaffolder',
                'description' => 'Workers who erect and dismantle scaffolding systems to provide safe working platforms at height.',
                'icon' => 'layers',
                'skills' => ['Tube & Fitting', 'System Scaffolding', 'Suspended Scaffolding', 'Scaffold Inspection', 'Working at Heights', 'Load Calculations', 'Safety Compliance'],
            ],
            [
                'name' => 'Site Engineer',
                'description' => 'Engineers who supervise construction activities, quality control, and ensure adherence to specifications.',
                'icon' => 'clipboard',
                'skills' => ['Quality Control', 'Site Supervision', 'Method Statements', 'Progress Reporting', 'AutoCAD', 'Structural Analysis', 'Safety Management'],
            ],
            [
                'name' => 'Waterproofing Specialist',
                'description' => 'Experts in applying waterproofing membranes and systems to protect structures from water infiltration.',
                'icon' => 'shield',
                'skills' => ['Membrane Application', 'Basement Waterproofing', 'Roof Waterproofing', 'Joint Sealing', 'Injection Grouting', 'Damp Proofing', 'Surface Treatment'],
            ],
            [
                'name' => 'Road / Asphalt Worker',
                'description' => 'Workers specializing in road construction, asphalt paving, and highway maintenance.',
                'icon' => 'road',
                'skills' => ['Asphalt Paving', 'Road Grading', 'Base Course Laying', 'Line Marking', 'Pothole Repair', 'Compaction', 'Drainage Installation'],
            ],
            [
                'name' => 'Pile Driver / Foundation Specialist',
                'description' => 'Workers who install deep foundations including driven piles, bored piles, and caissons.',
                'icon' => 'arrow-down',
                'skills' => ['Driven Piles', 'Bored Piles', 'Sheet Piling', 'Pile Testing', 'Foundation Layout', 'Soil Investigation', 'Dewatering'],
            ],
            [
                'name' => 'Tiler / Floor Layer',
                'description' => 'Craftspeople who install ceramic, porcelain, marble, and other tile materials on floors and walls.',
                'icon' => 'grid',
                'skills' => ['Ceramic Tiling', 'Porcelain Tiling', 'Marble Installation', 'Mosaic Work', 'Grouting', 'Vinyl Flooring', 'Epoxy Flooring'],
            ],
        ];

        foreach ($categories as $categoryData) {
            $skills = $categoryData['skills'];
            unset($categoryData['skills']);

            $category = JobCategory::create([
                ...$categoryData,
                'slug' => Str::slug($categoryData['name']),
            ]);

            foreach ($skills as $skillName) {
                Skill::firstOrCreate(
                    ['slug' => Str::slug($skillName)],
                    [
                        'name' => $skillName,
                        'job_category_id' => $category->id,
                    ]
                );
            }
        }
    }
}
