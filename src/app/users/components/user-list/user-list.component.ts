import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, 
    OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { LstUserService } from '@lst/lst-auth';
import { Subject, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { UserRole } from 'src/app/roles';
import { CommonUtils } from 'src/app/shared/utils/common.utils';
import { UserConstants } from '../../constants/user.constants';
import { UserService } from '../../services/user.service';
import { SearchDataSource } from '../../datasource/search-datasource';
import { Suggestion } from 'src/app/shared/components/auto-chip-select/types';
import { UserStatus } from '../../enums/user-status';
import { TranslateService } from '@ngx-translate/core';
import { User, UserListDataSource } from '../../datasource/user-list.datasource';
import { PostMessagesService } from '../../services/post-messaging.service';
import { AppStateService } from '../../services/app-state.service';
import { postMessageConstants } from 'src/app/app.constants';
import { GetExportUsers} from '../../queries/types/GetExportUsers';
import { ApolloQueryResult } from '@apollo/client/core/types';
import { UserTelemetryService } from '../../telemetry/user-telemetry.service';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    dataSource = new MatTableDataSource<User>([]);
    private readonly _onDestroy$ = new Subject<void>();
    isError: boolean;
    loading: boolean;
    pageSize = UserConstants.PAGE_SIZE;
    productId: string;
    orgId: string;
    orgIds: string[];
    searchText: string;
    offset = 0;
    userRole: string;
    userListDataSource: UserListDataSource;
    columnList = ['userName', 'organization', 'className'];
    userIds: string[] = [];
    usersSearchDataSource: SearchDataSource;
    isZeroResults: boolean;
    userStatus = UserStatus;
    isZeroSearchResult: boolean;
    userType: string;
    templateObject;
    placeholder: string;
    teacherPlaceholder: string;
    studentPlaceholder: string;
    exportOptions: string[];
    disableSelect = true;
    selectedOption: string;
    showExportLoader = false;
    totalUsers = 1000;

    constructor(
        private lstUserService: LstUserService,
        private commonUtils: CommonUtils,
        private userService: UserService,
        private cdRef: ChangeDetectorRef,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private telemetry: UserTelemetryService,
        private postMessageService: PostMessagesService,
        private appStateService: AppStateService) {
        this.route.queryParamMap.subscribe(params => {
            this.orgId = params.get(UserConstants.ORG_ID);
            this.productId = params.get(UserConstants.PRODUCT_ID);
            this.userType = params.get(UserConstants.UER_TYPE);
            
        });
    }

    ngOnInit(): void {
        if (this.postMessageService.parentConn$) {
            this.postMessageService.parentConn$.sendMessage(postMessageConstants.init);
        }
        this.exportOptions = UserConstants.exportProductOptions;
        this.selectedOption = this.exportOptions[0];
        this.userListDataSource = new UserListDataSource(this.userService, this.commonUtils);
        if (this.userType === UserConstants.USER_TYPE_TEACHER) {
            this.templateObject = this.translate.instant('teachersList');
        } else {
            this.templateObject = this.translate.instant('studentsList');
            this.userType = UserConstants.USER_TYPE_STUDENT;
        }
        this.placeholder = this.templateObject.placeholder;
        this.updateUserCount();
        const orgRole = this.lstUserService.getRole() || this.appStateService.userRole;
        const orgIds = this.lstUserService.getPrimaryOrgId() || this.appStateService.primaryOrgId;
        this.orgIds = (orgRole === UserRole.CustomerAdmin)
            ? orgIds.split(UserConstants.CHAR_COMMA)
            : new Array<string>(this.orgId);
        this.usersSearchDataSource = new SearchDataSource(this.userService,
            this.commonUtils, this.orgIds, this.userType);
        this.loadUserList();
        this.userListDataSource.userDetails$.pipe(takeUntil(this._onDestroy$)).subscribe(userList =>
            this.dataSource.data = userList
        );
        this.userListDataSource.error$.pipe(takeUntil(this._onDestroy$)).subscribe(error =>
            this.isError = error
        );
        this.userListDataSource.totalCount$.pipe(takeUntil(this._onDestroy$)).subscribe(count =>
            this.isZeroResults = !count
        );
        this.userListDataSource.loading$.pipe(takeUntil(this._onDestroy$)).subscribe(loading =>
            this.loading = loading
        );
        this.userListDataSource.filteredUserCount$.pipe(takeUntil(this._onDestroy$)).subscribe(count => {
            this.isZeroSearchResult = !count;
            if (this.userIds.length > 0) {
                this.paginator.pageIndex = 0;
                this.totalUsers = count;
                if (this.totalUsers === 0) {
                    this.disableSelect = true;
                }
            }
        });
    }

    ngAfterViewInit(): void {
        this.cdRef.detectChanges();
        this.paginator.page
            .pipe(tap(() => this.loadUserList()))
            .subscribe();
    }

    updateUserCount(): void {
        this.postMessageService.messages$.subscribe(data => {
            this.totalUsers = data.totalUsers || this.totalUsers;
        });
    }

    addUserIds(userId: string): void {
        this.userIds.push(userId);
    }

    removeUserIds(suggestion: Suggestion): void {
        this.userIds = this.userIds.filter(userId => !(suggestion.id === userId));
    }

    searchUser(): void {
        if (this.userIds.length > 0) {
            this.telemetry.sendUserSearchEvent(this.productId, null);
            this.disableSelect = false;
            this.userListDataSource.getUsers(this.orgIds, this.productId,
                this.pageSize, UserConstants.ZERO, this.userType, this.userIds);
        } else {
            this.disableSelect = true;
            this.updateUserCount();
            this.loadUserList(); 
        }
    }
    
    loadUserList(): void {
        this.offset = this.paginator.pageIndex * this.pageSize;
        this.userListDataSource.getUsers(this.orgIds, this.productId, this.pageSize, this.offset, this.userType);
    }

    exportUsers(event: string): void {
        this.showExportLoader = true;
        this.telemetry.sendUserExportEvent(event, this.productId, this.userType);
        let userResponse: Observable<ApolloQueryResult<GetExportUsers>>;
        if (event === UserConstants.EXPORT_ALL) {
            userResponse = this.userService.getUsersForExport(this.orgIds, this.productId,
                this.pageSize, UserConstants.ZERO, this.userType, this.totalUsers);
        } else {
            userResponse = this.userService.getUsersForExport(this.orgIds, this.productId,
                this.pageSize, UserConstants.ZERO, this.userType, this.totalUsers, this.userIds);
        }
        this.exportUsersList(userResponse);
    }

    exportUsersList(userResponse: Observable<ApolloQueryResult<GetExportUsers>>): void {
        userResponse.subscribe(users => {
            const userList: User[] = users.data.exportUsers.map(userDetail => {
                if (userDetail) {
                    const { userName } = this.commonUtils.getUserDetail(userDetail);
                    const user: User = {
                        userName,
                        organizationName: userDetail.organization.name,
                        className: userDetail.section.map((section) =>
                            section.sectionName).join(UserConstants.CHAR_COMMA_SPACE)
                    };
                    return user;
                }
            });
            const filename = UserConstants.exported +
                (this.userType === UserConstants.USER_TYPE_STUDENT ? UserConstants.students : UserConstants.teachers) +
                UserConstants.dateToday;
            const fileHeaders = this.userType === UserConstants.USER_TYPE_STUDENT ?
                UserConstants.studentExportFileHeaders : UserConstants.teacherExportFileHeaders;
            this.commonUtils.exportUsers(userList, filename, fileHeaders);
            this.showExportLoader = false;
        });
    }

    clearUsers(): void {
        this.userIds = [];
    }

    ngOnDestroy(): void {
        this._onDestroy$.next();
        this._onDestroy$.complete();
    }
}
