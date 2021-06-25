/* eslint-disable @typescript-eslint/no-floating-promises */
import { TestBed } from '@angular/core/testing';
import { LstPostMessageService } from '@lst/lst-auth';
import { of } from 'rxjs';
import { AppStateService } from './app-state.service';


describe('AppStateService', () => {
    let service: AppStateService;
    const mockUserProfile: any = {
        id: 'ffffffff5bf6504645d9911ab2eb9c26',
        role: 'sales rep',
        primaryOrgId: 'gftfff5bf6504645d9911ab2eb9c26'
    };

    let lstPostMessageServiceSpy;

    beforeEach(() => {
        lstPostMessageServiceSpy = jasmine.createSpyObj(LstPostMessageService.name, ['sendMessageToParent']);
        lstPostMessageServiceSpy.messages$ = of(
            { data: { action: 'userProfile', userProfile: mockUserProfile } }
        ) as any;
        TestBed.configureTestingModule({
            providers: [
                { provide: LstPostMessageService, useValue: lstPostMessageServiceSpy }
            ]
        });
        service = TestBed.inject(AppStateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set user profile details', () => {
        service.isIntegrated = true;
        service.setUserProfile();
        expect(lstPostMessageServiceSpy.sendMessageToParent).toHaveBeenCalledWith({ action: 'getUserProfile' });
        expect(service.userRole).toEqual(mockUserProfile.role);
        expect(service.userId).toEqual(mockUserProfile.id);
    });

    it('should set integrated flag', () => {
        service.isIntegrated = true;
        expect(service.isIntegrated).toBeTrue();
    });
});
