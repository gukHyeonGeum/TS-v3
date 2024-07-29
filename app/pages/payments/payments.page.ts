import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, Platform } from '@ionic/angular';

import { CommonService } from 'src/app/service/common.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { AlertService } from 'src/app/service/alert.service';
import { LoadingService } from 'src/app/service/loading.service';
import { PaymentService } from 'src/app/service/payment.service';
import { VerifyService } from 'src/app/service/verify.service';
import { LogsService } from 'src/app/service/logs.service';
import { UserService } from 'src/app/service/user.service';

import { RefundComponent } from './refund/refund.component';
import { BugsComponent } from 'src/app/pages/settings/bugs/bugs.component';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {

  private observableSub$: any;

  me: any;
  items: any;
  lists: any;

  
  platform = '';
  basicCode = 'sub_n';
  premiumCode = 'sub_p';

  normalSub = false;
  premiumSub = false;

  subscriber: any = {};

  constructor(
    public auth: AuthenticationService,
    public commonS: CommonService,
    public modal: ModalController,
    public plt: Platform,
    public ap: AlertService,
    public loading: LoadingService,
    public paymentS: PaymentService,
    public verifyS: VerifyService,
    public logS: LogsService,
    public userS: UserService,
    public nav: NavController,
    public alertController: AlertController,
    public dc: ChangeDetectorRef,
    public ngzone: NgZone
  ) { 

    this.observableSub$ = this.commonS.subscriberMode$.subscribe((data: any) => {
      if (data) {
        this.subscriber = data;

        this.ngzone.run(() => {
          if (data.id.indexOf('sub_n') !== -1) {
            this.normalSub = true;
            this.premiumSub = false;
          } else if (data.id.indexOf('sub_p') !== -1) {
            this.normalSub = false;
            this.premiumSub = true
          }

          if (data.expiryDate < new Date()) {
            this.normalSub = false;
            this.premiumSub = false;
            this.commonS.subscriberMode$.next('');
          }
        });
        // this.dc.detectChanges();
      } else {
        this.ngzone.run(() => {
          this.normalSub = false;
          this.premiumSub = false;
        });
      }
    });

    if (this.plt.is('ios')) {
      this.platform = 'ios';
      this.basicCode = 'sub_nn';
      this.premiumCode = 'sub_pp';
    } else {
      this.platform = 'android';
    }

  }

  async ngOnInit() {
    this.commonS.selectedIndex$.next(1);
    
    await this.auth.getMe().then(me => {
      this.me = me;
    });

    this.auth.fbScreen('payments');
  }

  ngOnDestroy() {
    this.observableSub$.unsubscribe();
  }

  purchase(productId: any, prorationMode: any = '') {
    if (!this.plt.is('cordova')) { return; }
    if (!this.me.profile.is_certified) { 
      this.ap.alert('알림', '휴대폰 인증을 먼저 진행하셔야합니다.');
      return;
    }

    this.paymentS.getIsSub({ id: productId }).then(res => {
      if (res) {
        this.storeOrder(productId, prorationMode);
      }
    });
  }

  storeOrder(productId: any, prorationMode: any) {
    try {
      this.loading.show(30000);
      
      let proration = {};
      if (prorationMode) {
        proration = { prorationMode: prorationMode }
      }
      this.paymentS.store.order(productId, proration).then((order: any) => {
        this.logS.errors({
          f_1: 'payment',
          f_2: 'purchase order',
          f_5: 'ionic',
          body: order
        });
      }).error((e: any) => {
        this.loading.hide();
        this.logS.errors({
          f_1: 'payment',
          f_2: 'purchase error',
          f_5: 'ionic',
          body: e
        });
      });
    } catch (err) {
      this.loading.hide();
      this.logS.errors({
        f_1: 'payment',
        f_2: 'purchase catch',
        f_5: 'ionic',
        body: ''
      });
    }
  }

  async paymentModal() {
    this.nav.navigateForward('payments/lists');
  }

  refund() {
    this.commonS.commonModal({}, RefundComponent);
  }

  inquiry() {
    this.commonS.commonModal({}, BugsComponent);
  }

  async cancelSubConfirm() {
    this.paymentS.store.manageSubscriptions();

    let resume = this.plt.resume.subscribe(() => {
      this.paymentS.store.refresh().finished(() => {
        this.dc.detectChanges();
      });
      resume.unsubscribe();
    });
  }

  restorePurchases() {
    this.paymentS.store.refresh();
  }

}
