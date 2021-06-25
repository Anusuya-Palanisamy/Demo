/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LstUserService } from '@lst/lst-auth';
import { UserRole } from 'src/app/roles';
import { TelemetryConfigService } from 'src/app/shared/telemetry/telemetry-config.service';
import { ITelemetryObject } from 'src/app/shared/telemetry/types';
import { UserConstants } from '../constants/user.constants';
import { AppStateService } from '../services/app-state.service';
import { TelemetryConstants } from './telemetry-constants';

@Injectable({
    providedIn: 'root'
})
export class UserTelemetryService {
    private orgId: string;
    targetOrgId: string;
  
    constructor(private readonly telemetry: TelemetryConfigService,  
        private appStateService: AppStateService,
        private lstUserService: LstUserService,
        private route: ActivatedRoute) {
        this.route.queryParamMap.subscribe(params => {
            this.orgId = params.get(UserConstants.ORG_ID);
            this.targetOrgId = this.getOrgId();
        });
    }
  
    private getOrgId(): string {
        const orgRole = this.lstUserService.getRole() || this.appStateService.userRole;
        const targetOrgId = orgRole === UserRole.CustomerAdmin ? '' : this.orgId;
        return targetOrgId;
    }
     
    sendUserSearchEvent(value:string, name:string):void {
        const eventDetails = this.constructTelemetryObject(TelemetryConstants.extensionDetailsPage, name, value);
        void this.telemetry.sendTelemetryEvent(TelemetryConstants.searchVerb, eventDetails, this.targetOrgId);
    }
    
    sendUserExportEvent(name:string, value:string, userType:string):void {
        const verbId = userType==='t' ? TelemetryConstants.userTeachers : TelemetryConstants.userStudents;
        const verb = `${TelemetryConstants.exportVerb} ${verbId}`;
        const eventDetails = this.constructTelemetryObject(TelemetryConstants.extensionDetailsPage, name, value);
        void this.telemetry.sendTelemetryEvent(verb, eventDetails, this.targetOrgId);
    }

    constructTelemetryObject(page: string, name: string, value: string): ITelemetryObject {
        return {
            extensions: {
                page: page,
                area: TelemetryConstants.extensionArea,
                value: value
            },
            definition: {
                name
            }
        };
    }
}
