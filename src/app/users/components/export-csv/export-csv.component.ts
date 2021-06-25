/* eslint-disable no-console */
import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'export-csv',
    templateUrl: './export-csv.component.html',
    styleUrls: ['./export-csv.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ExportCSVComponent {
    @Input()
    exportOptions: string[];
    @Input()
    selectedOption: string;
    @Input()
    get disableSelect(): boolean {
        return this.disalbeSelectButton;
    }
    set disableSelect(select: boolean) {
        this.disalbeSelectButton = select;
        if (this.disableSelect) {
            this.selectedOption = this.exportOptions[0];
        }
    }
   
    @Input()
    showExportLoader: boolean;

    disalbeSelectButton = false;

    @Output() exportEvent = new EventEmitter<string>();

    updateExportSelection(event: string): void {
        this.selectedOption = event;
        this.exportCSV();
    }

    exportCSV(): void{
        this.exportEvent.emit(this.selectedOption); 
    }
}
