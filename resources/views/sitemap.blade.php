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

    {{-- Category-filtered worker pages --}}
    @foreach($categories as $cat)
    <url>
        <loc>{{ url('/workers?category=' . $cat->id) }}</loc>
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
</urlset>
