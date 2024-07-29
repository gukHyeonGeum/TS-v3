import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from 'src/app/pipe/pipes/pipes.module';
import { ViewPageRoutingModule } from './view-routing.module';

import { ViewPage } from './view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ViewPageRoutingModule
  ],
  declarations: [ViewPage]
})
export class ViewPageModule {}
