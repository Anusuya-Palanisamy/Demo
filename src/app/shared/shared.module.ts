import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AutoChipSelectComponent } from './components/auto-chip-select/auto-chip-select.component';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OptionsScrollDirective } from './options-scroll.directive';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule
    ],
    declarations: [AutoChipSelectComponent, OptionsScrollDirective],
    exports: [AutoChipSelectComponent]
})
export class SharedModule { }
