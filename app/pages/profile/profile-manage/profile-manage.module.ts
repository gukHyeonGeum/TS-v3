import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfileManagePage } from './profile-manage.page';
import { PipesModule } from '../../../pipe/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: ProfileManagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [ProfileManagePage]
})
export class ProfileManagePageModule {}
