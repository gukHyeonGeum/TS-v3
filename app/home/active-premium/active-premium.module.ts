import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ActivePremiumPageRoutingModule } from './active-premium.router.module';

import { ActivePremiumPage } from './active-premium.page';

const routes: Routes = [
  {
    path: '',
    component: ActivePremiumPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ActivePremiumPageRoutingModule
  ],
  declarations: [ActivePremiumPage]
})
export class ActivePremiumPageModule {}
