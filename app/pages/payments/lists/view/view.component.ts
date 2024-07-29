import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/service/payment.service';
import { AlertService } from 'src/app/service/alert.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {

  private observableSub$: any;

  me: any;
  id: any;
  info: any;
  subscriber: any;
  platform: any;

  constructor(
    public auth: AuthenticationService,
    public _modal: ModalController,
    public activatedRoute: ActivatedRoute,
    public paymentS: PaymentService,
    public alertS: AlertService,
    public navParams: NavParams,
    public alertController: AlertController,
    public plt: Platform,
    public commonS: CommonService,
    public dc: ChangeDetectorRef
  ) { 
    this.id = this.navParams.get('id');

    this.auth.getMe().then(me => {
      this.me = me;
    }); 

    this.observableSub$ = this.commonS.subscriberMode$.subscribe((data: any) => {
      if (data) {
        this.subscriber = data;
      }
    });

    if (this.plt.is('android')) {
      this.platform = 'android';
    } else if (this.plt.is('ios')) {
      this.platform = 'ios';
    }
    
  }

  ngOnInit() {
    this.getView();
  }

  ngOnDestroy() {
    this.observableSub$.unsubscribe();
  }

  getView() {
    this.paymentS.getView(this.id).subscribe(res => {
      if (res.success) {
        this.info = res.data;
        this.info.code = this.info.item_code.substring(0,1);

        if (this.info.code == 'p' || this.info.code == 'n' || this.info.item_code.indexOf('sub_') !== -1) {
          this.info.started_at = this.info.started_at.replace(/-/g, '/');
          this.info.ended_at = this.info.ended_at.replace(/-/g, '/');
        }
        this.info.created_at = this.info.created_at.replace(/-/g, '/');
      } else {
        this.alertS.alert('오류', res.message);
      }
    }, e => {
      this.alertS.alert('오류', e.statusText);
    });
  }

  cancelSub(info: any) {
    let msg = '정말로 정기결제 취소신청을 하시겠습니까?';

    this.cancelSubConfirm(msg, info);
  }

  cancel(info: any) {

    const reggie = /(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
    const d = new Date();

    let msg = '';

    let eArray: any = reggie.exec(info.created_at); 
    let e = new Date(eArray[1],(eArray[2])-1, eArray[3], eArray[4], eArray[5], eArray[6]);
    let day = Math.floor( ( d.getTime() - e.getTime() )/(1000*60*60*24) );

    let code = info.item_code.substring(0,1);

    if (info.item_code == 'P') {
      msg = '<p>부킹 임박 취소일 경우,</p><p>골프장별 취소시한 및 위약금 규정에 따라</p><p>위약금이 발생합니다.</p><p>정말로 취소신청을 하시겠습니까?</p>';
    } else if (info.code == 'g') {
      msg = '<p>기프트머니 구매취소시</p><p>구매 경과일에 따라 취소 수수료가 발생할 수 있습니다.</p><p>정말로 취소신청을 하시겠습니까?</p>';
    } else {
      if (day > 7) {
        this.alertS.alert('알림', '<p>구매일로 부터 7일이 경과하여</p><p>취소가 불가합니다.</p>');
        return;
      }


      msg = '정말로 취소신청을 하시겠습니까?';
    }

    this.cancelConfirm(msg, info);

  }

  async cancelConfirm(msg: any, info: any) {
    const alert = await this.alertController.create({
      header: '취소신청',
      message: msg,
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: '확인',
          handler: () => {
            this.paymentS.putCancel(info.id).then(resolve => {
              if (resolve) {
                this.getView();
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async cancelSubConfirm(msg: any, info: any) {
    this.paymentS.store.manageSubscriptions();

    let resume = this.plt.resume.subscribe(() => {
      this.paymentS.store.refresh().finished(() => {
        this.dc.detectChanges();
      });
      resume.unsubscribe();
    });
  }

  close() {
    this._modal.dismiss();
  }
}
