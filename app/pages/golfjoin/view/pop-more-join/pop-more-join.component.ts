import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, PopoverController, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/service/user.service';
import { GolfjoinService } from 'src/app/service/golfjoin.service';

@Component({
  selector: 'app-pop-more-join',
  templateUrl: './pop-more-join.component.html',
  styleUrls: ['./pop-more-join.component.scss'],
})
export class PopMoreJoinComponent implements OnInit {

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
    public golfjoinS: GolfjoinService
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
