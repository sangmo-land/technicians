export function getInitials(name?: string | null, maximum = 2): string {
    const parts = name?.trim().split(/\s+/).filter(Boolean) || [];

    if (parts.length === 0) return '?';

    return parts
        .slice(0, maximum)
        .map((part) => Array.from(part)[0])
        .join('')
        .toLocaleUpperCase();
}
