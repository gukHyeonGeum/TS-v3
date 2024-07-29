import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveGolfjoinPage } from './active-golfjoin.page';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ActiveGolfjoinPage,
    children: [
      {
        path: 'invite',
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            loadChildren: () => import('./ag-invite/ag-invite.module').then(m => m.AgInvitePageModule)
          }
        ]
      },
      {
        path: 'request',
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            loadChildren: () => import('./ag-request/ag-request.module').then(m => m.AgRequestPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/active-golfjoin/invite',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/active-golfjoin/invite',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ActiveGolfjoinPageRoutingModule {}