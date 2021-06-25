import { Injectable } from '@angular/core';
import { PostMessagingService } from '@lst/post-messaging';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PostMessagesService {

    parentConn$: any;
    private messageSource = new BehaviorSubject<any>({});
    messages$ = this.messageSource.asObservable();

    constructor(private readonly postMessagingService: PostMessagingService) {
        void this.connectParent();
    }

    connectParent = async () => {
        this.parentConn$ = await this.postMessagingService.connectToParent(this.handleParentMessage.bind(this));
    }

    handleParentMessage = (action: string, payload?: any): Promise<any> => {
        switch (action) {
            case 'SET_USERS_COUNT':
                this.messageSource.next(payload);
                break;
            default:
                return Promise.reject('No Handler found!!');
        }
    }

}
