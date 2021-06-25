/* eslint-disable @typescript-eslint/no-floating-promises */
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LstPostMessageService } from '@lst/lst-auth';

import { KeepAliveService } from './keepAlive.service';

describe('KeepAliveService', () => {
    let postMessageServiceMock;

    beforeEach(() => {
        postMessageServiceMock = jasmine.createSpyObj('LstPostMessageService', ['sendMessageToParent']);
        TestBed.configureTestingModule({
            providers: [
                KeepAliveService,
                { provide: LstPostMessageService, useValue: postMessageServiceMock }
            ]
        });
    });
    it('should send a keepAlive postMessage when keepAlive is called', () => {
        const service: KeepAliveService = TestBed.inject(KeepAliveService);
        service.keepAlive();
        expect(postMessageServiceMock.sendMessageToParent).toHaveBeenCalledWith('keepAlive');
    });
    it('should send only 1 keepAlive message per minute', fakeAsync(() => {
        const service: KeepAliveService = TestBed.inject(KeepAliveService);
        service.keepAlive();
        service.keepAlive();

        expect(postMessageServiceMock.sendMessageToParent).toHaveBeenCalledTimes(1);

        tick(40000);
        service.keepAlive();
        tick(40000);

        expect(postMessageServiceMock.sendMessageToParent).toHaveBeenCalledTimes(2);
    }));
});
