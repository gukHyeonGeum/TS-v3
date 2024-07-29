import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackagePage } from './package.page';

const routes: Routes = [
  {
    path: '',
    component: PackagePage
  },
  {
    path: 'view',
    loadChildren: () => import('./view/view.module').then( m => m.ViewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackagePageRoutingModule {}
