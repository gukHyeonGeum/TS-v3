import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JoinInfoPage } from './join-info.page';
import { PipesModule } from '../../pipe/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: JoinInfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [JoinInfoPage]
})
export class JoinInfoPageModule {}
