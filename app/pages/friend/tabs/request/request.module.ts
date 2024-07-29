import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RequestPage } from './request.page';

import { PipesModule } from 'src/app/pipe/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: RequestPage
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
  declarations: [RequestPage]
})
export class RequestPageModule {}
