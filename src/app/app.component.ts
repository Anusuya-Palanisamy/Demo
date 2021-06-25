import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LstPostMessageService } from '@lst/lst-auth';
import { TranslateService } from '@ngx-translate/core';
import { postMessageConstants } from './app.constants';
import { AppStateService } from './users/services/app-state.service';
import { PostMessagesService } from './users/services/post-messaging.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
    title = 'easybridge-search-web';
    parentConn$: any;

    constructor(
        private translateService: TranslateService,
        private postMessageService: LstPostMessageService,
        private appStateService: AppStateService,
        private postMessagingService: PostMessagesService
    ) {
        this.init();
    }

    init(): void {
        this.translateService.setDefaultLang('en');
        void this.postMessagingService.connectParent();
    }

    ngOnInit(): void {
        this.appStateService.setUserProfile();
    }

    @HostListener('window:message', ['$event'])
    onMessage(event): void {
        if (event && event.data && event.data.type === postMessageConstants.init) {
            this.postMessageService.sendMessageToParent({ type: postMessageConstants.ack });
        }
    }

    ngOnDestroy(): void {
        this.postMessageService.ngOnDestroy();
    }
}
