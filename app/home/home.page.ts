import { Component } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';

import { AuthenticationService } from '../service/authentication.service';
import { UserService } from '../service/user.service';
import { CommonService } from '../service/common.service';

import { CertificationComponent } from '../modal/certification/certification.component';
import { ListsComponent } from '../pages/payments/lists/lists.component';
import { MyGolfjoinComponent } from '../modal/mypage/my-golfjoin/my-golfjoin.component';
import { MyPremiumComponent } from '../modal/mypage/my-premium/my-premium.component';
import { EventComponent } from 'src/app/modal/event/event.component';
import { NavigationExtras } from '@angular/router';
import { PaymentService } from '../service/payment.service';
import { BadgeService } from '../service/badge.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private observable$: any;
  private observableMe$: any;

  me: any;
  myInfo: any = {
    division: '',
    class: '이용권 없음',
    expire: ''
  };
  images = 'assets/icon/profile-none.jpg';

  constructor(
    public auth: AuthenticationService,
    public modal: ModalController,
    public userS: UserService,
    public commonS: CommonService,
    public nav: NavController,
    public platform: Platform,
    public paymentS: PaymentService,
    public badgeS: BadgeService
  ) {
    this.observable$ = this.commonS.badge$.subscribe((data: any) => {
      this.myInfo.join = data.join;
      this.myInfo.joinRsvp = data.joinRsvp;
      this.myInfo.premium = data.premium;
      this.myInfo.premiumRsvp = data.premiumRsvp;
      this.myInfo.screen = data.screen;
      this.myInfo.screenRsvp = data.screenRsvp;
    });

    this.observableMe$ = this.commonS.me$.subscribe((data: any) => {
      this.me = data;

      let now = new Date();
      let normal_expired_at: any = this.me.normal_expired_at;
      let premium_expired_at: any = this.me.expired_at;

      if (this.me.normal_expired_at) {
        let me_expired_at = normal_expired_at.replace(/-/g,'/');
        let n_expire = new Date(me_expired_at);
        
        if (n_expire > now) {
          this.myInfo.division = '(일반 이용권)';
        }
        this.myInfo.expire = me_expired_at;
      }

      if (this.me.expired_at) {
        let me_expired_at = premium_expired_at.replace(/-/g,'/');
        let p_expire = new Date(me_expired_at);
        
        if (p_expire > now) {
          this.myInfo.division = '(프리미엄 이용권)';
          this.myInfo.expire = me_expired_at;
        } else {
          if (this.me.normal_expired_at) {
            normal_expired_at = new Date(normal_expired_at.replace(/-/g,'/'));
            if (normal_expired_at < p_expire) {
              this.myInfo.expire = me_expired_at;  
            }
          } else {
            this.myInfo.expire = me_expired_at;
          }
        }
      }

      if (this.myInfo.expire) {
        let expire = new Date(this.myInfo.expire);
        if (expire > now) {
          this.myInfo.class = '유료회원';
        }
      }
      
    });
  }

  async ngOnInit() {
    if (!this.platform.is('ios')) {
      if (this.me) this.isPhoneModal();
    }

    // 팝업이벤트 만료일 -> 추후 DB 작업 필요
    let lastDay = new Date('2021-03-31 23:59:59');

    if (new Date() < lastDay) {  
  
      this.commonS.getStorage('eventPopup').then(data => {
        if (data) {
          let findType = data.find((r: { type: any }) => { return r.type == 'screen' });

          if (new Date(findType.date) < new Date()) {
            this.eventModal();
          }
        } else {
          this.eventModal();
        }
      });

    }

    await this.badgeS.refresh();

    this.auth.fbScreen('mypage');
  }

  ngOnDestroy() {
    this.observable$.unsubscribe();
    this.observableMe$.unsubscribe();
  }

  imgError(event: any) {
    event.target.src = this.images;
  }

  paymentModal() {
    this.nav.navigateForward('payments/lists');
  }

  golfjoinModal() {
    this.commonS.commonModal({}, MyGolfjoinComponent);
  }

  premiumModal() {
    this.commonS.commonModal({}, MyPremiumComponent);
  }

  navScreen(tab: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        tabs: tab,
        nav: 'mypage'
      }
    }
    this.nav.navigateRoot(['screen'], navigationExtras);
  }

  async isPhoneModal() {
    if (this.me.profile.phone) {
      return;
    }

    let modal = await this.modal.create({
      component: CertificationComponent,
    });
    return await modal.present();
  }

  async eventModal() {
    let modal = await this.modal.create({
      component: EventComponent,
      backdropDismiss: false,
      cssClass: 'global-modal-event'
    });

    return await modal.present();
  }
}
