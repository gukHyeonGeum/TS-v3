import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../pipe/pipes/pipes.module';

import { GolfjoinPage } from './golfjoin.page';
import { PostComponent } from './post/post.component';
import { GolfjoinGuideComponent } from 'src/app/modal/golfjoin-guide/golfjoin-guide.component';
import { PremiumGuideComponent } from 'src/app/modal/premium-guide/premium-guide.component';

const routes: Routes = [
  {
    path: '',
    component: GolfjoinPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule,
    ReactiveFormsModule
  ],
  declarations: [
    GolfjoinPage, 
    PostComponent,
    GolfjoinGuideComponent,
  ],
  entryComponents: [
    PostComponent,
    GolfjoinGuideComponent,
  ]
})
export class GolfjoinPageModule {}
