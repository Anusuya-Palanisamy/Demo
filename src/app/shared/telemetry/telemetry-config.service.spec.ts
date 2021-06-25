/* eslint-disable @typescript-eslint/no-floating-promises */
import { HttpRequest } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { KeepAliveService } from '../../auth/keepAlive.service';
import { TelemetryConfigService } from './telemetry-config.service';
import { environment } from '../../../environments/environment';
import { LstUserService } from '@lst/lst-auth';
import { AppStateService } from 'src/app/users/services/app-state.service';
import {
    LstPostMessageService
} from '@lst/lst-auth';

describe('Service: TelemetryService', () => {
    let service: TelemetryConfigService;

    let keepAliveServiceStub: KeepAliveService;
    let httpMock: HttpTestingController;
    const mockUserAgent = {
        ua: 'ua',
        os: { name: 'testOS', version: 'testVersion' },
        browser: 'testBrowser',
        engine: 'testEngine',
        cpu: 'testCpu',
        device: 'testDevice'
    };
    const postMessageServiceSpy = jasmine.createSpyObj<LstPostMessageService>(
        'LstPostMessageService',
        ['sendMessageToParent', 'ngOnDestroy']
    );
    const mockVerb = 'VERB';
    const mockObject = {
        extensions: {
            area: 'TestLand',
            page: 'TestPage'
        },
        definition: {
            name: 'Testing'
        }
    };
    const ORG_ID = 'ORG1';

    beforeEach(() => {
        keepAliveServiceStub = jasmine.createSpyObj('keepAliveService', [
            'keepAlive'
        ]);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: KeepAliveService,
                    useValue: keepAliveServiceStub
                },
                {
                   provide: AppStateService,
                    useValue: {
                        getuserRole: () => 'Pearson admin',
                        getUserId: () => 'USER_ID',
                        getprimaryOrgId: () => 'ORG_ID'
                    }
                },
                {
                    provide: LstPostMessageService,
                    useValue: postMessageServiceSpy
                },
                {
                    provide: LstUserService,
                    useValue: {
                        getRole: () => 'USER_ROLE',
                        getOrganizationIds: () => ['ORG1', 'ORG2'],
                        getCurrentUserId: () => 'CURRENT_USER_ID',
                        getPrimaryOrgId: () => 'ORG1',
                        getRbsToken: () => 'token'
                    }
                },
                TelemetryConfigService
            ]
        });
        service = TestBed.inject(TelemetryConfigService);

        // override the UAParser in the ctor
        service.currentDevice = {
            getResult: () => mockUserAgent
        };

        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should test if the service is initialized', () => {
        expect(service).toBeTruthy();
    });

    describe('sendTelemetryEvent', () => {
        it('should merge the activity data with the base data and send it', () => {
            const validateBody = (body) => {
                const hasPublished = Object.prototype.hasOwnProperty.call(body, 'published');
                const hasActor = Object.prototype.hasOwnProperty.call(body, 'actor');
                const validActor =
                    JSON.stringify(body.actor) ===
                    JSON.stringify({
                        id: 'CURRENT_USER_ID',
                        role: 'USER_ROLE'
                    });
                const hasContext = Object.prototype.hasOwnProperty.call(body, 'context');
                // TODO: deeper tests on context
                const hasVerb = Object.prototype.hasOwnProperty.call(body, 'verb');
                const validVerb =
                    JSON.stringify(body.verb) ===
                    JSON.stringify({
                        id: mockVerb,
                        description: ''
                    });
                const hasObject = Object.prototype.hasOwnProperty.call(body, 'object');
                const validObject =
                    JSON.stringify(body.object) === JSON.stringify(mockObject);
                return (
                    hasPublished &&
                    hasActor &&
                    validActor &&
                    hasContext &&
                    hasVerb &&
                    validVerb &&
                    hasObject &&
                    validObject
                );
            };
            service.sendTelemetryEvent(mockVerb, mockObject, ORG_ID);

            httpMock
                .expectOne((request: HttpRequest<any>) => {
                    const bodyCheck = Object.assign({}, request.body);
                    return (
                        request.method === 'POST' &&
                        request.url ===
                        environment.aggregationRestUrl + '/telemetry/event' &&
                        request.headers.get('Authorization') ===
                        'Bearer token' &&
                        request.headers.get('userId') === 'CURRENT_USER_ID' &&
                        validateBody(bodyCheck)
                    );
                })
                .flush(200);
        });

        it('should call the keepAlive service', () => {
            service.sendTelemetryEvent(mockVerb, mockObject, ORG_ID);
            expect(keepAliveServiceStub.keepAlive).toHaveBeenCalled();
            httpMock
                .expectOne(environment.aggregationRestUrl + '/telemetry/event')
                .flush(200);
        });
    });
});
