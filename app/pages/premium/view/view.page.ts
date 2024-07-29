import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PopoverController, ModalController, AlertController, NavController } from '@ionic/angular';

import { PopMoreComponent } from './pop-more/pop-more.component';
import { PostModifyComponent } from '../post-modify/post-modify.component'

import { PremiumService } from 'src/app/service/premium.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ProfileService } from 'src/app/service/profile.service';
import { VerifyService } from 'src/app/service/verify.service';
import { AlertService } from 'src/app/service/alert.service';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  is_admin: boolean = false;
  is_auth: boolean = false;
  me: any;
  info: any;
  id: any;
  images = 'assets/icon/profile-none.jpg';
  
  constructor(
    public popover: PopoverController,
    public activatedRoute: ActivatedRoute,
    public premiumS: PremiumService,
    public auth: AuthenticationService,
    public dc: ChangeDetectorRef,
    public modal: ModalController,
    public alertController: AlertController,
    public profileS: ProfileService,
    public alertS: AlertService,
    public verifyS: VerifyService,
    public userS: UserService,
    public nav: NavController
  ) { 
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.userS.getMeInfo().then(me => {
      this.me = me;
      if (this.me.level == 10) {
        this.is_admin = true;
      }
    });

    this.getView();
  }

  ngOnInit() {
    this.auth.fbScreen('premium_view');
  }

  getView() {
    this.premiumS.getView(this.id)
      .subscribe(res => {
        if (res.success) {
          this.info = res.data;
          this.info.statuschk = false;

          if (this.me) {
            if (this.me.id == this.info.poster_id) {
              this.is_auth = true;
            }
          }
          
          let showRsvp: number = 0;
          this.info.rsvp_list.forEach((list: {hidden: any}) => {
            if (list.hidden) {
              showRsvp++;
            }
          });
          this.info.showRsvp = showRsvp;          
        }
      });
  }

  ngAfterContentChecked(): void {
    this.dc.detectChanges();
  }

  imgSrc(user: any, type: string = '') {
    let str: any = this.images;

    if (type == 'invite') {
      if (this.is_admin || this.is_auth || this.info.statuschk) {
        str = this.imgChange(user.thumbnail_image);
      }
    } else {
      if (user.status == 1 && !user.deleted_at && user.poster_id == this.me.id) {
        this.info.statuschk = true;
      }

      if (this.is_admin || ((this.is_auth && !this.me.premium_expire) && !user.deleted_at && !user.users_deleted_at) || user.poster_id == this.me.id) {
        str = this.imgChange(user.thumbnail_image);
      }
    }
    return str;
  }

  imgError(event: any) {
    event.target.src = this.images;
  }

  imgChange(img: any) {
    return img.replace('/images/avatars/avatar-unknown.jpg', this.images);
  }

  authProfile(target: any) {
    let is_open: boolean = false;

    if (this.is_admin || ((this.is_auth && !this.me.premium_expire) && !target.deleted_at && !target.users_deleted_at)) {
      is_open = true;
    } else {
      if (this.is_auth) {
        this.verifyS.isPremiumExpire().then(() => {
          if (!target.deleted_at && !target.users_deleted_at) {
            this.profile(target);
          }
        }).catch(() => {});
      }
    }

    if (is_open) {
      this.profile(target);
    }
    
  }

  profile(target: any) {
    if (target.poster_id == this.me.id) return;

    let obj: any = {
      id: this.me.id,
      target: target.poster_id
    }
    this.profileS.profileOpen(obj).then(() => {});

  }

  // 신청
  reservation(people: any) {
    this.premiumS.setReservation(
        {
          poster: this.me.username, 
          poster_id: this.me.id, 
          field_id: this.info.id,
          gender: '',
          message: '',
          people: people
        }
      ).then(resolve => {
        if (resolve) {
          this.getView();
        }
      });
  }

  help(type: string) {
    this.alertS.alertHelp(type);
  }

  // 초청 마감
  async finish() {
    const alert = await this.alertController.create({
      header: '프리미엄 종료',
      message: '정말로 종료하시겠습니까?',
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
            this.premiumS.putFinish(this.info).then(resolve => {
              if (resolve) {
                this.nav.navigateRoot('/active-premium/invite');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // 멤버 선택
  async confirm(rsvp: any) {
    const alert = await this.alertController.create({
      header: '프리미엄 확정',
      message: '<p>선택하신 회원을 멤버로 확정하시겠습니까?</p>',
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
            this.premiumS.putConfirm(
                {
                  field_id: this.info.id,
                  golf_partner: this.info.golf_partner,
                  invite_count: '',
                  ids: [rsvp.id]
                }
              ).then(resolve => {
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

  // 신청 및 멤버 취소
  async canceled(rsvp: any) {
    const alert = await this.alertController.create({
      header: rsvp.status?'멤버 취소':'신청 취소',
      message: '정말로 취소하시겠습니까?',
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
            this.premiumS.putCanceled(
                {
                  id: rsvp.id
                }
              ).then(resolve => {
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

  async adminCheck(rsvp: any) {
    const alert = await this.alertController.create({
      header: '관리자 확인',
      message: '대기자를 신청자로 등록하시겠습니까?',
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
            this.premiumS.putAdmincheck(
                {
                  id: rsvp.id
                }
              ).then(resolve => {
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

  async alertRequest() {
    const alert = await this.alertController.create({
      header: '프리미엄 신청',
      message: '신청인원 선택',
      inputs: [
        {
          name: 'reqPeople',
          type: 'radio',
          label: '1명 (본인)',
          value: '1'
        },
        {
          name: 'reqPeople',
          type: 'radio',
          label: '2명 (본인+1명)',
          value: '2'
        }
      ],
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: '확인',
          handler: people => {
            if (people) {
              this.verifyS.isCertPhone().then(() => {
                this.verifyS.isProfile().then(() => {
                  this.reservation(people);
                }).catch(() => {});
              }).catch(() => {});
            } else {
              this.alertS.alert('인원선택', '신청인원을 선택하세요.').then(alert => {
                alert.onDidDismiss().then(() => {
                  this.alertRequest();
                });
              })
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async popoverMore(ev: any, me: any, info: any, rsvp: any) {
    const popover = await this.popover.create({
      component: PopMoreComponent,
      componentProps: { me, info, rsvp, admin: this.is_admin, auth: this.is_auth },
      event: ev,
      translucent: true,
      mode: 'ios'
    });
    popover.onWillDismiss().then(detail => {
      if (detail.data) {
        this.getView();
      }
    });
    await popover.present();
  }

  async modify() {
    let modal = await this.modal.create({
      component: PostModifyComponent,
      componentProps: { id: this.info.id }
    });
    modal.onDidDismiss().then(detail => {
      if (detail.data) {
        this.getView();
      }
    });
		await modal.present();
  }

}
