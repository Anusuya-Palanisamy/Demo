export class MockActivatedRoute {
    parent: MockActivatedRoute;
    queryParamMap: any;
    snapshot = { params: {} };
    constructor(options) {
        this.parent = options.parent;
        this.queryParamMap = options.queryParamMap;
    }
}
