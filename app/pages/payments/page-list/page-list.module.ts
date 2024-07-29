import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from 'src/app/pipe/pipes/pipes.module';

import { PageListPageRoutingModule } from './page-list-routing.module';

import { PageListPage } from './page-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageListPageRoutingModule,
    PipesModule
  ],
  declarations: [PageListPage]
})
export class PageListPageModule {}
