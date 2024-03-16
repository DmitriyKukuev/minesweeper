class Env {
    protected getValue(key: string): string {
        // @ts-ignore
        return import.meta.env[key] ?? '';
    }

    /**
     * Среда - разработка?
     */
    public get isDev(): boolean {
        return this.getValue('VITE_APP_ENV') === 'local';
    }

    public get isDebug(): boolean {
        return this.getValue('VITE_APP_DEBUG') === 'true';
    }
}

export const env = new Env();
