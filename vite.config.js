import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: [
                'resources/js/**',
                'resources/views/**',
                'routes/**',
                'app/Http/Controllers/**',
            ],
        }),
        react(),
    ],
    server: {
        hmr: {
            host: 'localhost',
        },
    },
});
