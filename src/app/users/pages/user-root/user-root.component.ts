import { Component, OnDestroy, OnInit } from '@angular/core';
import { LstUserService } from '@lst/lst-auth';
import { Subject } from 'rxjs';
import { AllowedRoles } from 'src/app/roles';
import { AppStateService } from '../../services/app-state.service';

@Component({
    selector: 'user-root',
    templateUrl: './user-root.component.html',
    styleUrls: ['./user-root.component.css']
})
export class UserRootComponent implements OnInit, OnDestroy {
    isAuthorisedUser = false;
    private readonly _onDestroy: Subject<void> = new Subject<void>();

    constructor(private lstUserService: LstUserService,
        private appStateService: AppStateService) { }

    ngOnInit(): void {
        const orgRole = this.lstUserService.getRole() || this.appStateService.userRole;
        if (AllowedRoles.includes(orgRole)) {
            this.isAuthorisedUser = true;
        }
    }

    ngOnDestroy(): void {
        this._onDestroy.complete();
    }

}
