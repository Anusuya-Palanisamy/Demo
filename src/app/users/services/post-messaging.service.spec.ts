import { TestBed } from "@angular/core/testing";
import { PostMessagingService } from "@lst/post-messaging";

describe('PostMessagesService', () => {
    let service: PostMessagingService;
   

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PostMessagingService
            ]
        });
        service = TestBed.inject(PostMessagingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});