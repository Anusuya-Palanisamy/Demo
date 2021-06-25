import { ChangeDetectorRef, Component } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute } from "@angular/router";
import { LstUserService } from "@lst/lst-auth";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ApolloTestingModule } from "apollo-angular/testing";
import { of } from "rxjs";
import { AllowedRoles } from "src/app/roles";
import { TestingModule } from "src/app/shared/testing/testing.module";
import { CommonUtils } from "src/app/shared/utils/common.utils";
import { UserListDataSource } from "../../datasource/user-list.datasource";
import { MOCK_STUDENT_DATA_RESPONSE, MOCK_TEACHER_DATA_RESPONSE, MOCK_USER_DATA, MOCK_USER_SEARCH_RESPONSE } from "../../mocks/user-mock";
import { AppStateService } from "../../services/app-state.service";
import { PostMessagesService } from "../../services/post-messaging.service";
import { UserService } from "../../services/user.service";
import { UserTelemetryService } from "../../telemetry/user-telemetry.service";
import { MockActivatedRoute } from "../../testing.constants";
import { UserListComponent } from "./user-list.component";
import { MatSort, Sort } from '@angular/material/sort';
import { RouterTestingModule } from "@angular/router/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { exception } from "console";
import { By } from "@angular/platform-browser";
import { UserConstants } from "../../constants/user.constants";
import { Suggestion } from "src/app/shared/components/auto-chip-select/types";

describe('UserListComponent', () => {
    let component: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;
    const userTelemetryServiceSpy=jasmine.createSpyObj<UserTelemetryService>('UserTelemetryService', ['sendUserSearchEvent', 'sendUserExportEvent']);
    let commonUtils:CommonUtils;
    let postMessageService:PostMessagesService;
 

    const queryParamMap = of({ get: () => of({ orgId: 12345,
        productId:325423,
    userType:'student'}) });

    const userServicespy = jasmine.createSpyObj(UserService.name,
        ['getUsersForExport','getStudents','getTeachers','getUsers']);
      
    const appStateServiceSpy=jasmine.createSpyObj(AppStateService.name,
        ['userRole','primaryOrgId']);

    const mockActivatedRoute = new MockActivatedRoute({
        parent: new MockActivatedRoute({ queryParamMap }),
        queryParamMap
    });
        const  postMessageServiceSPy = jasmine.createSpyObj(PostMessagesService.name, ['parentConn$','messageSource']);
        

   beforeEach(waitForAsync(()=> {
  
      TestBed.configureTestingModule({
        imports: [
            MatPaginatorModule,
            MatTableModule,
            MatButtonModule,
            TranslateModule,
            TestingModule,
            ApolloTestingModule,
            MatProgressSpinnerModule,
            RouterTestingModule
        ],
        providers: [
            { provide: UserService, useValue: userServicespy },
            { provide: AppStateService, useValue: appStateServiceSpy },
            {
                provide: LstUserService,
                useValue: {
                    getRole: () => AllowedRoles[1],
                    getPrimaryOrgId :()=>'ORG_ID'


                }
            },
          {
                provide:UserTelemetryService,
                useValue:userTelemetryServiceSpy
            },
           
            { provide: ActivatedRoute, useValue: mockActivatedRoute },
           PostMessagesService,
            CommonUtils

        ],
        declarations: [UserListComponent, MatSort,MatPaginator]
           
    }).compileComponents();
}));

beforeEach(() => {
   
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    commonUtils = TestBed.inject(CommonUtils);
    component.userListDataSource = new UserListDataSource(userServicespy, commonUtils);
       
    
});


beforeAll(() => {
    userServicespy.getUsersForExport.and.returnValue(of(MOCK_USER_DATA));
    userServicespy.getTeachers.and.returnValue(of(MOCK_TEACHER_DATA_RESPONSE));
    userServicespy.getStudents.and.returnValue(of(MOCK_STUDENT_DATA_RESPONSE));
    userServicespy.getUsers.and.returnValue(of( MOCK_USER_SEARCH_RESPONSE));
});


it('should create', () => {
    expect(component).toBeTruthy();
});


it('should minimum be one buttonon the page',()=>{
    const buttons=fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length>=1).toBeTruthy();
    });

it('should add the userId',()=>{
    const    userIds: string[] = [];
    const userId='454';
    component.addUserIds(userId);
    userIds.push(userId);
    expect(component.userIds).toEqual([userId]);
});

it('should export users based on the User Response', () => {
    component.showExportLoader = true;
    const userServiceMockspy =  userServicespy.getUsersForExport.and.returnValue(of(MOCK_USER_DATA));
    component.exportUsers(UserConstants.EXPORT_ALL);
    expect(userServiceMockspy).toHaveBeenCalled();
});


it('should call getUsers on the UserDatasource one time on ngOnInit',()=>{
    const userServiceMockspy =  userServicespy.getUsers.and.returnValue(of(MOCK_USER_DATA));
    expect(userServiceMockspy).toHaveBeenCalledTimes(0);
    });

it('should total user count Zero to return true',()=>{
        const totalUsers=0;
        expect(component.disableSelect).toEqual(true);
        });

it('should test userType', () => {
       component.ngOnInit();
        expect(component.userType).toBeDefined();
    });

it('should romove UserId', () => {
        let suggestion={id:'1234',suggestionViewValue:'t'}; 
            component.removeUserIds(suggestion);
            expect(component.userIds).toBeDefined();
     });

it('should test clear the UserId', () => {
            component.clearUsers();
             expect(component.userType).toBeDefined();
    }); 

    
xit('should test search UserIds length equal to Zero', () => {
        component.searchUser();
        component.showExportLoader = true;
        component.loadUserList(); 
       expect(component.userIds.length).toEqual(0);
});
   
xit('should test search UserIds length greater than 0', () => {
     const  orgIds= ['sakueka9284808342'];
     const productId='78789';
     const pageSize=UserConstants.PAGE_SIZE;
     const  userType='student';
     const userIds=['123'];
     component.searchUser();
     component.showExportLoader = false;
     userServicespy.getUsers(orgIds,productId,pageSize,UserConstants.ZERO,userType,userIds)
        expect(userServicespy.getUsers).toHaveBeenCalled();
 });

    //Can not write test case because messageSource is private variable
xit('should test update users count,', () => {
    expect(postMessageService['messageSource']).toBeDefined();
    component.updateUserCount();
    postMessageServiceSPy.messages$.subscribe(totalUsers => {
        expect(totalUsers).toBeDefined();
    });
 
});


});

