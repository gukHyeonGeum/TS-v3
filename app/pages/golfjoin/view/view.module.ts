import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../../pipe/pipes/pipes.module';
import { PopMoreJoinComponent } from './pop-more-join/pop-more-join.component';

import { ViewPage } from './view.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPage
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
  declarations: [ViewPage, PopMoreJoinComponent],
  entryComponents: [PopMoreJoinComponent]
})
export class ViewPageModule {}
