export class AppConstants {
    static API_BASE = 'http://localhost:4000';

    static get API_INTERPRETER(): string { return `${AppConstants.API_BASE}/interpreter`; }

    // Default Config
    static CONFIG = {
        apiHost: 'localhost',
        changeVersion: 'NA',
        env: 'dev',
        version: 'NA'
    };
}


