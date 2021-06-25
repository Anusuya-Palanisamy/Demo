import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject, Observable } from 'rxjs';
import { switchMap, catchError, finalize } from 'rxjs/operators';
import { Suggestion, PagedResults, FilteredCollectionViewer,
    AutoCompleteSelectDataSource } from 'src/app/shared/components/auto-chip-select/types';
import { CommonUtils } from 'src/app/shared/utils/common.utils';
import { UserConstants } from '../constants/user.constants';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class SearchDataSource  implements AutoCompleteSelectDataSource<Suggestion> {
    constructor(private userService: UserService, private commonUtils: CommonUtils,
        private orgIds: string[], private userType: string) { }
    private filteredUsersSubject = new Subject<PagedResults<Suggestion>>();
    private loadingSubject = new BehaviorSubject<boolean>(false);
    minSearchLength;

    filteredUserDetails$ = this.filteredUsersSubject.asObservable();
    loading$ = this.loadingSubject.asObservable();


    connect(collectionViewer: FilteredCollectionViewer): Observable<PagedResults<Suggestion>> {
        collectionViewer.viewChange
            .subscribe(changes => {
                const { search, start, limit } = changes;
                if (search) {
                    const searchText = search.split(UserConstants.SPACE).join(UserConstants.CHAR_COMMA);
                    const searchTextArray = searchText.split(UserConstants.CHAR_COMMA)
                        .filter(text => text.trim() !== UserConstants.EMPTY);
                    this.searchUsers(this.orgIds, searchTextArray, this.userType, start, limit);
                }
            });
        return this.filteredUsersSubject.asObservable();
    }

    disconnect(): void {
        return this.filteredUsersSubject.complete();
    }

    searchUsers(orgIds: string[], searchText: string[], userType: string, start: number, limit: number): void {
        this.loadingSubject.next(true);
        this.userService.getUsers(orgIds, searchText, userType, limit, start)
            .pipe(switchMap(({ data }) => {
                const searchResult = data.users.users.map((teacher) => {
                    const teachers: Suggestion = {
                        id: teacher.userId,
                        suggestionViewValue: this.commonUtils.getFullName(teacher.firstName, teacher.lastName)
                    };
                    return teachers;
                });
                const userResults: PagedResults<Suggestion> = {
                    total: data.users.totalCount,
                    start: start,
                    end: start + searchResult.length,
                    items: searchResult
                };
                return of(userResults);
            }), catchError(() => {
                return of(null);
            }), finalize(() => this.loadingSubject.next(false)
            )).subscribe((response: PagedResults<Suggestion>) => {
                this.filteredUsersSubject.next(response);
                this.loadingSubject.next(false);
            });
    }
}
