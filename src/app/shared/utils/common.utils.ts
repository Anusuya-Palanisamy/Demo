import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ngxCsv } from 'ngx-csv';
import { UserConstants } from 'src/app/users/constants/user.constants';
import { User } from 'src/app/users/datasource/user-list.datasource';
import { GetStudents_students } from 'src/app/users/queries/types/GetStudents';

export interface UserDetail {
    userName: string;
    userStatus: string;
}

@Injectable({
    providedIn: 'root'
})
export class CommonUtils {

    constructor(private translateService: TranslateService) {}

    exportUsers(data: any, fileName: string, exportedColumns: string[]): void {
        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            showTitle: false,
            useBom: true,
            noDownload: false,
            headers: exportedColumns
        };

        // tslint:disable-next-line: no-unused-expression
        new ngxCsv(data, fileName, options);
    }

    getFullName(firstName: string, lastName: string): string {
        firstName = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : firstName;
        lastName = lastName ? lastName.charAt(0).toUpperCase() + lastName.slice(1) : lastName;
        return [lastName, firstName].filter(name => name).join(UserConstants.CHAR_COMMA_SPACE);
    }

    mapUsers = (userDetail: GetStudents_students): User => {
        const { userName, userStatus } = this.getUserDetail(userDetail);
        return {
            userName,
            userStatus,
            organizationName: userDetail.organization.name,
            className: userDetail.section.map((section) =>
                section.sectionName).join(UserConstants.CHAR_COMMA_SPACE),
            userId: userDetail.enrollment.userId
        };
    }


    getUserDetail = (userDetail: GetStudents_students): UserDetail => {
        let userName = UserConstants.EMPTY;
        let userStatus = UserConstants.EMPTY;
        if (userDetail.enrollment && userDetail.enrollment.user) {
            userName = this.getFullName(
                userDetail.enrollment.user.firstName, userDetail.enrollment.user.lastName),
            userStatus = userDetail.enrollment.user.userStatus;
        }
        if (userDetail.enrollment && userDetail.enrollment.userId && !userDetail.enrollment.user) {
            userName += this.translateService.instant('deletedUser');
        }
        return { userName, userStatus };
    }
}
