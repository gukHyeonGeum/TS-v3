import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../../pipe/pipes/pipes.module';

import { RoomPage } from './room.page';
import { EmojiPickerComponent } from 'src/app/components/emoji-picker/emoji-picker.component';

import { MessageRoomMenuComponent } from 'src/app/pages/message/room/message-room-menu/message-room-menu.component';

const routes: Routes = [
  {
    path: '',
    component: RoomPage
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
  declarations: [RoomPage, EmojiPickerComponent, MessageRoomMenuComponent],
  entryComponents: [EmojiPickerComponent, MessageRoomMenuComponent]
})
export class RoomPageModule {}
