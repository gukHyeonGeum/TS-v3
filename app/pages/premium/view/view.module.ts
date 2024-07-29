import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../../pipe/pipes/pipes.module';
import { PostModifyComponent } from '../post-modify/post-modify.component';

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
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [ViewPage, PostModifyComponent],
  entryComponents: [PostModifyComponent]
})
export class ViewPageModule {}
