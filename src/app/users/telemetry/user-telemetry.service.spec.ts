import { TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { LstUserService } from "@lst/lst-auth";
import { of } from "rxjs";
import { AllowedRoles } from "src/app/roles";
import { TelemetryConfigService } from "src/app/shared/telemetry/telemetry-config.service";
import { AppStateService } from "../services/app-state.service";
import { MockActivatedRoute } from "../testing.constants";
import { UserTelemetryService } from "./user-telemetry.service";

describe('UserTelemetryService', () => {

    let service: UserTelemetryService;
    const telemetryServiceSpy = jasmine.createSpyObj<TelemetryConfigService>('TelemetryConfigService', ['sendTelemetryEvent']);
    const appStateServiceSpy = jasmine.createSpyObj<AppStateService>('AppStateService', ['setUserProfile']);
    const queryParamMap = of({ get: () => ('testOrg') });
    const mockActivatedRoute = new MockActivatedRoute({
        parent: new MockActivatedRoute({ queryParamMap: queryParamMap }),
        queryParamMap: queryParamMap
    });
    const values = {
        searchVerb:'Users',
        searchText: 'a',
        extensionDetailsPage:'Export All',
        userTeachers:'Teachers',
        userStudents:'Students',
        nullValue: null

    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: LstUserService, useValue: {
                        getRole: () => AllowedRoles[1],
                        getRbsToken: () => 'rbs_token',
                        getPrimaryOrgId: () => 'ORG_ID'
                    }
                },
                {
                    provide: TelemetryConfigService,
                    useValue: telemetryServiceSpy
                },
                {
                    provide: AppStateService,
                    useValue: appStateServiceSpy
                },
                {
                    provide: ActivatedRoute,
                    useValue: mockActivatedRoute
                }
            ]
        });
        service = TestBed.inject(UserTelemetryService);
    });

    it('should be created', () => {
        void expect(service).toBeTruthy();
    });
    it('should check sendUserSearchEvent', () => {
        service.sendUserSearchEvent(values.searchVerb, values.searchText);
        void expect(telemetryServiceSpy.sendTelemetryEvent).toHaveBeenCalled();
    });

    
    it('should check the sendUserExportEvent', () => {
        service.sendUserExportEvent(values.extensionDetailsPage, values.userTeachers,values.nullValue);
        void expect(telemetryServiceSpy.sendTelemetryEvent).toHaveBeenCalled();
    });

});