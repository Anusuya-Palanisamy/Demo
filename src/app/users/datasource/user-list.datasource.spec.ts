import { CollectionViewer, ListRange } from '@angular/cdk/collections';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { BehaviorSubject, of } from 'rxjs';
import { TestingModule } from 'src/app/shared/testing/testing.module';
import { CommonUtils } from 'src/app/shared/utils/common.utils';
import { MOCK_STUDENT_DATA_RESPONSE, MOCK_TEACHER_DATA_RESPONSE } from '../mocks/user-mock';
import { UserService } from '../services/user.service';
import { UserListDataSource } from './user-list.datasource';

export class MockCollectionViewer implements CollectionViewer {
    viewChange: BehaviorSubject<ListRange> = new BehaviorSubject<ListRange>({ start: 0, end: 0 });
}

describe('UserList Datasource', () => {
    let dataSource: UserListDataSource;
    const teacherServiceSpy = jasmine.createSpyObj(UserService.name, ['getTeachers','getStudents']);
    const commonUtilsSpy = jasmine.createSpyObj(CommonUtils.name, ['mapUsers']);
   let   teacherService: UserService;
   let commonUtils: CommonUtils;
   
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ApolloTestingModule,
                TestingModule
            ],
            providers: [
                 { prodvide: UserService, useValue: teacherServiceSpy },
                { prodvide: CommonUtils, useValue: commonUtilsSpy }]
        }); 
        dataSource = new UserListDataSource(teacherServiceSpy, commonUtils);

    });
    beforeAll(() => {
        teacherServiceSpy.getTeachers.and.returnValue(of(MOCK_TEACHER_DATA_RESPONSE));
        teacherServiceSpy.getStudents.and.returnValue(of(MOCK_STUDENT_DATA_RESPONSE));
    });

    it('should be created', () => {
        void expect(dataSource).toBeTruthy();
    });
   
    it('should return User list based on User Type', () => {
       // expect(dataSource['loadingSubject']).toBeDefined();
        dataSource.connect();
        dataSource.getUsers(['8a97b1a74036602f0140a77db45b71b0'], '1165876', 0.2, 0.1,'t',['8a97b1a765b54dcb01662253b64d183a']);
        dataSource.disconnect();
    });

    it('should get teachers based on UserIds', () => {
         expect(dataSource['userListSubject']).toBeDefined();
         dataSource.connect();
         dataSource.getTeachers(['8a97b1a74036602f0140a77db45b71b0'], '1165876', 0.2, 0.1,['8a97b1a765b54dcb01662253b64d183a']);
         dataSource.userDetails$.pipe().subscribe(teacherList => {
            expect(teacherList).toBeDefined();
        });
         dataSource.disconnect();
     });

     it('should get students based on UserIds', () => {
        expect(dataSource['userListSubject']).toBeDefined();
        dataSource.connect();
        dataSource.getStudents(['8a97b1a74036602f0140a77db45b71b0'], '1165876', 0.2, 0.1,['8a97b1a765b54dcb01662253b64d183a']);
        dataSource.userDetails$.pipe().subscribe(studentList => {
           expect(studentList).toBeDefined();
       });
        dataSource.disconnect();
    });
    
});
