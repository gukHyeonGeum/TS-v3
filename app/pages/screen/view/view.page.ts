import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, NavController } from '@ionic/angular';

import { AlertService } from 'src/app/service/alert.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CommonService } from 'src/app/service/common.service';
import { ProfileService } from 'src/app/service/profile.service';
import { ScreenService } from 'src/app/service/screen.service';
import { VerifyService } from 'src/app/service/verify.service';

import { InvitationComponent } from '../invitation/invitation.component';
import { PaymentMoneyComponent } from 'src/app/modal/payment-money/payment-money.component';
import { PostComponent } from 'src/app/pages/screen/post/post.component';
import { ScreenMatchingComponent } from 'src/app/modal/screen-matching/screen-matching.component';
import { ScreenRequestComponent } from 'src/app/modal/screen-request/screen-request.component';
import { ScreenCloseComponent } from 'src/app/modal/screen-close/screen-close.component';
import { ScreenGiftmoneyPayComponent } from 'src/app/modal/screen-giftmoney-pay/screen-giftmoney-pay.component';
import { StoreComponent } from 'src/app/modal/store/store.component';
@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  images = 'assets/icon/profile-none.jpg';

  id: any;
  me: any;
  info: any;
  is_auth: boolean = false;
  giftMoney: number = 0;

  constructor(
    public auth: AuthenticationService,
    public alert: AlertController,
    public modal: ModalController,
    public action: ActionSheetController,
    public activatedRoute: ActivatedRoute,
    public alertS: AlertService,
    public screenS: ScreenService,
    public nav: NavController,
    public profileS: ProfileService,
    public verifyS: VerifyService,
    public commonS: CommonService
  ) { 

    // this.verify();

    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.getMe().then(me => {
      this.me = me;
      this.getView();
    });

    
  }

  ngOnInit() {
    this.auth.fbScreen('screen_view');
  }

  verify() {
    this.verifyS.verify().then(() => {
    }).catch((flag = false) => {
      if (!flag) this.navScreen();
    });
  }

  // 스크린 상세보기
  getView() {
    this.screenS.getView(this.id).then(data => {
      this.info = data;
      this.info.giftMoney = 0;
      if (this.info.message) this.info.message = this.info.message.split(',');
      if (this.info.poster_id == this.me.id) {
        this.is_auth = true;
      }
    }).catch(() => {});
  }

  // 기프트머니 증가
  plus() {
    this.giftMoney += 10000;
    this.info.giftMoney = this.giftMoney;
  }

  // 기프트머니 감소
  minus() {
    if (this.giftMoney > 0) {
      this.giftMoney -= 10000;
      this.info.giftMoney = this.giftMoney;
    }
  }

  imgError(event: any) {
    event.target.src = this.images;
  }

  // 프로필 보기
  profile(target: any) {
    if (target.poster_id == this.me.id) return;

    let obj: any = {
      id: this.me.id,
      target: target.poster_id
    }
    this.profileS.profileOpen(obj).then(() => {});
  }

  // 상점 정보보기
  store() {
    this.commonS.commonModal(
      { 
        data: {
          title: this.info.golf_store_name,
          address: this.info.address,
          phone: this.info.store_phone,
          lat: this.info.latitude,
          lng: this.info.longitude
        }
      }, StoreComponent);
  }

  // 스크린 리스트 이동 후 갱신
  navScreen() {
    let navigationExtras: NavigationExtras = {
      state: {
        type: true
      }
    }
    this.nav.navigateRoot(['screen'], navigationExtras);
  }

  helpAlert() {
    let title: string = '';
    let msg: string = '';
    if (this.info.gender == 'male') {
      title = '기프트머니 선물';
      msg = '<p>매칭된 친구에게<br />선물하는 금액이며<br />기프트머니를 충전해야 합니다.</p>';
    } else {
      title = '기프트머니 희망';
      msg = '<p>매칭된 친구에게<br />선물받기를 희망하는 머니이며<br />받고싶은 기프트머니 금액을<br />설정할 수 있습니다.</p>';
    }
    this.alertS.alert(title, msg);
  }

  requestCheck() {
    this.verifyS.verify().then(() => {
      this.request();
    }).catch(() => {});
  }
  
  // 더보기 메뉴
  async more() {

    let btns = [
      {
        text: '수정하기',
        handler: () => {
          this.modifyModal();
        }
      }, {
        text: '종료하기(번개등록은 1일 2회 가능)',
        handler: () => {
          this.closed();
        }
      }
    ];

    let golf_time = new Date(this.info.golf_time);

    if (this.info.rsvp_list.length || golf_time < new Date()) {
      btns.shift();
    }

    const actionSheet = await this.action.create({
      buttons: btns
    });
    await actionSheet.present();
  }

  // 신청자 더보기 메뉴
  async rsvp_more(rsvp: any) {
    let btns = [
      {
        text: '신청취소',
        handler: () => {
          this.canceled(rsvp);
        }
      }, {
        text: '재신청(1회)',
        handler: () => {
          this.request(rsvp.id);
        }
      }
    ];

    if (rsvp.deleted_at) {
      btns.shift();
    } else {
      btns.pop()
    }

    const actionSheet = await this.action.create({
      buttons: btns
    });
    await actionSheet.present();
  }

  // 신청하기 modal
  async request(id: any = '') {

    if (this.info.gender == 'female') {
      if (this.me.money < this.info.game_fee) {
        this.payConfirmModal();
        return;
      }
    }

    let modal = await this.modal.create({
      component: ScreenRequestComponent,
      componentProps: {
        type: 'request',
        data: this.info
      },
      cssClass: 'auto-height'
    });
    modal.onWillDismiss().then(detail => {
      if (detail.data) {
        if (id) {
          // 재신청
          this.screenS.putRsvp({
            id: id
          }).then(() => {
            this.commonS.toastMsg('<div>재신청되었습니다.</div>', 'top', 2000, undefined, 'ion-margin-top ion-text-center');
            this.navScreen();
          }).catch(() => {});
        } else {
          // 신청 저장
          this.screenS.setRsvp({
            screen_id: this.info.id,
            poster: this.me.username,
            poster_id: this.me.id,
            message: '',
            money: this.info.giftMoney
          }).then(() => {
            this.commonS.toastMsg('<div>신청되었습니다.</div>', 'top', 2000, undefined, 'ion-margin-top ion-text-center');
            this.navScreen();
          }).catch(() => {});
        }
      }
    });
		await modal.present();
  }

  // 신청 취소하기 modal
  async canceled(rsvp: any) {
    this.info.giftMoney = rsvp.money;

    let modal = await this.modal.create({
      component: ScreenRequestComponent,
      componentProps: {
        type: 'canceled',
        data: this.info
      },
      cssClass: 'global-modal-screen height360'
    });
    modal.onWillDismiss().then(detail => {
      if (detail.data) {
        // 신청 취소
        this.screenS.deleteRsvp(
          {
            id: rsvp.id
          }
        ).then(() => {
          this.navScreen();
        }).catch(() => {});
      }
    });
		await modal.present();
  }

  // 매칭하기 modal
  async matching(rsvp: any) {
    let modal = await this.modal.create({
      component: ScreenMatchingComponent,
      componentProps: {
        type: 'matching',
        data: rsvp
      },
      cssClass: 'auto-height'
    });
    modal.onWillDismiss().then(detail => {
      if (detail.data) {
        // 매칭자 선택
        this.screenS.setMatching(
          { 
            id: rsvp.id 
          }
        ).then(() => {
           this.invitation(rsvp);
           this.getView();
        }).catch(() => {});
      }
    });
		await modal.present();
  }

  // 매칭완료 후 초대장 modal
  async invitation(rsvp: any) {
    let modal = await this.modal.create({
      component: InvitationComponent,
      componentProps: {
        type: 'matchingInfo',
        poster: {
          profile_image: this.info.thumbnail_image,
          username: this.info.poster,
          gender: this.info.gender
        },
        data: this.info,
        rsvp
      }
    });
    modal.onDidDismiss().then(detail => {
      if (detail.data) {
        this.revoke(rsvp);
      }
    });
		await modal.present();
  }

  // 매칭 취소하기 modal
  async revoke(rsvp: any) {
    this.info.giftMoney = rsvp.money;

    let modal = await this.modal.create({
      component: ScreenRequestComponent,
      componentProps: {
        type: 'revoke',
        me: this.me,
        data: this.info,
        rsvp
      },
      cssClass: 'global-modal-screen height360'
    });
    modal.onWillDismiss().then(detail => {
      if (detail.data) {
        // 신청 취소
        this.screenS.deleteRevokeRsvp(
          {
            id: rsvp.id
          }
        ).then(() => {
          this.navScreen();
        }).catch(() => {});
      }
    });
		await modal.present();
  }

  // 초대종료 modal
  async closed() {
    let modal = await this.modal.create({
      component: ScreenCloseComponent,
      componentProps: {
      },
      cssClass: 'global-modal-screen height200'
    });
    modal.onDidDismiss().then(detail => {
      if (detail.data) {
        this.screenS.deleteScreen(
          this.info.id
        ).then(() => {
          this.navScreen();
        }).catch(() => {});
      }
    });
		await modal.present();
  }

  // 기프트충전 확인 modal
  async payConfirmModal() {
    let modal = await this.modal.create({
      component: ScreenGiftmoneyPayComponent,
      componentProps: {
        type: 'ask',
        data: this.info,
        me: this.me
      },
      cssClass: 'auto-height'
    });
    modal.onWillDismiss().then(detail => {
      if (detail.data) {
        this.payMoneyModal();
      }
    });
    await modal.present();
  }
  // 기프트충전 modal
  async payMoneyModal() {
    let modal = await this.modal.create({
      component: PaymentMoneyComponent,
      componentProps: {
        giftmoney: this.info.game_fee
      }
    });
    modal.onWillDismiss().then(detail => {
      if (detail.data) {
        this.auth.getMe().then(me => {
          this.me = me;
        }); 
      }
    });
    await modal.present();
  }

  // 수정하기 Modal
  async modifyModal() {
    let modal = await this.modal.create({
      component: PostComponent,
      componentProps: {
        id: this.info.id
      }
    });
    modal.onWillDismiss().then(detail => {
      if (detail.data) {
        this.getView();
      }
    });
		await modal.present();
  }

}
