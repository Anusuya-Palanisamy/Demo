import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { UserRootComponent } from './pages/user-root/user-root.component';
import { UsersRoutingModule } from './user-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ExportCSVComponent } from './components/export-csv/export-csv.component';

@NgModule({
    declarations: [
        UserRootComponent,
        UserListComponent,
        ExportCSVComponent
    ],
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatGridListModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        SharedModule,
        MatListModule,
        MatSnackBarModule,
        CommonModule,
        UsersRoutingModule,
        TranslateModule,
        MatProgressSpinnerModule,
        MatSortModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatSelectModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatTooltipModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsersModule { }
