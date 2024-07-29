import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../../../pipe/pipes/pipes.module';

import { AgRequestPage } from './ag-request.page';

const routes: Routes = [
  {
    path: '',
    component: AgRequestPage
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
  declarations: [AgRequestPage]
})
export class AgRequestPageModule {}
