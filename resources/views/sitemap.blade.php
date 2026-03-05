<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    {{-- Static pages --}}
    @foreach($staticPages as $page)
    <url>
        <loc>{{ url($page['url']) }}</loc>
        <changefreq>{{ $page['changefreq'] }}</changefreq>
        <priority>{{ $page['priority'] }}</priority>
    </url>
    @endforeach

    {{-- Category pages (workers filtered by category) --}}
    @foreach($categories as $cat)
    <url>
        <loc>{{ url('/workers?category=' . $cat->id) }}</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    @endforeach

    {{-- Category pages (jobs filtered by category) --}}
    @foreach($categories as $cat)
    <url>
        <loc>{{ url('/jobs?category=' . $cat->id) }}</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    @endforeach

    {{-- Individual worker profiles --}}
    @foreach($workers as $worker)
    <url>
        <loc>{{ url('/workers/' . $worker->id) }}</loc>
        <lastmod>{{ $worker->updated_at->toW3cString() }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    @endforeach

    {{-- Individual job listings --}}
    @foreach($jobs as $job)
    <url>
        <loc>{{ url('/jobs/' . $job->id) }}</loc>
        <lastmod>{{ $job->updated_at->toW3cString() }}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
    </url>
    @endforeach
</urlset>
