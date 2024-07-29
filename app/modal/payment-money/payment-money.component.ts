import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { AlertService } from 'src/app/service/alert.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { LoadingService } from 'src/app/service/loading.service';
import { PaymentService } from 'src/app/service/payment.service';
import { UserService } from 'src/app/service/user.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { appConfig } from 'src/config';
import { LogsService } from 'src/app/service/logs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-money',
  templateUrl: './payment-money.component.html',
  styleUrls: ['./payment-money.component.scss'],
})
export class PaymentMoneyComponent implements OnInit {
  @Input() giftmoney: any;
  
  me: any;
  payMoneys: any;
  selectMoney: number = 0;
  selectCode: string = '';
  selectType: string = '';
  selectPay: any;

  Tradeid: any;
  resumeListener: Subscription = new Subscription();

  payForm: FormGroup;

  constructor(
    public iab: InAppBrowser,
    private _modal: ModalController,
    private formBuilder: FormBuilder,
    public auth: AuthenticationService,
    public paymentS: PaymentService,
    public alertS: AlertService,
    public userS: UserService,
    public loadingS: LoadingService,
    public logS: LogsService,
    public plt: Platform
    
  ) { 
    this.auth.getMe().then(me => {
      this.me = me;
    });

    this.paymentS.getPayMoney().then(data => {
      this.payMoneys = data;
    }).catch(() => {
      this.close();
    });
  }

  ngOnInit() {
    this.resumeListener = this.plt.resume.subscribe(ev => {
      this.findPayment();
    });
  }

  ngOnDestroy() {
    this.resumeListener.unsubscribe();
  }

  money(payMoney: any, ev: any) {
    this.selectPay = payMoney;
    this.selectMoney = payMoney.money;
    this.selectCode = payMoney.item_code;
  }

  paymentType(type: any) {
    this.selectType = type;
  }

  result() {
    this.findPayment();
  }

  payment() {
    if (this.selectMoney === 0) {
      this.alertS.alert('알림', '기프트머니를 선택하세요.');
      return;
    }

    if (!this.selectType) {
      this.alertS.alert('알림', '결제방식을 선택하세요.');
      return;
    }

    this.paymentS.setPaymentCart(
        {
          CASH_GB: this.selectType,
          Prdtprice: this.selectPay.money,
          code: this.selectPay.item_code,
          Prdtnm: this.selectPay.title
        }
      ).then(data => {
        this.Tradeid = data.Tradeid;

        const browser = this.iab.create(`${appConfig.teeshotConfig.webUrl}/payment/giftmoney/paypopup?Tradeid=`+ data.Tradeid +`&token=`+ this.auth.isToken(), '_system', 'location=yes');

      }).catch(() => {});

  }

  findPayment() {
    this.paymentS.getPaymentCount(
      {
        Tradeid: this.Tradeid
      }
    ).then(count => {
      if (count) {
        this.userS.getTokenUser(this.auth.isToken()).then(user => {

          this.logS.errors({
            f_1: 'payment',
            f_2: 'getTokenUser',
            f_5: 'ionic',
            body: user
          });

          this.me.money = user.money;
          this.close(true);
          this.alertS.alert('충전완료', '기프트머니 충전이 완료되었습니다.');
        });  
      }
    });
  }

  close(flag: boolean = false) {
    this._modal.dismiss(flag);
  }

}
