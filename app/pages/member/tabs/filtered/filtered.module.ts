import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipe/pipes/pipes.module';

import { FilteredPage } from './filtered.page';

const routes: Routes = [
  {
    path: '',
    component: FilteredPage
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
  declarations: [FilteredPage],
})
export class FilteredPageModule {}
