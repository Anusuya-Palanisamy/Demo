// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { commonConfig, IEnvironment } from './common';

export const environment: IEnvironment = {
    ...commonConfig,

    envName: 'dev',
    authGatewayUrl: 'https://nightly-reader.savvasrealizedev.com/sapi',
    ssoUrl: 'https://nightly-sso.rumba.pk12ls.com/sso',
    aggregationUrl: 'http://easybridge-search-service.nightly.savvasrealizedev.com/graphql',
    aggregationRestUrl: 'http://easybridge-search-service.nightly.savvasrealizedev.com/rest',
    authContextId: '6065'
};
