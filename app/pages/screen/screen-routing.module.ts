import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScreenPage } from './screen.page';

const routes: Routes = [
  {
    path: '',
    component: ScreenPage
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScreenPageRoutingModule {}
