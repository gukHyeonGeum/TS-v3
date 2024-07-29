import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipe/pipes/pipes.module';

import { ViewComponent } from './view/view.component';
import { FilterPage } from './filter.page';

const routes: Routes = [
  {
    path: '',
    component: FilterPage
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
  declarations: [FilterPage, ViewComponent],
  entryComponents: [ViewComponent]
})
export class FilterPageModule {}
