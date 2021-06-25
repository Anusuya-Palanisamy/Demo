import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserRootComponent } from './pages/user-root/user-root.component';

const routes: Routes = [
    {
        path: '',
        component: UserRootComponent,
        children: [
            {
                path: 'users',
                component: UserListComponent
            },
            {
                path: '',
                component: UserListComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }
