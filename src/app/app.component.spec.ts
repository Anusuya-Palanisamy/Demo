/* eslint-disable @typescript-eslint/no-floating-promises */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LstIframeAuthGuard, LstPostMessageService, LstUserService } from '@lst/lst-auth';
import { TestingModule } from '../../src/app/shared/testing/testing.module';
import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { postMessageConstants } from './app.constants';
import { AllowedRoles } from './roles';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    const postMessageServiceSpy = jasmine.createSpyObj(
        'LstPostMessageService',
        ['sendMessageToParent', 'ngOnDestroy']
    );
    const iframeAuthGuard = {
        ...jasmine.createSpyObj('LstIFrameAuthGuard', ['canActivate']),
        isLoading$: of(false)
    };

    beforeEach(waitForAsync(() => {
        postMessageServiceSpy.messages$ = of({
            data: { type: postMessageConstants.ack }
        }) as any;
        
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                TestingModule
            ],
            declarations: [
                AppComponent
            ],
            providers: [
                {
                    provide: LstPostMessageService,
                    useValue: postMessageServiceSpy
                },
                {
                    provide: LstUserService, useValue: {
                        getRole: () => AllowedRoles[1],
                        getRbsToken: () => 'rbs_token'
                    }
                },
                { provide: LstIframeAuthGuard, useValue: iframeAuthGuard }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    
    it('should send ack when receives init message from parent app', waitForAsync(() => {
        const event = new MessageEvent('message', {
            data: {
                type: 'init'
            }
        });
        window.dispatchEvent(event);
        fixture.detectChanges();
        expect(postMessageServiceSpy.sendMessageToParent).toHaveBeenCalledWith({
            type: postMessageConstants.ack
        });
    }));
    
    it('should call onDestroy of PostMessage Service when onDestroy of component called', () => {
        component.ngOnDestroy();
        expect(postMessageServiceSpy.ngOnDestroy).toHaveBeenCalled();
    });
	
	it('should call onDestroy of onDestroy of component called', () => {
        component.ngOnDestroy();
        expect(postMessageServiceSpy.ngOnDestroy).toHaveBeenCalled();
    });
});
