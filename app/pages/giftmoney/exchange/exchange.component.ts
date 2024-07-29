import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/service/common.service';

import { BankAccountComponent } from 'src/app/pages/giftmoney/bank-account/bank-account.component';
import { PaymentService } from 'src/app/service/payment.service';

import { ConfirmComponent } from 'src/app/modal/confirm/confirm.component';
import { AlertService } from 'src/app/service/alert.service';
import { UserService } from 'src/app/service/user.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent implements OnInit {

  private observableMe$: any;

  me: any;
  bankInfo: any;

  backdropShow: boolean = false;

  selectMoney: number = 0;
  exchangeMoneys: any = [
    {
      title: '5만원',
      money: 50000,
    },
    {
      title: '10만원',
      money: 100000,
    },
    {
      title: '15만원',
      money: 150000,
    },
    {
      title: '20만원',
      money: 200000,
    },
    {
      title: '25만원',
      money: 250000,
    },
    {
      title: '30만원',
      money: 300000,
    },
  ]

  constructor(
    private _modal: ModalController,
    public auth: AuthenticationService,
    public commonS: CommonService,
    public paymentS: PaymentService,
    public alertS: AlertService,
    public userS: UserService
  ) { 
    this.observableMe$ = this.commonS.me$.subscribe((data: any) => {
      this.me = data;
      console.log(this.me);
    });
  }

  ngOnInit() {
    this.auth.fbScreen('giftmoney_exchange');
  }

  ngOnDestroy() {
    this.observableMe$.unsubscribe();
  }

  selectedMoney(exchange: any, ev: any) {
    if (this.me.money < exchange.money) {
      this.alertS.alert('알림', '보유 기프트머니가 부족합니다.');
      return;
    }

    this.selectMoney = exchange.money;
  }

  submit() {

    this.backdropShow = true;
    this.commonS.commonModal(
      {
        data: {
          okText: '교환 신청',
          cancelText: '취소',
          content: `
            <p class="ion-text-center">기프트머니<br />` + this.selectMoney + `원을 교환신청 합니다.</p>
            <p class="ion-text-center">신청 후 취소 할 수 없습니다.</p>
          `
        }
      }, 
      ConfirmComponent, 
      'auto-height', 
      false
    ).then(modal => {
      
      modal.onDidDismiss().then(detail => {
        console.log('detail: ', detail);
        if (detail.data == 'yes') {
          this.paymentS.setGiftmoneyExchange(
            {
              user_id: this.me.id,
              money: this.selectMoney,
              account_number: this.bankInfo.accountNumber,
              account_name: this.bankInfo.accountName,
              account_bank: this.bankInfo.accountBank
            }
          ).then(user => {
            console.log('user: ', user);
            this.close(true);
            this.selectMoney = 0;
            this.userS.putUserUpdate('giftMoney', user);
          }).catch(() => {});
        }

        this.backdropShow = false;
      });
    });
  }

  close(flag: boolean = false) {
    this._modal.dismiss(flag);
  }

  // 계좌 설정
  async bankAccountModal() {
    let modal = await this._modal.create({
      component: BankAccountComponent,
      componentProps: { bankInfo: this.bankInfo },
    });
    modal.onWillDismiss().then(detail => {
      if (detail.data) {
        this.bankInfo = detail.data;
      }
    });
		await modal.present();
  }

}
