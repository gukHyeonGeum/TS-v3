import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberPage } from './member.page';

const routes: Routes = [
  {
    path: '',
    component: MemberPage,
    children: [
      {
        path: 'recommended',
        children: [
          {
            path: '',
            loadChildren: () => import('./tabs/recommended/recommended.module').then(m => m.RecommendedPageModule)
          }
        ]
      },
      {
        path: 'updated',
        children: [
          {
            path: '',
            loadChildren: () => import('./tabs/updated/updated.module').then(m => m.UpdatedPageModule)
          }
        ]
      },
      {
        path: 'popular',
        children: [
          {
            path: '',
            loadChildren: () => import('./tabs/popular/popular.module').then(m => m.PopularPageModule)
          }
        ]
      },
      {
        path: 'created',
        children: [
          {
            path: '',
            loadChildren: () => import('./tabs/created/created.module').then(m => m.CreatedPageModule)
          }
        ]
      },
      {
        path: 'distance',
        children: [
          {
            path: '',
            loadChildren: () => import('./tabs/distance/distance.module').then(m => m.DistancePageModule)
          }
        ]
      },
      {
        path: 'filter',
        children: [
          {
            path: '',
            loadChildren: () => import('./tabs/filter/filter.module').then(m => m.FilterPageModule)
          },
          { 
            path: 'filtered',
            loadChildren: () => import('./tabs/filtered/filtered.module').then(m => m.FilteredPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/member/recommended',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/member/recommended',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MemberPageRoutingModule {}