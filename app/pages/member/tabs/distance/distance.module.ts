import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipe/pipes/pipes.module';

import { DistancePage } from './distance.page';

const routes: Routes = [
  {
    path: '',
    component: DistancePage
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
  declarations: [DistancePage]
})
export class DistancePageModule {}
