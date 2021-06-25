import { TestBed, waitForAsync } from '@angular/core/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { TestingModule } from 'src/app/shared/testing/testing.module';
import { MOCK_EXPORT_USERS, MOCK_STUDENT_DATA_RESPONSE, MOCK_TEACHER_DATA_RESPONSE } from '../mocks/user-mock';
import { ExportUsersGQL } from '../queries/export-users.query';
import { StudentListGQL } from '../queries/student-list.query ';
import { TeacherListGQL } from '../queries/teacher-list.query';
import { UserSearchGQL } from '../queries/users-search.query';
import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;
    let controller: ApolloTestingController;
    let teacherListGQL: TeacherListGQL;
    let studentListGQL: StudentListGQL;
    let userSearchGQL: UserSearchGQL;
    let exportUsersGQL: ExportUsersGQL;
    

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule, TestingModule],
            providers: [UserService,TeacherListGQL,StudentListGQL,UserSearchGQL,ExportUsersGQL]
        });
        service = TestBed.inject(UserService);
        controller = TestBed.inject(ApolloTestingController);
        teacherListGQL=TestBed.inject(TeacherListGQL);
        studentListGQL=TestBed.inject(StudentListGQL);
        userSearchGQL=TestBed.inject(UserSearchGQL);
        exportUsersGQL=TestBed.inject(ExportUsersGQL);

    });

    it('should be created', () => {
        void expect(service).toBeTruthy();
    });

it('should get the teacher list based on orgIds', waitForAsync(() => {
            const orgIds = ['8a97b1a765b54dcb01662253b64d189a'];
            const productId = '421023';
            const limit =0.0;
            const offset=0.5;
            const userIds=['8a97b1a765b54dcb01662253b64d183a'];

        service.getTeachers(orgIds,productId,limit,offset,userIds).subscribe((licenses) => {
            void expect(licenses).toBeDefined();
        });
        const graphQlOperation = controller.expectOne(teacherListGQL.document);
        void expect(graphQlOperation.operation.variables.orgIds).toEqual(orgIds);
        void expect(graphQlOperation.operation.variables.productId).toEqual(productId);
        void expect(graphQlOperation.operation.variables.limit).toEqual(limit);
        void expect(graphQlOperation.operation.variables.offset).toEqual(offset);
        void expect(graphQlOperation.operation.variables.userIds).toEqual(userIds);

        graphQlOperation.flush({ data: MOCK_TEACHER_DATA_RESPONSE });
    }));

    it('should get the student list based on orgIds', waitForAsync(() => {
        const orgIds = ['8a97b1a765b54dcb01662253b64d189a'];
        const productId = '421023';
        const limit =0.0;
        const offset=0.5;
        const userIds=['8a97b1a765b54dcb01662253b64d183a'];

    service.getStudents(orgIds,productId,limit,offset,userIds).subscribe((licenses) => {
        void expect(licenses).toBeDefined();
    });
    const graphQlOperation = controller.expectOne(studentListGQL.document);
    void expect(graphQlOperation.operation.variables.orgIds).toEqual(orgIds);
    void expect(graphQlOperation.operation.variables.productId).toEqual(productId);
    void expect(graphQlOperation.operation.variables.limit).toEqual(limit);
    void expect(graphQlOperation.operation.variables.offset).toEqual(offset);
    void expect(graphQlOperation.operation.variables.userIds).toEqual(userIds);

    graphQlOperation.flush({ data: MOCK_STUDENT_DATA_RESPONSE });
}));

it('should get the User list based on orgIds', waitForAsync(() => {
    const orgIds = ['8a97b1a765b54dcb01662253b64d189a'];
    const searchText = ['data'];
    const userType='customer';
    const limit =0.0;
    const offset=0.5;
    

service.getUsers(orgIds,searchText,userType,limit,offset).subscribe((licenses) => {
    void expect(licenses).toBeDefined();
});
const graphQlOperation = controller.expectOne(userSearchGQL.document);
void expect(graphQlOperation.operation.variables.orgIds).toEqual(orgIds);
void expect(graphQlOperation.operation.variables.searchText).toEqual(searchText);
void expect(graphQlOperation.operation.variables.userType).toEqual(userType);
void expect(graphQlOperation.operation.variables.limit).toEqual(limit);
void expect(graphQlOperation.operation.variables.offset).toEqual(offset);

graphQlOperation.flush({ data: MOCK_STUDENT_DATA_RESPONSE });
}));


it('should get the Users for Export based on orgIds', waitForAsync(() => {
    const orgIds = ['8a97b1a765b54dcb01662253b64d189a'];
    const productId = '421023';
    const limit =0.0;
    const offset=0.5;
    const userType='customer';
    const totalCount =20;
    const userIds=['8a97b1a765b54dcb01662253b64d183a'];
    

service.getUsersForExport(orgIds,productId,limit,offset,userType,totalCount,userIds).subscribe((licenses) => {
    void expect(licenses).toBeDefined();
});
const graphQlOperation = controller.expectOne(exportUsersGQL.document);
void expect(graphQlOperation.operation.variables.orgIds).toEqual(orgIds);
void expect(graphQlOperation.operation.variables.limit).toEqual(limit);
void expect(graphQlOperation.operation.variables.offset).toEqual(offset);
void expect(graphQlOperation.operation.variables.userType).toEqual(userType);
void expect(graphQlOperation.operation.variables.totalCount).toEqual(totalCount);
void expect(graphQlOperation.operation.variables.userIds).toEqual(userIds);

graphQlOperation.flush({ data: MOCK_EXPORT_USERS });
}));


    afterEach(() => {
        controller.verify();
    });
});
