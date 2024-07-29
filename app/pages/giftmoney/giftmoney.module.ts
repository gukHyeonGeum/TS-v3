import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GiftmoneyPageRoutingModule } from './giftmoney-routing.module';

import { GiftmoneyPage } from './giftmoney.page';
import { ExchangeComponent } from './exchange/exchange.component';
import { BankAccountComponent } from './bank-account/bank-account.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GiftmoneyPageRoutingModule
  ],
  declarations: [GiftmoneyPage, ExchangeComponent, BankAccountComponent],
  entryComponents: [ExchangeComponent, BankAccountComponent]
})
export class GiftmoneyPageModule {}
