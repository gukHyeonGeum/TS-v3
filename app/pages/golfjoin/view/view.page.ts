import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GolfjoinService } from 'src/app/service/golfjoin.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { AlertController, PopoverController, NavController } from '@ionic/angular';

import { PopMoreJoinComponent } from './pop-more-join/pop-more-join.component';
import { ProfileService } from 'src/app/service/profile.service';
import { VerifyService } from 'src/app/service/verify.service';
import { AlertService } from 'src/app/service/alert.service';

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
    public activatedRoute: ActivatedRoute,
    public golfjoinS: GolfjoinService,
    public auth: AuthenticationService,
    public alertController: AlertController,
    public dc: ChangeDetectorRef,
    public popover: PopoverController,
    public profileS: ProfileService,
    public verifyS: VerifyService,
    public alertS: AlertService,
    public nav: NavController
  ) { 
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.getMe().then(me => {
      this.me = me;
      if (this.me.level == 10) {
        this.is_admin = true;
      }
    });

    this.getView();
  }

  ngOnInit() {
    this.auth.fbScreen('golfjoin_view');
  }

  getView() {
    this.golfjoinS.getView(this.id)
      .subscribe(res => {
        if (res.success) {
          this.info = res.data;
          this.info.statuschk = false;

          if (this.me?.id == this.info.poster_id) {
            this.is_auth = true;
          }
        }
      });
  }

  ngAfterContentChecked(): void {
    this.dc.detectChanges();
  }

  imgSrc(user: any, type: string = '') {
    let str: any = this.images;

    if (user.status == 1 && !user.deleted_at && user.poster_id == this.me?.id) {
      this.info.statuschk = true;
    }

    str = this.imgChange(user.thumbnail_image);

    return str;
  }

  imgError(event: any) {
    event.target.src = this.images;
  }

  imgChange(img: any) {
    return img.replace('/images/avatars/avatar-unknown.jpg', this.images);
  }

  profile(target: any) {
    if (target == this.me.id) return;

    let obj: any = {
      id: this.me.id,
      target
    }
    this.profileS.profileOpen(obj).then(modal => {
    });
  }

  // 신청
  reservation(people: any) {
    this.golfjoinS.setReservation(
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

  // 초청 마감
  async finish() {
    const alert = await this.alertController.create({
      header: '조인 종료',
      message: `
      <p>
        종료하면 더 이상 신청접수가 되지 않습니다.<br><br>
        매칭이 확정 된 경우 종료하시면 신청이 마감됩니다.<br><br>
        종료 처리 하시겠습니까?
      </p>`,
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: '종료',
          handler: () => {
            this.golfjoinS.putFinish(this.info).then(resolve => {
              if (resolve) {
                this.nav.navigateRoot('/active-golfjoin/invite');
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
      header: '조인 확정',
      message: '<p>'+ rsvp.poster +'님을</p><p>멤버로 확정하시겠습니까?</p>',
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
            this.golfjoinS.putConfirm(
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
      header: '멤버 취소',
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
            this.golfjoinS.putCanceled(
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

  // 신청인원 선택
  async alertRequest() {
    const alert = await this.alertController.create({
      header: '조인 신청',
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
        },
        {
          name: 'reqPeople',
          type: 'radio',
          label: '부부&커플',
          value: '3'
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
              this.alertS.alert('인원 선택','신청인원을 선택하세요').then(alert => {
                alert.onDidDismiss().then(() => {
                  this.alertRequest();
                });
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async popoverMore(ev: any, me: any, info: any, rsvp: any) {
    const popover = await this.popover.create({
      component: PopMoreJoinComponent,
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

}
