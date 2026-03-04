<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'NexJobs') }}</title>

        <!-- SEO Global Meta -->
        @if(app()->getLocale() === 'fr')
        <meta name="description" content="NexJobs — La plateforme n°1 au Cameroun pour trouver et embaucher des ouvriers qualifiés du bâtiment. Parcourez les maçons, électriciens, plombiers, soudeurs vérifiés à Douala, Yaoundé et partout au Cameroun.">
        <meta name="keywords" content="embaucher ouvriers Cameroun, ouvriers bâtiment Douala, techniciens Yaoundé, trouver électricien Cameroun, plombier Cameroun, maçon Cameroun, NexJobs, recherche emploi Cameroun, ouvriers qualifiés, artisans, artisan Cameroun">
        @else
        <meta name="description" content="NexJobs — Cameroon's leading platform to find and hire skilled construction workers, technicians and tradespeople. Browse verified professionals in Douala, Yaoundé and across Cameroon.">
        <meta name="keywords" content="hire workers Cameroon, construction workers Douala, technicians Yaoundé, find electrician Cameroon, plumber Cameroon, mason Cameroon, NexJobs, job search Cameroon, skilled workers, tradespeople, artisan Cameroun">
        @endif
        <meta name="author" content="NexJobs">
        <meta name="robots" content="index, follow">
        <meta name="geo.region" content="CM">
        <meta name="geo.placename" content="Cameroon">
        <link rel="canonical" href="{{ url()->current() }}">

        <!-- Open Graph -->
        <meta property="og:site_name" content="NexJobs">
        <meta property="og:locale" content="{{ app()->getLocale() === 'fr' ? 'fr_CM' : 'en_US' }}">
        <meta property="og:locale:alternate" content="{{ app()->getLocale() === 'fr' ? 'en_US' : 'fr_CM' }}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        @if(app()->getLocale() === 'fr')
        <meta property="og:title" content="{{ config('app.name', 'NexJobs') }} — Trouvez des ouvriers qualifiés au Cameroun">
        <meta property="og:description" content="Trouvez et embauchez des maçons, électriciens, plombiers, menuisiers vérifiés et techniciens du bâtiment partout au Cameroun.">
        @else
        <meta property="og:title" content="{{ config('app.name', 'NexJobs') }} — Find Skilled Workers in Cameroon">
        <meta property="og:description" content="Find and hire verified construction workers, technicians and tradespeople across Cameroon. Masons, electricians, plumbers, welders and more.">
        @endif
        <meta property="og:image" content="{{ asset('images/logoNexJobs.png') }}">

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        @if(app()->getLocale() === 'fr')
        <meta name="twitter:title" content="{{ config('app.name', 'NexJobs') }} — Ouvriers qualifiés au Cameroun">
        <meta name="twitter:description" content="Trouvez et embauchez des ouvriers du bâtiment vérifiés au Cameroun.">
        @else
        <meta name="twitter:title" content="{{ config('app.name', 'NexJobs') }} — Skilled Workers in Cameroon">
        <meta name="twitter:description" content="Find and hire verified construction workers across Cameroon.">
        @endif
        <meta name="twitter:image" content="{{ asset('images/logoNexJobs.png') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600,700,800,900&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
