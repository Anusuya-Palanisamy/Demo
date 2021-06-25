import { IBrowserConfig } from './browserConfig.interface';

export interface ITelemetryBaseData {
    actor: {
        id: string;
        role: string;
    };
    context: {
        platform: string;
        environment: string;
        orgId: string;
        'browser-info': IBrowserConfig;
        deviceInfo: string;
        'screen-size': string;
        viewportSize: string;
        targetOrgId: string;
    };
}
