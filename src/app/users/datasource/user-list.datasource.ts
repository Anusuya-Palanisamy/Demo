import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { CommonUtils } from 'src/app/shared/utils/common.utils';
import { UserConstants } from '../constants/user.constants';
import { GetStudents_students } from '../queries/types/GetStudents';
import { UserService } from '../services/user.service';

export interface User {
    userName: string;
    organizationName: string;
    className: string;
    userStatus?: string;
    userId?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserListDataSource implements DataSource<User> {
    private userListSubject = new BehaviorSubject<User[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private totalCountSubject = new BehaviorSubject<number>(0);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private filteredUserSubject = new BehaviorSubject<number>(0);

    userDetails$ = this.userListSubject.asObservable();
    totalCount$ = this.totalCountSubject.asObservable();
    filteredUserCount$ = this.filteredUserSubject.asObservable();
    loading$ = this.loadingSubject.asObservable();
    error$ = this.errorSubject.asObservable();

    constructor(private teacherService: UserService, private commonUtils: CommonUtils) { }

    connect(): Observable<User[]> {
        return this.userListSubject.asObservable();
    }

    disconnect(): void {
        this.totalCountSubject.complete();
        this.filteredUserSubject.complete();
        this.loadingSubject.complete();
        this.errorSubject.complete();
        return this.userListSubject.complete();
    }

    getUsers(orgIds: string[], productId: string, limit: number, offset: number, userType: string,
        userIds?: string[]): void {
        this.loadingSubject.next(true);
        if (userType === UserConstants.USER_TYPE_TEACHER) {
            this.getTeachers(orgIds, productId, limit, offset, userIds);
        }
        if (userType === UserConstants.USER_TYPE_STUDENT) {
            this.getStudents(orgIds, productId, limit, offset, userIds);
        }
    }

    getTeachers(orgIds: string[], productId: string, limit: number, offset: number, userIds?: string[]): void {
        this.teacherService.getTeachers(orgIds, productId, limit, offset, userIds)
            .pipe(switchMap(({ data }) => {
                return this.handleResponse(data.teachers, userIds);
            }), catchError(() => {
                this.errorSubject.next(true);
                return of([]);
            }),
            finalize(() => this.loadingSubject.next(false))
            ).subscribe(response => {
                this.userListSubject.next(response);
                this.loadingSubject.next(false);
            });
    }

    getStudents(orgIds: string[], productId: string, limit: number, offset: number, userIds?: string[]): void {
        this.teacherService.getStudents(orgIds, productId, limit, offset, userIds).pipe(switchMap(({ data }) => {
            return this.handleResponse(data.students, userIds);
        }), catchError(() => {
            this.errorSubject.next(true);
            return of([]);
        }),
        finalize(() => this.loadingSubject.next(false))
        ).subscribe(response => {
            this.userListSubject.next(response);
            this.loadingSubject.next(false);
        });
    }

    handleResponse = (userList: GetStudents_students[], userIds: string[]): Observable<User[]> => {
        const userResponse: User[] = userList.map(this.commonUtils.mapUsers);
        this.filteredUserSubject.next(userResponse.length);
        if (!userIds) {
            this.totalCountSubject.next(userResponse.length);
        }
        return of(userResponse);
    }
}
