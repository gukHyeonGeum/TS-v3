import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhoneLoginPageRoutingModule } from './phone-login-routing.module';

import { PhoneLoginPage } from './phone-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PhoneLoginPageRoutingModule
  ],
  declarations: [PhoneLoginPage]
})
export class PhoneLoginPageModule {}
