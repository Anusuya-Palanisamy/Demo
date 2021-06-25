import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { of } from "rxjs";
import { PagedResults, Suggestion } from "src/app/shared/components/auto-chip-select/types";
import { TestingModule } from "src/app/shared/testing/testing.module";
import { CommonUtils } from "src/app/shared/utils/common.utils";
import { UserService } from "../services/user.service";
import { SearchDataSource } from "./search-datasource";

describe('Search Datasource', () => {
    let dataSource: SearchDataSource;
    const userServiceSpy = jasmine.createSpyObj(UserService.name, ['getUsers']);
    
    const commonUtilsSpy = jasmine.createSpyObj(CommonUtils.name, ['getFullName']);
   let   service: UserService;
   let commonUtils: CommonUtils;
   let userType:string;
   let orgIds: string[];
   
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ApolloTestingModule,
                TestingModule
            ],
            providers: [
                 { prodvide: UserService, useValue: userServiceSpy },
                { prodvide: CommonUtils, useValue: commonUtilsSpy }]
        });    
        service = TestBed.inject(UserService);
        dataSource = new SearchDataSource(userServiceSpy, commonUtils,orgIds,userType); 
    });
  

    it('should be created', () => {
        void expect(dataSource).toBeTruthy();
    });
   

    it('should test Search Users', () => {
        expect(dataSource['filteredUsersSubject']).toBeDefined();
      
        dataSource.loading$.pipe().subscribe(teacherList => {
           expect(teacherList).toBeDefined();
       });
      
        dataSource.disconnect();
    });

    it('should test Search User data', () => {
        userServiceSpy.getUsers.and.returnValue(of(true));
      const  orgIds= ['sakueka9284808342'];
      const searchText= ['ass'];
      const  userType='student'
      const start= 1;
      const limit= 0.2;
    dataSource.searchUsers(orgIds,searchText,userType,start,limit);
    expect(userServiceSpy.getUsers).toHaveBeenCalledWith(orgIds,searchText,userType,limit,start);
    });
    
});
