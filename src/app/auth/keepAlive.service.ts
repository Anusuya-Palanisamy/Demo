import { Injectable } from '@angular/core';
import { LstPostMessageService } from '@lst/lst-auth';
import * as lodashThrottle from 'lodash.throttle';

@Injectable()
export class KeepAliveService {
    constructor(private postMessageService: LstPostMessageService) { }

    // Limit keepAlive messages to server to at max 1 per minute
    static MESSAGE_THROTTLE_INTERVAL = 60000;

    keepAlive = lodashThrottle(() => {
        this.sendKeepAliveMessage();
    }, KeepAliveService.MESSAGE_THROTTLE_INTERVAL);


    sendKeepAliveMessage(): void {
        this.postMessageService.sendMessageToParent('keepAlive');
    }
}
