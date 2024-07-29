import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ActiveGolfjoinPageRoutingModule } from './active-golfjoin.router.module';

import { ActiveGolfjoinPage } from './active-golfjoin.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveGolfjoinPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ActiveGolfjoinPageRoutingModule
  ],
  declarations: [ActiveGolfjoinPage]
})
export class ActiveGolfjoinPageModule {}
