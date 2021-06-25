export interface IBrowserConfig {
    ua: string;
    browser: {
        name: string;
        version: string;
        major: string;
    };
    engine: {
        name: string;
        version: string;
    };
    os: {
        name: string;
        version: string;
    };
    cpu: {
        architecture: string;
    };
    device: {
        model: string;
        type: string;
        vendor: string;
    };
}
