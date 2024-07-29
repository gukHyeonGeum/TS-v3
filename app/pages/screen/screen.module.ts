import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../../pipe/pipes/pipes.module';
import { ScreenPageRoutingModule } from './screen-routing.module';

import { ScreenPage } from './screen.page';
import { PostComponent } from './post/post.component';
import { ScreenMatchingNoComponent } from 'src/app/modal/screen-matching-no/screen-matching-no.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    ScreenPageRoutingModule
  ],
  declarations: [ScreenPage, PostComponent, ScreenMatchingNoComponent],
  entryComponents: [PostComponent, ScreenMatchingNoComponent]
})
export class ScreenPageModule {}
