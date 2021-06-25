import { LstAuthModuleOptions } from '@lst/lst-auth';
import { environment } from '../environments/environment';

export const lstAuthModuleOptions: LstAuthModuleOptions = {
    appId: environment.appId,
    authGatewayBaseUrl: environment.authGatewayUrl,
    authContextId: environment.authContextId,
    authGatewayClientId: environment.rbsConfig.clientId,
    rbsTokenScope: environment.rbsConfig.scope,
    ssoBaseUrl: environment.ssoUrl,
    rbsTokenGrantType: environment.rbsConfig.grant_type
};

export const postMessageConstants = {
    init: 'init',
    iframeHeight: 'iframeHeight',
    ack: 'ack',
    sessionTimeout: 'handleSessionTimeout',
    userProfile: 'userProfile',
    getUserProfile: 'getUserProfile'
};

export const appMinHeight = 500;
