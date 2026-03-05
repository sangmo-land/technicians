<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'NexJobs') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/png" href="{{ asset('images/logoNexJobs.png') }}">
        <link rel="shortcut icon" type="image/png" href="{{ asset('images/logoNexJobs.png') }}">
        <link rel="apple-touch-icon" href="{{ asset('images/logoNexJobs.png') }}">

        <!-- SEO Global Meta -->
        @if(app()->getLocale() === 'fr')
        <meta name="description" content="NexJobs — La plateforme n°1 au Cameroun pour trouver du travail et embaucher des ouvriers qualifiés du bâtiment. Offres d'emploi, travail au Cameroun, recrutement BTP et immobilier à Douala, Yaoundé et partout au Cameroun.">
        <meta name="keywords" content="embaucher ouvriers Cameroun, ouvriers bâtiment Douala, techniciens Yaoundé, trouver électricien Cameroun, plombier Cameroun, maçon Cameroun, NexJobs, recherche emploi Cameroun, ouvriers qualifiés, artisans, artisan Cameroun, emploi BTP Cameroun, emploi construction Douala, immobilier Cameroun, offres emploi bâtiment, génie civil Cameroun, recrutement Cameroun, emploi Yaoundé, travail Cameroun, travail au Cameroun, trouver du travail au Cameroun, offre d'emploi Cameroun, chercher emploi Cameroun, site emploi Cameroun, emploi en ligne Cameroun, job Cameroun, recrutement Douala, recrutement Yaoundé, travailleur qualifié Cameroun">
        @else
        <meta name="description" content="NexJobs — Cameroon's leading platform to find work and hire skilled workers. Browse jobs, employment opportunities, construction vacancies and verified professionals in Douala, Yaoundé and across Cameroon.">
        <meta name="keywords" content="hire workers Cameroon, construction workers Douala, technicians Yaoundé, find electrician Cameroon, plumber Cameroon, mason Cameroon, NexJobs, job search Cameroon, skilled workers, tradespeople, artisan Cameroun, construction jobs Cameroon, real estate jobs Cameroon, building jobs Douala, BTP Cameroun, emploi bâtiment, immobilier Cameroun, civil engineering jobs, job vacancies Cameroon, employment Cameroon, work in Cameroon, find work in Cameroon, jobs in Cameroon, Cameroon jobs, Cameroon employment, job opportunities Cameroon, careers Cameroon, hiring Cameroon, recruitment Cameroon, travail au Cameroun">
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
        <meta property="og:title" content="{{ config('app.name', 'NexJobs') }} — Travail au Cameroun | Emploi et ouvriers qualifiés">
        <meta property="og:description" content="Trouvez du travail au Cameroun. Offres d'emploi BTP, immobilier, construction. Embauchez des ouvriers qualifiés à Douala, Yaoundé et partout au Cameroun.">
        @else
        <meta property="og:title" content="{{ config('app.name', 'NexJobs') }} — Work in Cameroon | Jobs & Skilled Workers">
        <meta property="og:description" content="Find work in Cameroon. Browse job opportunities, construction vacancies and hire verified skilled workers across Douala, Yaoundé and all of Cameroon.">
        @endif
        <meta property="og:image" content="{{ asset('images/logoNexJobs.png') }}">

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        @if(app()->getLocale() === 'fr')
        <meta name="twitter:title" content="{{ config('app.name', 'NexJobs') }} — Travail au Cameroun | Emploi et recrutement">
        <meta name="twitter:description" content="Trouvez du travail au Cameroun. Emplois BTP, construction, immobilier et ouvriers qualifiés.">
        @else
        <meta name="twitter:title" content="{{ config('app.name', 'NexJobs') }} — Work in Cameroon | Jobs & Employment">
        <meta name="twitter:description" content="Find work in Cameroon. Job opportunities, construction careers and skilled workers across Cameroon.">
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
