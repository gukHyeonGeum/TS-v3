import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AccountComponent } from './account/account.component';
import { DropComponent } from './account/drop/drop.component';
import { UsernameComponent } from './username/username.component';
import { PasswordComponent } from './password/password.component';
import { AlarmComponent } from './alarm/alarm.component';
import { PartnerComponent } from './partner/partner.component';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SettingsPage, AccountComponent, DropComponent, UsernameComponent, PasswordComponent, AlarmComponent, PartnerComponent],
  entryComponents: [AccountComponent, DropComponent, UsernameComponent, PasswordComponent, AlarmComponent, PartnerComponent]
})
export class SettingsPageModule {}
