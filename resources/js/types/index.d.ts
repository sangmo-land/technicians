export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: 'worker' | 'employer' | 'admin';
    avatar?: string;
    is_active: boolean;
    email_verified_at?: string;
    worker_profile?: WorkerProfile;
    company?: Company;
    reviews_received?: Review[];
}

export interface JobCategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    is_active: boolean;
    skills?: Skill[];
    skills_count?: number;
    job_listings_count?: number;
    worker_profiles_count?: number;
}

export interface Skill {
    id: number;
    name: string;
    slug: string;
    job_category_id?: number;
    pivot?: {
        proficiency?: string;
        is_required?: boolean;
    };
}

export interface WorkerProfile {
    id: number;
    user_id: number;
    user?: User;
    professional_title?: string;
    title?: string;
    bio?: string;
    location?: string;
    city?: string;
    state?: string;
    country?: string;
    years_experience: number;
    years_of_experience?: number;
    experience_level: 'entry' | 'intermediate' | 'experienced' | 'expert';
    hourly_rate?: string;
    daily_rate?: string;
    availability: 'available' | 'busy' | 'not_available';
    is_available?: boolean;
    available_from?: string;
    willing_to_relocate: boolean;
    max_travel_distance?: number;
    certifications?: string;
    languages?: string;
    phone_secondary?: string;
    resume?: string;
    is_featured: boolean;
    profile_views: number;
    views_count?: number;
    skills?: Skill[];
    categories?: JobCategory[];
    job_categories?: JobCategory[];
    work_experiences?: WorkExperience[];
    portfolio_photos?: PortfolioPhoto[];
}

export interface PortfolioPhoto {
    id: number;
    worker_profile_id: number;
    path: string;
    caption?: string;
    sort_order: number;
}

export interface Company {
    id: number;
    user_id: number;
    user?: User;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    cover_image?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    company_size?: string;
    employee_count?: number;
    specializations?: string;
    founded_year?: number;
    is_verified: boolean;
    is_featured: boolean;
    job_listings_count?: number;
    active_listings_count?: number;
}

export interface JobListing {
    id: number;
    company_id: number;
    user_id: number;
    job_category_id?: number;
    title: string;
    slug: string;
    description: string;
    requirements?: string;
    responsibilities?: string;
    benefits?: string;
    employment_type: 'full_time' | 'part_time' | 'contract' | 'temporary' | 'daily';
    salary_min?: string;
    salary_max?: string;
    salary_period: string;
    location: string;
    city?: string;
    state?: string;
    is_remote: boolean;
    experience_level: string;
    positions_available: number;
    application_deadline?: string;
    start_date?: string;
    project_name?: string;
    project_duration_months?: number;
    status: 'draft' | 'active' | 'paused' | 'closed' | 'expired';
    is_featured: boolean;
    is_urgent: boolean;
    views_count: number;
    created_at: string;
    company?: Company;
    job_category?: JobCategory;
    skills?: Skill[];
    applications_count?: number;
    is_saved?: boolean;
    has_applied?: boolean;
}

export interface JobApplication {
    id: number;
    job_listing_id: number;
    user_id: number;
    cover_letter?: string;
    resume?: string;
    expected_salary?: string;
    available_start_date?: string;
    status: 'pending' | 'reviewed' | 'shortlisted' | 'interview' | 'offered' | 'accepted' | 'rejected' | 'withdrawn';
    employer_notes?: string;
    reviewed_at?: string;
    created_at: string;
    job_listing?: JobListing;
    user?: User;
}

export interface WorkExperience {
    id: number;
    worker_profile_id: number;
    job_title: string;
    company_name: string;
    project_name?: string;
    description?: string;
    location?: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
}

export interface Review {
    id: number;
    reviewer_id: number;
    reviewee_id: number;
    job_listing_id?: number;
    rating: number;
    comment?: string;
    type: 'worker_review' | 'employer_review';
    is_approved: boolean;
    created_at: string;
    reviewer?: User;
    reviewee?: User;
}

export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    job_listing_id?: number;
    body: string;
    read_at?: string;
    created_at: string;
    sender?: User;
    receiver?: User;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url?: string;
    path: string;
    per_page: number;
    prev_page_url?: string;
    to: number;
    total: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};
