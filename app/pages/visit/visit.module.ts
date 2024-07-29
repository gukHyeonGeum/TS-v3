import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VisitPage } from './visit.page';
import { PipesModule } from '../../pipe/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: VisitPage
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
  declarations: [VisitPage]
})
export class VisitPageModule {}
