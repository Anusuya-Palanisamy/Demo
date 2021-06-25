import { Injectable } from '@angular/core';
import { LstPostMessageService } from '@lst/lst-auth';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { postMessageConstants } from 'src/app/app.constants';

@Injectable({
    providedIn: 'root'
})
export class AppStateService {

    postMessageSubscription: Subscription;
    private integrated = true;
    private appUserId: string;
    private appUserRole: string;
    private appPrimaryOrgId: string;

    constructor(private postMessageService: LstPostMessageService) { }

    setUserProfile(): void {
        this.postMessageSubscription = this.postMessageService.messages$.pipe(
            filter(({ data }) => !!data)
        ).subscribe(({ data }) => {
            switch (data.action) {
                case postMessageConstants.userProfile:
                {
                    const { id, role, primaryOrgId } = data.userProfile;
                    this.appUserId = id;
                    this.appUserRole = role;
                    this.appPrimaryOrgId = primaryOrgId;
                }
            }
        });
        this.postMessageService.sendMessageToParent({ action: postMessageConstants.getUserProfile });
    }

    get isIntegrated(): boolean {
        return this.integrated;
    }

    set isIntegrated(val: boolean) {
        this.integrated = val;
    }

    get userRole(): string {
        return this.appUserRole;
    }

    get userId(): string {
        return this.appUserId;
    }

    get primaryOrgId(): string {
        return this.appPrimaryOrgId;
    }

}
