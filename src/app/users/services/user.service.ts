import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { map } from 'rxjs/operators';
import { ExportUsersGQL } from '../queries/export-users.query';
import { StudentListGQL } from '../queries/student-list.query ';
import { TeacherListGQL } from '../queries/teacher-list.query';
import { GetTeachers } from '../queries/types/GetTeachers';
import { UserSearchGQL } from '../queries/users-search.query';
import { Observable } from 'rxjs';
import { GetStudents } from '../queries/types/GetStudents';
import { GetUsers } from '../queries/types/GetUsers';
import { GetExportUsers } from '../queries/types/GetExportUsers';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private teacherListGQL: TeacherListGQL,
        private studentListGQL: StudentListGQL,
        private userSearchGQL: UserSearchGQL,
        private exportUsersGQL: ExportUsersGQL
    ) { }

    getTeachers(orgIds: string[], productId: string, limit: number, offset: number,
        userIds?: string[]): Observable<ApolloQueryResult<GetTeachers>>{
        return this.teacherListGQL.watch({
            limit: limit, offset: offset, orgIds: orgIds,
            productId: productId, userIds: userIds
        }).valueChanges.pipe(map((response) => response));
    }

    getStudents(orgIds: string[], productId: string, limit: number, offset: number,
        userIds?: string[]): Observable<ApolloQueryResult<GetStudents>> {
        return this.studentListGQL.watch({
            limit: limit, offset: offset, orgIds: orgIds,
            productId: productId, userIds: userIds
        }).valueChanges.pipe(map((response) => response));
    }

    getUsers(orgIds: string[], searchText: string[], userType: string,
        limit: number, offset: number): Observable<ApolloQueryResult<GetUsers>>{
        return this.userSearchGQL.watch({ searchText: searchText, userType: userType, orgIds: orgIds, limit, offset})
            .valueChanges.pipe(map((response) => response));
    }

    getUsersForExport(orgIds: string[], productId: string, limit: number, offset: number,
        userType: string, totalCount: number, userIds?: string[]): Observable<ApolloQueryResult<GetExportUsers>> {
        return this.exportUsersGQL.watch({ limit, offset, orgIds, productId, userType, totalCount, userIds })
            .valueChanges.pipe(map((response) => response));
    }
}
