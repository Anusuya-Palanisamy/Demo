/* eslint-disable @typescript-eslint/no-floating-promises */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserConstants } from '../../constants/user.constants';
import { ExportCSVComponent } from './export-csv.component';


describe('ExportCSVComponent', () => {
    let component: ExportCSVComponent;
    let fixture: ComponentFixture<ExportCSVComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExportCSVComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportCSVComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.disableSelect = false;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update the selected export option', () => {
        component.exportOptions = UserConstants.exportProductOptions;
        component.disableSelect = true;
        const event = 'Export All';
        component.updateExportSelection(event);
        expect(component.selectedOption).toBe(event);
    });
});
