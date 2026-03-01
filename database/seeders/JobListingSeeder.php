<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\JobCategory;
use App\Models\JobListing;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class JobListingSeeder extends Seeder
{
    public function run(): void
    {
        // Create employer users with companies
        $companies = $this->createCompanies();

        // Get all categories and skills
        $categories = JobCategory::with('skills')->get()->keyBy('slug');

        // Define realistic job listings
        $jobs = [
            // Formwork Maker jobs
            [
                'title' => 'Senior Formwork Carpenter – High-Rise Project',
                'category' => 'formwork-maker',
                'description' => "We are seeking an experienced Formwork Carpenter to join our team on a major 45-storey residential tower project in downtown Douala. You will be responsible for constructing, erecting, and stripping formwork for walls, columns, and suspended slabs.\n\nThe ideal candidate has extensive experience with both timber and aluminium formwork systems and can read structural drawings with confidence. You will work closely with the site engineer to ensure all formwork is installed accurately per specifications.\n\nThis is a long-term project with excellent career growth opportunities for the right candidate.",
                'requirements' => "• Minimum 5 years experience in high-rise formwork\n• Proficiency with DOKA or PERI formwork systems\n• Ability to read and interpret structural drawings\n• Valid working at heights certification\n• Strong understanding of concrete placing sequences\n• Good physical fitness for manual handling tasks",
                'responsibilities' => "• Build and install formwork for columns, walls, beams and slabs\n• Ensure formwork is plumb, level and properly braced\n• Strip formwork safely after concrete has cured\n• Maintain and repair formwork panels\n• Coordinate with crane operators for panel lifting\n• Supervise junior formwork carpenters",
                'benefits' => "• Competitive salary with overtime pay\n• Transportation allowance\n• Lunch provided on site\n• Safety gear provided\n• Career advancement opportunities\n• Health insurance coverage",
                'employment_type' => 'full_time',
                'salary_min' => 3500,
                'salary_max' => 5500,
                'salary_period' => 'monthly',
                'location' => 'Douala, Cameroon',
                'city' => 'Douala',
                'state' => 'Littoral',
                'experience_level' => 'experienced',
                'positions_available' => 3,
                'is_featured' => true,
                'is_urgent' => false,
            ],
            [
                'title' => 'Formwork Team Lead – Bridge Construction',
                'category' => 'formwork-maker',
                'description' => "Join our infrastructure division as a Formwork Team Lead on a new bridge construction project spanning the Wouri River. You will lead a team of 12 formwork carpenters and be responsible for all formwork operations on bridge piers, abutments, and deck sections.\n\nThis role requires someone who can plan formwork sequences, manage material quantities, and ensure safety compliance across all formwork activities.",
                'requirements' => "• 7+ years formwork experience, including bridge/infrastructure\n• Leadership experience managing teams of 10+\n• Knowledge of curved and complex formwork geometry\n• Certification in scaffold and formwork inspection\n• Ability to work in challenging site conditions",
                'responsibilities' => "• Plan and coordinate all formwork operations\n• Lead and mentor a team of formwork carpenters\n• Ensure quality standards and dimensional accuracy\n• Manage formwork material inventory\n• Conduct daily toolbox talks and safety briefings\n• Report progress to the project manager",
                'benefits' => "• Premium salary package\n• Accommodation provided near site\n• Meals included\n• Monthly travel allowance\n• Performance bonuses\n• Training opportunities",
                'employment_type' => 'contract',
                'salary_min' => 5000,
                'salary_max' => 7500,
                'salary_period' => 'monthly',
                'location' => 'Kribi, Cameroon',
                'city' => 'Kribi',
                'state' => 'South',
                'experience_level' => 'expert',
                'positions_available' => 1,
                'is_featured' => true,
                'is_urgent' => true,
            ],

            // Iron Bender / Steel Fixer
            [
                'title' => 'Steel Fixer – Commercial Complex',
                'category' => 'iron-bender-steel-fixer',
                'description' => "We require skilled Steel Fixers for a large commercial complex development. The role involves cutting, bending, and tying reinforcement steel according to BBS (Bar Bending Schedules) and structural drawings.\n\nYou will work on foundations, columns, beams, and suspended slabs, ensuring all reinforcement is placed accurately before concrete pours.",
                'requirements' => "• 3+ years experience as a steel fixer\n• Ability to read BBS and structural drawings\n• Knowledge of bar spacing and cover requirements\n• Physical fitness for heavy manual work\n• Basic welding skills preferred",
                'responsibilities' => "• Cut and bend reinforcement steel to specifications\n• Fix rebar in position using tie wire\n• Ensure correct cover and spacing per drawings\n• Coordinate with formwork team on pour sequences\n• Maintain tools and equipment",
                'benefits' => "• Competitive daily rate\n• Overtime available\n• Safety equipment provided\n• Transportation to site",
                'employment_type' => 'full_time',
                'salary_min' => 2500,
                'salary_max' => 4000,
                'salary_period' => 'monthly',
                'location' => 'Yaoundé, Cameroon',
                'city' => 'Yaoundé',
                'state' => 'Centre',
                'experience_level' => 'intermediate',
                'positions_available' => 6,
                'is_featured' => false,
                'is_urgent' => true,
            ],
            [
                'title' => 'Rebar Specialist – Offshore Platform',
                'category' => 'iron-bender-steel-fixer',
                'description' => "An exciting opportunity for an experienced Rebar Specialist to work on offshore platform construction. This role involves preparing and installing heavy reinforcement for marine structures subjected to extreme load conditions.\n\nCandidates should have prior experience with large-diameter bars and mechanical couplers.",
                'requirements' => "• 5+ years steel fixing experience\n• Offshore or marine construction experience preferred\n• Mechanical coupler installation knowledge\n• Valid offshore medical certificate\n• BOSIET/HUET certification advantageous",
                'responsibilities' => "• Install heavy rebar assemblies for marine structures\n• Use mechanical couplers for bar connections\n• Work with epoxy-coated and stainless reinforcement\n• Quality check bar positions before concrete placement\n• Maintain records of rebar installation",
                'benefits' => "• Excellent offshore rates\n• Rotation schedule (28/28)\n• Full medical cover\n• Travel expenses covered\n• Career progression",
                'employment_type' => 'contract',
                'salary_min' => 8000,
                'salary_max' => 12000,
                'salary_period' => 'monthly',
                'location' => 'Limbe, Cameroon',
                'city' => 'Limbe',
                'state' => 'Southwest',
                'experience_level' => 'experienced',
                'positions_available' => 4,
                'is_featured' => true,
                'is_urgent' => false,
            ],

            // Mason / Bricklayer
            [
                'title' => 'Experienced Bricklayer – Residential Estate',
                'category' => 'mason-bricklayer',
                'description' => "We are building a premium residential estate of 120 units and need experienced bricklayers to join our masonry team. Work includes blockwork for walls, boundary fences, and decorative features.\n\nThe project uses both standard 9-inch and 6-inch blocks, with some decorative brickwork on external facades.",
                'requirements' => "• 4+ years masonry/bricklaying experience\n• Clean, accurate blockwork with consistent joints\n• Ability to build corners and quoins\n• Knowledge of damp-proof course installation\n• Can work from architect's drawings",
                'responsibilities' => "• Lay blocks and bricks to specifications\n• Build accurate corners and maintain plumb lines\n• Mix mortar to correct ratios\n• Install lintels and DPC\n• Maintain a clean and safe work area",
                'benefits' => "• Steady long-term work (18 months)\n• Weekly pay\n• Bonus for quality work\n• Tools provided\n• Housing allowance",
                'employment_type' => 'full_time',
                'salary_min' => 2000,
                'salary_max' => 3500,
                'salary_period' => 'monthly',
                'location' => 'Makepe, Douala',
                'city' => 'Makepe',
                'state' => 'Littoral',
                'experience_level' => 'intermediate',
                'positions_available' => 10,
                'is_featured' => false,
                'is_urgent' => false,
            ],

            // Concrete Worker
            [
                'title' => 'Concrete Finisher – Industrial Flooring',
                'category' => 'concrete-worker',
                'description' => "Specialist concrete finisher needed for a 25,000 sqm industrial warehouse floor. You must have experience with power troweling, laser screed operations, and achieving tight floor flatness tolerances (FM2/FL3).\n\nThis is a fast-paced project requiring precision and attention to detail.",
                'requirements' => "• 5+ years concrete finishing experience\n• Industrial flooring specialist\n• Power float and trowel proficiency\n• Understanding of floor flatness (FF/FL) requirements\n• Knowledge of curing compounds and surface hardeners",
                'responsibilities' => "• Finish concrete floors to specified tolerances\n• Operate power trowels and laser screeds\n• Apply curing compounds and hardeners\n• Cut control joints at specified locations\n• Monitor concrete temperature and curing conditions",
                'benefits' => "• Top industry rates\n• Night shift premium\n• Equipment provided\n• Performance bonus\n• Health insurance",
                'employment_type' => 'contract',
                'salary_min' => 4000,
                'salary_max' => 6000,
                'salary_period' => 'monthly',
                'location' => 'Akwa, Douala',
                'city' => 'Akwa',
                'state' => 'Littoral',
                'experience_level' => 'experienced',
                'positions_available' => 2,
                'is_featured' => true,
                'is_urgent' => true,
            ],
            [
                'title' => 'Concrete Pump Operator',
                'category' => 'concrete-worker',
                'description' => "We need a certified concrete pump operator to manage boom pump operations on our high-rise construction project. The role involves setting up the pump, managing pipeline routes, and coordinating concrete delivery with batch plant.\n\nSafety is paramount — you must have excellent knowledge of pump limitations and safe operating procedures.",
                'requirements' => "• Valid concrete pump operator license\n• 3+ years pump operating experience\n• High-rise pumping experience preferred\n• Knowledge of pump maintenance and troubleshooting\n• Strong communication skills for coordination",
                'responsibilities' => "• Set up and operate concrete boom pump\n• Plan and install pipeline routes\n• Coordinate with batch plant on delivery schedules\n• Perform daily pump inspections\n• Clean and maintain pump equipment",
                'benefits' => "• Competitive salary\n• Overtime rates\n• Training provided\n• Equipment maintained by company\n• Health and safety benefits",
                'employment_type' => 'full_time',
                'salary_min' => 3000,
                'salary_max' => 4500,
                'salary_period' => 'monthly',
                'location' => 'Bonanjo, Douala',
                'city' => 'Bonanjo',
                'state' => 'Littoral',
                'experience_level' => 'intermediate',
                'positions_available' => 1,
                'is_featured' => false,
                'is_urgent' => false,
            ],

            // Surveyor
            [
                'title' => 'Land Surveyor – Highway Project',
                'category' => 'surveyor',
                'description' => "We are recruiting a Land Surveyor for a 120km highway expansion project. You will be responsible for setting out road alignments, cross-sections, and drainage structures using total station and GPS equipment.\n\nThe role involves extensive fieldwork and coordination with the design team to resolve alignment issues.",
                'requirements' => "• BSc/HND in Surveying or Geoinformatics\n• 4+ years highway/road surveying experience\n• Proficient with Leica or Trimble total stations\n• GPS/GNSS survey experience\n• AutoCAD and Civil 3D knowledge\n• Valid driver's license",
                'responsibilities' => "• Set out road centerlines and offsets\n• Conduct cross-section and profile surveys\n• Establish control networks and benchmarks\n• Process survey data and prepare reports\n• Monitor earthwork volumes\n• Coordinate with design team on alignment changes",
                'benefits' => "• Attractive salary package\n• Field allowances\n• Vehicle provided for fieldwork\n• Equipment provided\n• Professional development support\n• Accommodation near project site",
                'employment_type' => 'contract',
                'salary_min' => 5000,
                'salary_max' => 8000,
                'salary_period' => 'monthly',
                'location' => 'Bertoua, Cameroon',
                'city' => 'Bertoua',
                'state' => 'East',
                'experience_level' => 'experienced',
                'positions_available' => 2,
                'is_featured' => true,
                'is_urgent' => false,
            ],

            // Crane Operator
            [
                'title' => 'Tower Crane Operator – Luxury Towers',
                'category' => 'crane-operator',
                'description' => "We need a certified Tower Crane Operator for twin 30-storey luxury residential towers. The operator will manage a Liebherr 280 EC-H tower crane, handling formwork panels, steel, precast elements, and general materials.\n\nThis is a premium project requiring meticulous attention to safety and precision.",
                'requirements' => "• Valid tower crane operator license\n• 5+ years tower crane experience\n• High-rise project experience essential\n• Excellent safety record\n• Good communication and coordination skills\n• Medical fitness certificate",
                'responsibilities' => "• Operate tower crane safely and efficiently\n• Respond to rigger signals accurately\n• Perform pre-operation inspections\n• Lift and position loads as directed\n• Report any mechanical issues immediately\n• Maintain crane log book",
                'benefits' => "• Premium pay rate\n• 12-hour shifts with rotation\n• Air-conditioned cab\n• Health insurance\n• Performance incentives\n• Long-term employment",
                'employment_type' => 'full_time',
                'salary_min' => 6000,
                'salary_max' => 9000,
                'salary_period' => 'monthly',
                'location' => 'Bonapriso, Douala',
                'city' => 'Bonapriso',
                'state' => 'Littoral',
                'experience_level' => 'expert',
                'positions_available' => 2,
                'is_featured' => false,
                'is_urgent' => true,
            ],

            // Heavy Equipment Operator
            [
                'title' => 'Excavator Operator – Dam Construction',
                'category' => 'heavy-equipment-operator',
                'description' => "A major dam construction project requires experienced excavator operators for earthwork and rock excavation. You will operate CAT 330 and 345 excavators in challenging terrain conditions.\n\nThe project is located in a rural area with camp accommodation provided.",
                'requirements' => "• 5+ years excavator operating experience\n• Experience with rock excavation preferred\n• Valid heavy equipment operator license\n• Dam or infrastructure project experience\n• Physically fit for remote site work",
                'responsibilities' => "• Operate excavators for bulk earthwork\n• Excavate foundation trenches\n• Load dump trucks efficiently\n• Maintain daily equipment logs\n• Conduct pre-start inspections\n• Report faults to maintenance team",
                'benefits' => "• Excellent pay with remote allowance\n• Camp accommodation and meals\n• Rotation schedule (6 weeks on / 2 weeks off)\n• Travel to/from site covered\n• Equipment training\n• Health and life insurance",
                'employment_type' => 'contract',
                'salary_min' => 5500,
                'salary_max' => 8500,
                'salary_period' => 'monthly',
                'location' => 'Lom Pangar, East',
                'city' => 'Bétaré-Oya',
                'state' => 'East',
                'experience_level' => 'experienced',
                'positions_available' => 4,
                'is_featured' => false,
                'is_urgent' => false,
            ],

            // Electrician
            [
                'title' => 'Construction Electrician – Shopping Mall',
                'category' => 'electrician-construction',
                'description' => "We need qualified construction electricians for a new shopping mall development. Work includes running conduits, pulling cables, installing distribution boards, and connecting lighting systems across 3 floors.\n\nMust be familiar with Cameroonian electrical standards and commercial installation standards.",
                'requirements' => "• Trade certificate in Electrical Installation\n• 3+ years commercial electrical experience\n• Knowledge of Cameroonian Electrical Standards\n• Conduit bending and installation skills\n• Ability to read electrical drawings\n• CAP/BEP or City & Guilds certification",
                'responsibilities' => "• Install conduit runs and cable trays\n• Pull and terminate cables\n• Install distribution boards and panels\n• Connect lighting and power circuits\n• Perform testing and commissioning\n• Ensure compliance with electrical standards",
                'benefits' => "• Competitive monthly salary\n• Tools provided\n• Certification support\n• Career advancement\n• Group health insurance\n• Weekend overtime available",
                'employment_type' => 'full_time',
                'salary_min' => 2800,
                'salary_max' => 4200,
                'salary_period' => 'monthly',
                'location' => 'Deido, Douala',
                'city' => 'Deido',
                'state' => 'Littoral',
                'experience_level' => 'intermediate',
                'positions_available' => 5,
                'is_featured' => false,
                'is_urgent' => false,
            ],

            // Plumber
            [
                'title' => 'Plumbing Foreman – Hospital Construction',
                'category' => 'plumber',
                'description' => "We are constructing a 200-bed hospital and need an experienced Plumbing Foreman to oversee all plumbing installations. This includes domestic water supply, drainage, medical gas piping, and fire sprinkler systems.\n\nHospital plumbing requires meticulous attention to hygiene standards and code compliance.",
                'requirements' => "• 7+ years plumbing experience, including healthcare projects\n• Foreman/supervisory experience required\n• Knowledge of medical gas systems\n• Fire sprinkler system experience\n• Ability to read MEP drawings\n• Strong leadership skills",
                'responsibilities' => "• Supervise plumbing installation team\n• Coordinate with MEP engineer on drawings\n• Ensure all work meets healthcare standards\n• Manage plumbing material procurement\n• Conduct pressure testing and inspections\n• Maintain as-built records",
                'benefits' => "• Senior-level salary\n• Project completion bonus\n• Vehicle allowance\n• Medical insurance for family\n• Professional development\n• Annual leave with pay",
                'employment_type' => 'full_time',
                'salary_min' => 5500,
                'salary_max' => 8000,
                'salary_period' => 'monthly',
                'location' => 'Bamenda, Cameroon',
                'city' => 'Bamenda',
                'state' => 'Northwest',
                'experience_level' => 'expert',
                'positions_available' => 1,
                'is_featured' => true,
                'is_urgent' => false,
            ],

            // Welder / Fabricator
            [
                'title' => 'Structural Welder – Steel Building',
                'category' => 'welder-fabricator',
                'description' => "Seeking certified structural welders for a pre-engineered steel building project. Work includes welding structural steel connections, purlins, girts, and base plates using SMAW and MIG processes.\n\nAll welders must pass a practical welding test before engagement.",
                'requirements' => "• Certified structural welder (AWS or equivalent)\n• 4+ years structural welding experience\n• Proficient in SMAW and GMAW processes\n• Can weld in all positions (1G-6G)\n• Blueprint reading skills\n• NDT awareness",
                'responsibilities' => "• Weld structural steel connections per WPS\n• Prepare joints by grinding and pre-heating\n• Perform visual inspection of own welds\n• Maintain welding equipment\n• Follow safety procedures at all times\n• Document daily welding records",
                'benefits' => "• Top welder rates\n• Welding consumables provided\n• Safety gear included\n• Overtime available\n• Per diem for out-of-town work\n• Certification renewal support",
                'employment_type' => 'contract',
                'salary_min' => 3500,
                'salary_max' => 5500,
                'salary_period' => 'monthly',
                'location' => 'Edéa, Littoral',
                'city' => 'Edéa',
                'state' => 'Littoral',
                'experience_level' => 'experienced',
                'positions_available' => 6,
                'is_featured' => false,
                'is_urgent' => true,
            ],

            // Site Engineer
            [
                'title' => 'Junior Site Engineer – Mixed-Use Development',
                'category' => 'site-engineer',
                'description' => "An excellent opportunity for a graduate engineer to gain hands-on site experience on a large mixed-use development comprising residential towers, retail spaces, and underground parking.\n\nYou will work under a Senior Site Engineer and learn all aspects of construction supervision from foundations to finishing.",
                'requirements' => "• BSc/BEng in Civil Engineering (minimum 2:1)\n• 0-2 years site experience\n• ONIGC registration (or in progress)\n• AutoCAD proficiency\n• Microsoft Office skills\n• Willingness to learn and take direction",
                'responsibilities' => "• Assist in supervising daily construction activities\n• Conduct quality checks on concrete, steel, and masonry\n• Maintain site diary and daily reports\n• Take off quantities for interim payments\n• Attend site meetings and prepare minutes\n• Monitor material deliveries",
                'benefits' => "• Graduate training program\n• Mentorship from senior engineers\n• Study leave for professional exams\n• Health insurance\n• Competitive graduate salary\n• Fast-track career progression",
                'employment_type' => 'full_time',
                'salary_min' => 1800,
                'salary_max' => 2800,
                'salary_period' => 'monthly',
                'location' => 'Bonanjo, Douala',
                'city' => 'Bonanjo',
                'state' => 'Littoral',
                'experience_level' => 'entry',
                'positions_available' => 3,
                'is_featured' => false,
                'is_urgent' => false,
            ],
            [
                'title' => 'Senior Site Engineer – Refinery Expansion',
                'category' => 'site-engineer',
                'description' => "A multinational construction firm seeks a Senior Site Engineer for a refinery expansion project. You will manage concrete and structural steel works, coordinate subcontractors, and ensure quality compliance with international standards.\n\nThis is a high-value industrial project offering exceptional compensation.",
                'requirements' => "• BSc/BEng Civil or Structural Engineering\n• 8+ years site engineering experience\n• Industrial/oil & gas project experience required\n• Knowledge of international codes (ACI, AISC, BS)\n• Strong project management skills\n• Professional registration (ONIGC)",
                'responsibilities' => "• Manage all civil/structural works on site\n• Review method statements and risk assessments\n• Supervise concrete and steel operations\n• Coordinate with client's representative\n• Prepare progress reports and claims\n• Ensure HSE compliance across all activities",
                'benefits' => "• Exceptional salary package\n• Hardship and location allowance\n• Fully furnished accommodation\n• Annual leave with flights\n• Professional development budget\n• End-of-project bonus",
                'employment_type' => 'contract',
                'salary_min' => 10000,
                'salary_max' => 18000,
                'salary_period' => 'monthly',
                'location' => 'Limbe, Southwest',
                'city' => 'Limbe',
                'state' => 'Southwest',
                'experience_level' => 'expert',
                'positions_available' => 1,
                'is_featured' => true,
                'is_urgent' => true,
            ],

            // Scaffolder
            [
                'title' => 'Scaffolding Supervisor – Petrochemical Plant',
                'category' => 'scaffolder',
                'description' => "We require a Scaffolding Supervisor for maintenance turnaround activities at a petrochemical plant. You will plan, erect, and inspect scaffolding for maintenance teams working at various heights and confined spaces.",
                'requirements' => "• 6+ years scaffolding experience\n• CISRS Advanced Scaffolder or equivalent\n• Industrial/petrochemical experience preferred\n• Scaffold inspection certification\n• Working at heights trained\n• Permit to work system knowledge",
                'responsibilities' => "• Plan scaffolding requirements for maintenance activities\n• Supervise erection and dismantling teams\n• Conduct scaffold inspections and tag systems\n• Ensure compliance with safety standards\n• Coordinate with maintenance planners\n• Manage scaffold material inventory",
                'benefits' => "• Industrial-rate salary\n• Turnaround bonus\n• PPE provided\n• Accommodation during turnaround\n• Meals on site\n• Insurance coverage",
                'employment_type' => 'temporary',
                'salary_min' => 4500,
                'salary_max' => 7000,
                'salary_period' => 'monthly',
                'location' => 'Limbe, Southwest',
                'city' => 'Limbe',
                'state' => 'Southwest',
                'experience_level' => 'experienced',
                'positions_available' => 2,
                'is_featured' => false,
                'is_urgent' => true,
            ],

            // Painter
            [
                'title' => 'Industrial Painter – Tank Farm',
                'category' => 'painter-decorator',
                'description' => "Experienced industrial painter needed for protective coating application on storage tanks and steel structures. Work includes surface preparation (sandblasting), primer application, and topcoat finishing using airless spray equipment.",
                'requirements' => "• 4+ years industrial painting experience\n• Surface preparation and sandblasting skills\n• Airless spray painting proficiency\n• Knowledge of coating systems (epoxy, polyurethane)\n• NACE or SSPC certification advantageous\n• Working at heights certified",
                'responsibilities' => "• Prepare surfaces by sandblasting to specified standard\n• Apply primer and topcoats per coating schedule\n• Measure wet and dry film thickness\n• Maintain spray equipment\n• Follow material safety data sheets\n• Document coating application records",
                'benefits' => "• Specialist pay rate\n• Health screening provided\n• Respiratory equipment supplied\n• Hazard allowance\n• Training opportunities\n• Transport to site",
                'employment_type' => 'contract',
                'salary_min' => 3000,
                'salary_max' => 5000,
                'salary_period' => 'monthly',
                'location' => 'Bonabéri, Douala',
                'city' => 'Bonabéri',
                'state' => 'Littoral',
                'experience_level' => 'experienced',
                'positions_available' => 3,
                'is_featured' => false,
                'is_urgent' => false,
            ],

            // Tiler
            [
                'title' => 'Master Tiler – 5-Star Hotel Renovation',
                'category' => 'tiler-floor-layer',
                'description' => "A 5-star hotel renovation project requires a master tiler with experience in luxury finishes. Work includes laying imported marble, porcelain tiles, and mosaic features in lobbies, bathrooms, and pool areas.\n\nPrecision and aesthetic sensitivity are essential for this premium project.",
                'requirements' => "• 6+ years premium tiling experience\n• Experience with marble and natural stone\n• Mosaic and decorative tiling skills\n• Knowledge of waterproofing for wet areas\n• Attention to detail and pattern matching\n• Previous hotel or luxury project experience",
                'responsibilities' => "• Install marble, porcelain and mosaic tiles\n• Prepare substrates and apply waterproofing\n• Cut tiles accurately including complex shapes\n• Grout and seal tile installations\n• Ensure consistent joint widths and level surfaces\n• Protect finished work from damage",
                'benefits' => "• Premium craftsman rate\n• Specialist tools provided\n• Meals in hotel during project\n• Project completion bonus\n• Reference letter on completion\n• Future project opportunities",
                'employment_type' => 'contract',
                'salary_min' => 4000,
                'salary_max' => 6500,
                'salary_period' => 'monthly',
                'location' => 'Bonanjo, Douala',
                'city' => 'Bonanjo',
                'state' => 'Littoral',
                'experience_level' => 'expert',
                'positions_available' => 2,
                'is_featured' => true,
                'is_urgent' => false,
            ],

            // Waterproofing Specialist
            [
                'title' => 'Waterproofing Applicator – Basement Works',
                'category' => 'waterproofing-specialist',
                'description' => "Specialized waterproofing applicator needed for 3-level basement waterproofing on a commercial tower. Work includes membrane application, injection grouting for leaks, and bentonite waterstop installation.\n\nMust have experience with below-grade waterproofing systems.",
                'requirements' => "• 3+ years waterproofing experience\n• Knowledge of membrane systems (torch-on, self-adhesive)\n• Injection grouting skills\n• Understanding of hydrostatic pressure\n• Manufacturer training/certification preferred",
                'responsibilities' => "• Apply waterproofing membranes to basement walls and slabs\n• Install waterstops at construction joints\n• Perform injection grouting to stop active leaks\n• Conduct flood testing of completed areas\n• Document all waterproofing applications\n• Coordinate with structural team on pour sequences",
                'benefits' => "• Specialist rate\n• Material training provided\n• Safety gear included\n• Performance bonus for leak-free completion\n• Ongoing project work available",
                'employment_type' => 'contract',
                'salary_min' => 3200,
                'salary_max' => 5000,
                'salary_period' => 'monthly',
                'location' => 'Bonapriso, Douala',
                'city' => 'Bonapriso',
                'state' => 'Littoral',
                'experience_level' => 'intermediate',
                'positions_available' => 2,
                'is_featured' => false,
                'is_urgent' => false,
            ],

            // Road / Asphalt Worker
            [
                'title' => 'Asphalt Paving Machine Operator',
                'category' => 'road-asphalt-worker',
                'description' => "An established road construction company requires an experienced asphalt paving machine operator for a state highway rehabilitation project. You will operate Vogele or Volvo asphalt pavers to lay wearing course and binder course materials.",
                'requirements' => "• 4+ years paver operation experience\n• Familiarity with Vogele or similar pavers\n• Understanding of asphalt temperature requirements\n• Knowledge of compaction techniques\n• Valid heavy equipment license\n• Road construction experience",
                'responsibilities' => "• Operate asphalt paving machine\n• Ensure consistent mat thickness and smoothness\n• Coordinate with roller operators for compaction\n• Monitor asphalt temperature during paving\n• Perform basic machine maintenance\n• Communicate with flaggers for traffic control",
                'benefits' => "• Excellent pay with hardship allowance\n• Accommodation provided\n• Meals on site\n• Equipment training\n• Insurance coverage\n• Job security for project duration",
                'employment_type' => 'full_time',
                'salary_min' => 3500,
                'salary_max' => 5500,
                'salary_period' => 'monthly',
                'location' => 'Bafoussam, Cameroon',
                'city' => 'Bafoussam',
                'state' => 'West',
                'experience_level' => 'experienced',
                'positions_available' => 2,
                'is_featured' => false,
                'is_urgent' => false,
            ],

            // Pile Driver
            [
                'title' => 'Piling Rig Operator – Foundation Works',
                'category' => 'pile-driver-foundation-specialist',
                'description' => "Leading piling contractor seeks experienced piling rig operator for bored pile installation on a major infrastructure project. You will operate CFA and rotary bored piling rigs to install piles up to 1500mm diameter.\n\nStrong understanding of soil conditions and pile installation monitoring is essential.",
                'requirements' => "• 5+ years piling rig operating experience\n• CFA and rotary bored pile experience\n• Knowledge of pile monitoring equipment\n• Understanding of geotechnical conditions\n• Valid heavy equipment license\n• Safety-conscious attitude",
                'responsibilities' => "• Operate piling rigs for bore/CFA pile installation\n• Monitor pile depth, torque, and concrete volume\n• Coordinate with ground crew and banksman\n• Maintain piling records and logs\n• Assist with pile integrity testing setup\n• Ensure safe rig operation at all times",
                'benefits' => "• Top operator rates\n• Specialized training\n• Accommodation for remote projects\n• Long-term employment\n• Health and dental insurance\n• Annual bonus",
                'employment_type' => 'full_time',
                'salary_min' => 6000,
                'salary_max' => 9500,
                'salary_period' => 'monthly',
                'location' => 'Garoua, Cameroon',
                'city' => 'Garoua',
                'state' => 'North',
                'experience_level' => 'expert',
                'positions_available' => 1,
                'is_featured' => true,
                'is_urgent' => false,
            ],

            // Daily rate jobs
            [
                'title' => 'Daily Hire Labourers – Site Clearance',
                'category' => 'concrete-worker',
                'description' => "We need reliable daily hire labourers for site clearance and preparation work on a new development site. Work includes vegetation clearing, rubble removal, and site leveling.\n\nNo prior construction experience required, but a willingness to work hard is essential.",
                'requirements' => "• Physical fitness for manual work\n• Willingness to follow instructions\n• Punctual and reliable\n• Own safety boots preferred\n• Team player attitude",
                'responsibilities' => "• Clear vegetation and debris from site\n• Load and unload construction materials\n• Assist skilled workers as needed\n• Maintain a tidy site\n• Follow all safety instructions",
                'benefits' => "• Daily cash payment\n• Lunch provided\n• Safety gear provided\n• Potential for ongoing work\n• Training for keen workers",
                'employment_type' => 'daily',
                'salary_min' => 15,
                'salary_max' => 25,
                'salary_period' => 'daily',
                'location' => 'Kotto, Douala',
                'city' => 'Kotto',
                'state' => 'Littoral',
                'experience_level' => 'entry',
                'positions_available' => 20,
                'is_featured' => false,
                'is_urgent' => true,
            ],

            // Carpenter
            [
                'title' => 'Finish Carpenter – Luxury Residences',
                'category' => 'carpenter',
                'description' => "High-end residential developer seeks a skilled finish carpenter for interior woodwork on luxury apartments. Work includes custom door frames, built-in wardrobes, kitchen cabinetry, and decorative ceiling Details.\n\nOnly applicants with a portfolio of premium residential work will be considered.",
                'requirements' => "• 6+ years finish carpentry experience\n• Portfolio of high-end residential work\n• Proficiency with power and hand tools\n• Knowledge of wood species and finishes\n• Ability to work from detailed drawings\n• Meticulous attention to detail",
                'responsibilities' => "• Install custom door frames and architraves\n• Build and install fitted wardrobes\n• Install kitchen cabinetry and countertops\n• Create decorative wood ceiling features\n• Apply wood finishes and stains\n• Ensure all work meets luxury standards",
                'benefits' => "• Premium craftsman salary\n• Specialist tools allowance\n• Transportation provided\n• Stable long-term work\n• Work showcased in portfolio\n• Year-end bonus",
                'employment_type' => 'full_time',
                'salary_min' => 3800,
                'salary_max' => 6000,
                'salary_period' => 'monthly',
                'location' => 'Bonamoussadi, Douala',
                'city' => 'Bonamoussadi',
                'state' => 'Littoral',
                'experience_level' => 'expert',
                'positions_available' => 2,
                'is_featured' => true,
                'is_urgent' => false,
            ],

            // Part-time jobs
            [
                'title' => 'Part-Time Surveyor Assistant',
                'category' => 'surveyor',
                'description' => "Survey firm looking for a part-time survey assistant to help with fieldwork on weekends and evenings. Duties include holding the prism pole, recording measurements, and assisting with equipment setup.\n\nIdeal for surveying students or graduates looking to gain practical experience.",
                'requirements' => "• Studying or graduated in Surveying/Geomatics\n• Basic knowledge of survey instruments\n• Physical fitness for outdoor work\n• Available for weekend fieldwork\n• Own transportation preferred",
                'responsibilities' => "• Assist surveyor with field measurements\n• Hold prism pole and targets\n• Record field data\n• Help transport and set up equipment\n• Prepare simple field sketches",
                'benefits' => "• Flexible schedule\n• Hands-on learning opportunity\n• Mentorship from licensed surveyor\n• Equipment usage experience\n• Reference for future employment",
                'employment_type' => 'part_time',
                'salary_min' => 800,
                'salary_max' => 1200,
                'salary_period' => 'monthly',
                'location' => 'Bali, Douala',
                'city' => 'Bali',
                'state' => 'Littoral',
                'experience_level' => 'entry',
                'positions_available' => 1,
                'is_featured' => false,
                'is_urgent' => false,
            ],

            // Remote-eligible
            [
                'title' => 'BIM Modeler – Structural (Remote)',
                'category' => 'site-engineer',
                'description' => "A consulting engineering firm is hiring a remote BIM Modeler to create structural Revit models for commercial and residential projects. You will convert 2D structural drawings into detailed 3D BIM models with rebar detailing.\n\nThis is a fully remote position — you can work from anywhere with a stable internet connection.",
                'requirements' => "• 3+ years Revit Structure experience\n• Strong understanding of structural systems\n• Experience with rebar modeling in Revit\n• Knowledge of LOD 300-400 modeling standards\n• AutoCAD proficiency\n• Reliable internet connection",
                'responsibilities' => "• Create structural Revit models from 2D drawings\n• Model foundations, columns, beams, and slabs\n• Detail reinforcement in 3D\n• Coordinate with architectural and MEP models\n• Produce shop drawings from BIM model\n• Participate in weekly coordination meetings",
                'benefits' => "• Work from home\n• Flexible hours\n• Software licenses provided\n• Hardware allowance\n• Monthly internet stipend\n• Annual bonus",
                'employment_type' => 'full_time',
                'salary_min' => 3000,
                'salary_max' => 5000,
                'salary_period' => 'monthly',
                'location' => 'Remote, Cameroon',
                'city' => null,
                'state' => null,
                'is_remote' => true,
                'experience_level' => 'intermediate',
                'positions_available' => 2,
                'is_featured' => false,
                'is_urgent' => false,
            ],
        ];

        foreach ($jobs as $jobData) {
            $categorySlug = $jobData['category'];
            unset($jobData['category']);

            $category = $categories->get($categorySlug);
            $company = $companies->random();

            $slug = Str::slug($jobData['title']);
            // Ensure unique slug
            $count = JobListing::where('slug', 'like', $slug . '%')->count();
            if ($count > 0) {
                $slug .= '-' . ($count + 1);
            }

            $job = JobListing::create([
                ...$jobData,
                'company_id' => $company->id,
                'user_id' => $company->user_id,
                'job_category_id' => $category?->id,
                'slug' => $slug,
                'is_remote' => $jobData['is_remote'] ?? false,
                'status' => 'active',
                'views_count' => rand(5, 450),
                'application_deadline' => now()->addDays(rand(14, 90)),
                'start_date' => now()->addDays(rand(7, 60)),
            ]);

            // Attach skills from the category
            if ($category && $category->skills->isNotEmpty()) {
                $skillIds = $category->skills
                    ->random(min(rand(3, 5), $category->skills->count()))
                    ->pluck('id')
                    ->mapWithKeys(fn($id) => [$id => ['is_required' => (bool) rand(0, 1)]])
                    ->toArray();

                $job->skills()->attach($skillIds);
            }
        }
    }

    private function createCompanies(): \Illuminate\Support\Collection
    {
        $companiesData = [
            [
                'name' => 'BuildRight Construction Ltd',
                'description' => 'Leading construction company specializing in residential and commercial developments across Cameroon.',
                'city' => 'Douala', 'state' => 'Littoral', 'country' => 'Cameroon',
                'company_size' => '201-500', 'founded_year' => 2005, 'is_verified' => true,
            ],
            [
                'name' => 'PeakStruct Engineering',
                'description' => 'Premier structural engineering and construction firm with over 15 years experience in high-rise buildings.',
                'city' => 'Yaoundé', 'state' => 'Centre', 'country' => 'Cameroon',
                'company_size' => '51-200', 'founded_year' => 2010, 'is_verified' => true,
            ],
            [
                'name' => 'Atlantic Infrastructure Group',
                'description' => 'Multinational infrastructure contractor delivering bridges, highways, and marine structures across Central Africa.',
                'city' => 'Limbe', 'state' => 'Southwest', 'country' => 'Cameroon',
                'company_size' => '500+', 'founded_year' => 1998, 'is_verified' => true, 'is_featured' => true,
            ],
            [
                'name' => 'SolidBase Foundations',
                'description' => 'Specialist piling and foundation contractor with a fleet of modern piling rigs.',
                'city' => 'Douala', 'state' => 'Littoral', 'country' => 'Cameroon',
                'company_size' => '51-200', 'founded_year' => 2012, 'is_verified' => true,
            ],
            [
                'name' => 'GreenVille Developers',
                'description' => 'Award-winning real estate developer focused on sustainable residential communities.',
                'city' => 'Douala', 'state' => 'Littoral', 'country' => 'Cameroon',
                'company_size' => '201-500', 'founded_year' => 2008, 'is_verified' => true,
            ],
            [
                'name' => 'Wouri Fabricators',
                'description' => 'Industrial fabrication and installation company serving the oil & gas sector.',
                'city' => 'Limbe', 'state' => 'Southwest', 'country' => 'Cameroon',
                'company_size' => '201-500', 'founded_year' => 2003, 'is_verified' => true,
            ],
            [
                'name' => 'Sahel Road Builders',
                'description' => 'Specialized road and highway construction company operating across Northern Cameroon.',
                'city' => 'Garoua', 'state' => 'North', 'country' => 'Cameroon',
                'company_size' => '500+', 'founded_year' => 2000, 'is_verified' => true,
            ],
            [
                'name' => 'Crown MEP Services',
                'description' => 'Full-service mechanical, electrical, and plumbing contractor for commercial and institutional projects.',
                'city' => 'Bamenda', 'state' => 'Northwest', 'country' => 'Cameroon',
                'company_size' => '51-200', 'founded_year' => 2015, 'is_verified' => true,
            ],
        ];

        $companies = collect();

        foreach ($companiesData as $companyData) {
            $user = User::create([
                'name' => $companyData['name'] . ' HR',
                'email' => Str::slug($companyData['name']) . '@civilhire.com',
                'password' => bcrypt('password'),
                'role' => 'employer',
                'is_active' => true,
                'email_verified_at' => now(),
            ]);

            $company = Company::create([
                ...$companyData,
                'user_id' => $user->id,
                'slug' => Str::slug($companyData['name']),
                'email' => Str::slug($companyData['name']) . '@civilhire.com',
                'is_featured' => $companyData['is_featured'] ?? false,
            ]);

            $companies->push($company);
        }

        return $companies;
    }
}