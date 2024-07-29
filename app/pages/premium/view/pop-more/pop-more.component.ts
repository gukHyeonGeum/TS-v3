import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, PopoverController, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/service/user.service';
import { PremiumService } from 'src/app/service/premium.service';
import { AlertService } from 'src/app/service/alert.service';
import { VerifyService } from 'src/app/service/verify.service';

@Component({
  selector: 'app-pop-more',
  templateUrl: './pop-more.component.html',
  styleUrls: ['./pop-more.component.scss'],
})
export class PopMoreComponent implements OnInit {

  me: any;
  info: any;
  rsvp: any;
  phone: any;
  is_admin: any;
  is_auth: any;

  constructor(
    public navParams: NavParams,
    public userS: UserService,
    public nav: NavController,
    public popover: PopoverController,
    public alertController: AlertController,
    public premiumS: PremiumService,
    public alertS: AlertService,
    public verifyS: VerifyService
  ) { 

    this.me = this.navParams.data.me;
  	this.info = this.navParams.data.info;
    this.rsvp = this.navParams.data.rsvp;
    this.is_admin = this.navParams.data.admin;
    this.is_auth = this.navParams.data.auth;

  }

  ngOnInit() {}

  message() {
    this.popover.dismiss();
    this.verifyS.isPremiumExpire().then(() => {
      let id = '';
      if (this.me.id == this.info.poster_id) {
        id = this.rsvp.poster_id;
      } else {
        id = this.info.poster_id;
      }
      this.userS.setCreateThreadNext({ id }).then(resolve => {
        if (resolve) {
          this.nav.navigateForward(['message/room/' + resolve]);
        }
      });
    }).catch(() => {});
  }

  partnerSelect(rsvp: any) {
    this.verifyS.isPremiumExpire(null, true).then(resolve => {
      if (resolve == 'popover') {
        this.popover.dismiss();
      } else {
        this.confirm(rsvp);
      }
    }).catch(() => {});
  }

    // 멤버 선택
    async confirm(rsvp: any) {
      const alert = await this.alertController.create({
        header: '멤버 선택',
        message: '<p>선택하신 회원을<br />멤버로 확정하시겠습니까?</p>',
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
                    this.popover.dismiss(true);
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
                    this.popover.dismiss(true);
                  }
                });
            }
          }
        ]
      });
  
      await alert.present();
    }

}
