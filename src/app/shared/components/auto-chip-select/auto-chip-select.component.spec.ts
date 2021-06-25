import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, InjectionToken } from "@angular/core";
import { async, ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent, _MatAutocompleteBase } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatOptionModule, _MatOptionBase } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { LstUserService } from "@lst/lst-auth";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { ApolloTestingModule } from "apollo-angular/testing";
import { disconnect } from "process";
import { CoreModule } from "src/app/core/core.module";
import { UserListComponent } from "src/app/users/components/user-list/user-list.component";
import { UserConstants } from "src/app/users/constants/user.constants";
import { SearchDataSource } from "src/app/users/datasource/search-datasource";
import { UserService } from "src/app/users/services/user.service";
import { TestingModule } from "src/testing/testing.module";
import { CustomTranslateLoader } from "../../translate/custom-translate-loader";
import { CommonUtils } from "../../utils/common.utils";
import { AutoChipSelectComponent } from "./auto-chip-select.component";
import { AutoCompleteSelectDataSource, FilteredCollectionViewer, PagedResults, Suggestion } from "./types";


describe('AutoChipSelectComponent', () => {
    let component: AutoChipSelectComponent<any>;
 
    let fixture: ComponentFixture<AutoChipSelectComponent<any>>;
    let changeDetectorRef:ChangeDetectorRef;
    let   service: UserService;
    let commonUtils: CommonUtils;
    let userType:string;
    let orgIds: string[];
    let users;
    beforeEach(async(()=> {
        TestBed.configureTestingModule({
            declarations: [AutoChipSelectComponent], 
            imports: [
                CommonModule,
                TranslateModule,
                MatSnackBarModule,
                MatAutocompleteModule,
                MatInputModule,
                MatFormFieldModule,
                MatChipsModule,
                MatProgressSpinnerModule,
                ReactiveFormsModule,
                MatIconModule,
                MatCheckboxModule,
                MatSelectModule,
                MatButtonModule,
                MatButtonToggleModule,
                MatTooltipModule,
                TestingModule,
                MatOptionModule,
                BrowserAnimationsModule,
                
                
            ],
            providers: [ ChangeDetectorRef]
            
        })
            .compileComponents();
    }));

    beforeEach(() => {
        changeDetectorRef  = TestBed.inject(ChangeDetectorRef);
        fixture = TestBed.createComponent(AutoChipSelectComponent);
        component = fixture.debugElement.componentInstance;
        users = new SearchDataSource(service, commonUtils,orgIds,userType);
        component.dataSource = users;
        fixture.detectChanges();
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    
    it('should test chipInputEnd', () => {
        component.chipInputEnd();
        expect(component.autoCompleteInput.nativeElement.value).toBe('');
    });

    
    it('should deSelect Value', () => {
        spyOn(component.selectedValues, 'deselect');
        component.deselect('aaa');
        expect(component.selectedValues.deselect).toHaveBeenCalled();
    });

    it('should test doClear event', () => {
        
        spyOn(component.selectedValues, 'clear');
        component.doClear();
        expect(component.selectedValues.clear).toHaveBeenCalled();
    });

    it('check if the suggestions are loaded on entering a value in the input', async () => {
        component.dataSource = users;
        const inputElement = fixture.debugElement.nativeElement.querySelector(
            'input'
        );
        inputElement.value = 'First';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.suggestions.value.length).toBe(0);
    });

    it('check if option is selected and inputControl is reset on calling optionSelected', async () => {
    
        const selectSpy = spyOn(component.selectedValues, 'select');
        const inputControlSpy = spyOn(component.inputControl, 'reset');
        component.optionSelected( new MatAutocompleteSelectedEvent(undefined, { value: 'orgId1' } as _MatOptionBase ));
        expect(selectSpy).toHaveBeenCalledWith('orgId1');
        expect(inputControlSpy).toHaveBeenCalledWith(null);
        expect(component.autoCompleteInput.nativeElement.value).toEqual('');
    });

    it('check on scroll method to set the start index to the limit', async () => {
        component.onScroll();
        expect(component.suggestions.value.length).toBe(0);
    });

});
