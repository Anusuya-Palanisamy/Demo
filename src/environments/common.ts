
export interface ICommonConfig {
    appId: string; // id for internal use (storage partitioning)
    appName: string; // display friendly name of app
    ssoSessionLengthMs: number;
    production: boolean;
    refererAppLandingUrl: string;
    nyrPausePeriodCounter: number;
    rbsConfig: {
        scope: string;
        clientId: string;
        grant_type: string;
    };

    telemetryConfig: {
        appName: string;
        telemetryKey: string;
        telemetryUrl: string;
    };

    technicalSupportUrl: string;
    errorRoute: string;
}

export interface IEnvironment extends ICommonConfig {
    envName: string;
    envUrl?: string;
    authGatewayUrl: string;
    ssoUrl: string;
    aggregationUrl: string;
    authContextId?: string;
    aggregationRestUrl: string;
}

export const ONE_SECOND = 1000;
export const ONE_MINUTE = ONE_SECOND * 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const TWO_HOURS = ONE_HOUR * 2;
export const commonConfig: ICommonConfig = {
    appId: 'ELBAPP',
    appName: 'EasyBridge',
    ssoSessionLengthMs: TWO_HOURS,
    production: false,
    nyrPausePeriodCounter: 5,
    refererAppLandingUrl: 'https://nightly-realize.realizedev.com/community',
    rbsConfig: {
        scope: 'rbs',
        clientId: 'GTrd4wvsJKWf6JkV0gbxHmgm3lQz20E7',
        grant_type: 'custom_castgc'
    },
    telemetryConfig: {
        appName: 'cat-webapp',
        telemetryKey: 'D7c9TnjHef23Wl84Ga0t66XgYiRIkxCMaiTLR9D0',
        telemetryUrl: '<NEEDS_TO_BE_SET>'
    },
    technicalSupportUrl : 'https://support.savvas.com/support/s/contactsupport',
    errorRoute: 'error'
};
