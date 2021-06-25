import { commonConfig, IEnvironment } from './common';

export const environment: IEnvironment = {
    ...commonConfig,
    production: true,
    envName: 'prod',
    authGatewayUrl: '<NEEDS_TO_BE_SET>',
    ssoUrl: 'https://sso.rumba.pk12ls.com/sso',
    aggregationUrl: '<NEEDS_TO_BE_SET>',
    authContextId: '446',
    aggregationRestUrl: '<NEEDS_TO_BE_SET>',
    refererAppLandingUrl: 'https://www.savvasrealize.com/community/',
    rbsConfig: {
        scope: 'dummy',
        clientId: 'dummy',
        grant_type: 'dummy'
    }
};
