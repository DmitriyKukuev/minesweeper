function getEnvValue(key: string): string {
    // @ts-ignore
    return import.meta.env[key] ?? '';
}

/**
 * Среда - разработка?
 */
export function isDev(): boolean {
    return getEnvValue('VITE_APP_ENV') === 'local';
}

export function isDebug(): boolean {
    return getEnvValue('VITE_APP_DEBUG') === 'true';
}
