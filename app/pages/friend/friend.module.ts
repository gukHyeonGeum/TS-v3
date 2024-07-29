import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FriendPageRoutingModule } from './friend.router.module';

import { FriendPage } from './friend.page';

const routes: Routes = [
  {
    path: '',
    component: FriendPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FriendPageRoutingModule
  ],
  declarations: [FriendPage]
})
export class FriendPageModule {}
