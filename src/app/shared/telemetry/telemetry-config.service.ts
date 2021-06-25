/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LstUserService } from '@lst/lst-auth';
import { AppStateService } from 'src/app/users/services/app-state.service';
import { UAParser } from 'ua-parser-js';
import { environment } from '../../../environments/environment';
import { KeepAliveService } from '../../auth/keepAlive.service';
import {
    IBrowserConfig,
    ITelemetryBaseData,
    ITelemetryObject,
    IVerbObject,
    TelemetryServiceResponse
} from './types';

@Injectable({
    providedIn: 'root'
})

export class TelemetryConfigService {
    appName = environment.telemetryConfig.appName;
    currentDevice;

    constructor(
        private readonly http: HttpClient,
        private readonly keepAliveService: KeepAliveService,
        private readonly userService: LstUserService,
        private appStateService: AppStateService
    ) {
        this.currentDevice = new UAParser();
    }

    public sendTelemetryEvent(
        verb: string,
        eventDetails: ITelemetryObject,
        targetOrgId: string
    ): Promise<TelemetryServiceResponse> {
        const baseData = this.getBaseData(targetOrgId);
        baseData.context.orgId  = this.userService.getPrimaryOrgId() || this.appStateService.primaryOrgId;
        const vo: IVerbObject = { id: verb, description: '' };
        const eventData = {
            ...baseData,
            ...this.createEventData(vo, eventDetails),
            published: new Date().toISOString()
        
        };

        // Run keepAlive on telemetry events
        // FIXME: separate this concern (interceptor?)
        this.keepAliveService.keepAlive();
        const identityId = this.userService.getCurrentUserId() || this.appStateService.userId;
        const rbsToken = `Bearer ${this.userService.getRbsToken()}`;
        const headers = {
            userId: identityId,
            Authorization: rbsToken
        };
        return this.http
            .post<TelemetryServiceResponse>(
                environment.aggregationRestUrl + '/telemetry/event',
                eventData,
                { headers }
            )
            .toPromise();
    }

    private getPlatformName(): string {
        const result = this.currentDevice.getResult();
        return `${result.os.name} ${result.os.version}`;
    }

    private getBrowserInfo(): IBrowserConfig {
        const {
            ua,
            browser,
            engine,
            os,
            cpu,
            device
        }: IBrowserConfig = this.currentDevice.getResult();
        return { ua, browser, engine, os, cpu, device };
    }

    private getDimensions(width, height): string {
        return `${width}x${height}`;
    }

    private getBaseData(targetOrgId: string): ITelemetryBaseData {
        const userRole = this.userService.getRole() || this.appStateService.userRole;
        const organizationId = this.userService.getPrimaryOrgId() || this.appStateService.primaryOrgId;
        return {
            actor: {
                id: this.userService.getCurrentUserId() || this.appStateService.userId,
                role: userRole
            },
            context: {
                platform: this.appName,
                environment: environment.envName,
                orgId: organizationId, 
                'browser-info': this.getBrowserInfo(),
                deviceInfo: this.getPlatformName(),
                'screen-size': this.getDimensions(
                    window.screen.width, 
                    window.screen.height
                ),
                viewportSize: this.getDimensions(
                    document.documentElement.clientWidth, 
                    document.documentElement.clientHeight
                ),
                targetOrgId
            }
        };
    }

    private createEventData(verb: IVerbObject, object: ITelemetryObject) {
        return {
            object,
            verb
        };
    }
}
