import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipe/pipes/pipes.module';

import { UpdatedPage } from './updated.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatedPage
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
  declarations: [UpdatedPage]
})
export class UpdatedPageModule {}
