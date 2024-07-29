import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivePremiumPage } from './active-premium.page';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ActivePremiumPage,
    children: [
      {
        path: 'invite',
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            loadChildren: () => import('./ap-invite/ap-invite.module').then(m => m.ApInvitePageModule)
          }
        ]
      },
      {
        path: 'request',
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            loadChildren: () => import('./ap-request/ap-request.module').then(m => m.ApRequestPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/active-premium/invite',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/active-premium/invite',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ActivePremiumPageRoutingModule {}