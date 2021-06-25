import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LstUserService } from '@lst/lst-auth';
import { AllowedRoles } from 'src/app/roles';
import { AppStateService } from '../../services/app-state.service';

import { UserRootComponent } from './user-root.component';

describe('UsersRootComponent', () => {
    let component: UserRootComponent;
    let fixture: ComponentFixture<UserRootComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserRootComponent],
            providers: [{
                provide: LstUserService, useValue: {
                    getRole: () => AllowedRoles[1],
                    getRbsToken: () => 'rbs_token'
                }
            },
            {
                provide: AppStateService,
                useValue: {
                    getuserRole: () => 'Pearson admin',
                    getUserId: () => 'USER_ID',
                    getprimaryOrgId: () => 'ORG_ID'
                }
            }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserRootComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});
