import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LstAuthGuard, LstIframeAuthGuard, LstRouterModule } from '@lst/lst-auth';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/users',
        pathMatch: 'full'
    },
    {
        path: 'users',
        loadChildren: () => import('./users/user.module').then(m => m.UsersModule),
        canActivate: [LstIframeAuthGuard]
    },
    {
        path: 'users-stand-alone',
        loadChildren: () => import('./users/user.module').then(m => m.UsersModule),
        canActivate: [LstAuthGuard]
    },
    {
        path: '**',
        redirectTo: '/users'
    }
];

@NgModule({
    imports: [
        LstRouterModule.getRoutes(),
        RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
