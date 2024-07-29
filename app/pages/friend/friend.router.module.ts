import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendPage } from './friend.page';

const routes: Routes = [
  {
    path: '',
    component: FriendPage,
    children: [
      {
        path: 'request',
        children: [
          {
            path: '',
            loadChildren: () => import('./tabs/request/request.module').then(m => m.RequestPageModule)
          }
        ]
      },
      {
        path: 'list',
        children: [
          {
            path: '',
            loadChildren: () => import('./tabs/list/list.module').then(m => m.ListPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/friend/request',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/friend/request',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class FriendPageRoutingModule {}