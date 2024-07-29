import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GiftmoneyPage } from './giftmoney.page';

const routes: Routes = [
  {
    path: '',
    component: GiftmoneyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiftmoneyPageRoutingModule {}
