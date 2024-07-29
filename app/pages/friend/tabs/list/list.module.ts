import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../../../../pipe/pipes/pipes.module';
import { ListPage } from './list.page';

import { FListMoreComponent } from './f-list-more/f-list-more.component';

const routes: Routes = [
  {
    path: '',
    component: ListPage
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
  declarations: [ListPage, FListMoreComponent],
  entryComponents: [FListMoreComponent]
})
export class ListPageModule {}
