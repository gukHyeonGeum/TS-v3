import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PremiumPage } from './premium.page';
import { PipesModule } from '../../pipe/pipes/pipes.module';
import { PostComponent } from './post/post.component';
import { PreviewComponent } from './post/preview/preview.component';
import { PremiumGuideComponent } from 'src/app/modal/premium-guide/premium-guide.component';

const routes: Routes = [
  {
    path: '',
    component: PremiumPage
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
    PremiumPage, 
    PostComponent, 
    PreviewComponent,
    PremiumGuideComponent,
  ],
  entryComponents: [
    PostComponent, 
    PreviewComponent,
    PremiumGuideComponent,
  ]
})
export class PremiumPageModule {}
