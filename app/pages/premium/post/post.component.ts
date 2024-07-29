import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthenticationService } from 'src/app/service/authentication.service';
import { CommonService } from 'src/app/service/common.service';
import { ClubService } from 'src/app/service/club.service';
import { PremiumService } from 'src/app/service/premium.service';

import { SearchClubComponent } from '../../../modal/search-club/search-club.component';
import { PreviewComponent } from './preview/preview.component';
import { AlertService } from 'src/app/service/alert.service';
import { VerifyService } from 'src/app/service/verify.service';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {

  whichPage: any = '1';
  form: any = [];
  clubLists: any;
  premiumForm: FormGroup;
  me: any;
  helpPopover: any = '';

  nowYear = new Date();
  nextDay = new Date().setDate(new Date().getDate() + 1);

  constructor(
    public _modal: ModalController,
    public formBuilder: FormBuilder,
    public commonS: CommonService,
    public clubS: ClubService,
    public premiumS: PremiumService,
    public auth: AuthenticationService,
    public alertS: AlertService,
    public verifyS: VerifyService
  ) { 

    this.auth.getMe().then(me => {
      this.me = me;
    });   

    this.premiumForm = this.formBuilder.group({
      golfType: [ this.whichPage, Validators.required ],
      club_region: [ '', Validators.required ],
      club_name: [ '', Validators.required ],
      bookingDate: [ '', Validators.required ],
      nextDate: [ '' ],
      bookingDateTime: [ '' ],
      sponsor: [ '', Validators.required ],
      gender: [ '', Validators.required ],
      age: [ {lower: 35, upper: 49} ],
      partners: [ '', Validators.required ],
      option: [ '', Validators.required ],
      partnerType: [ '' ],
      message: [ '' ]
    });
  }

  ngOnInit() {
    this.auth.fbScreen('premium_post');
  }

  segmentChanged(e: any) {
    let golfType: string = e.detail.value;
    this.whichPage = golfType;
    this.premiumForm.controls['golfType'].setValue(golfType);

    if (golfType === '3') {
      this.premiumForm.controls['sponsor'].setValue('1');
    }
  }

  segmentButtonClicked(e: any) {
    this.premiumForm.controls['gender'].setValue(e.detail.value);
  }

  onClick() {
    
  }

  clubType(e: any) {
    this.clubS.getClubTypeLists(e.detail.value).then(data => {
      if (data) {
        this.clubLists = data;
      }
    });
  }

  searchGolf() {
    this.commonS.commonModal({}, SearchClubComponent)
      .then(modal => {
        modal.onDidDismiss().then(detail => {
          if (detail.data) {
            const data: any = detail.data;
            this.premiumForm.controls['club_region'].setValue(data.club_region);
            this.premiumForm.controls['club_name'].setValue(data.id);
            this.form.club_name = data.name;
          }
        });
      });
  }

  data(): Promise<any> {
    return new Promise((resolve, reject) => {
    
      let obj: any = {
        golf_type: this.premiumForm.value['golfType'],
        golf_invite_type: 1,
        club_region: this.premiumForm.value['club_region'], 
        club_name: this.premiumForm.value['club_name'], 
        partners: this.premiumForm.value['partners'], 
        companion: 1, 
        filter_sex: this.premiumForm.value['gender'], 
        filter_s_age: this.premiumForm.value['age']['lower'], 
        filter_e_age: this.premiumForm.value['age']['upper'], 
        green_fee: 0, 
        cart_fee: 0, 
        caddie_fee: 0, 
        user_id: this.me.id,
        sponsor: this.premiumForm.value['sponsor'],
        golf_option: this.premiumForm.value['option'],
        golf_partner_type: this.premiumForm.value['partnerType'],
        message: this.premiumForm.value['message'],
        screen_area: '',
        screen_name: '',
      };

      let date = new Date(this.premiumForm.value['bookingDate']);
      let time = new Date(this.premiumForm.value['bookingDateTime']);

      obj.date = date.getFullYear() + '/' + this.commonS.pad(date.getMonth()+1,2) + '/' + this.commonS.pad(date.getDate(),2);

      if (this.whichPage == 2 || this.whichPage == 3) {
        obj.hour = '00';
        obj.minute = '00';
      } else {
        obj.hour = this.commonS.pad(time.getHours(),2);
        obj.minute = this.commonS.pad(time.getMinutes(),2);
      }

      if (this.premiumForm.value['golfType'] == 4) {
        obj.screen_area = this.premiumForm.value['club_region'];
        obj.screen_name = this.premiumForm.value['club_name'];
      }

      if (this.premiumForm.value['golfType'] == 2 || this.premiumForm.value['golfType'] == 3) {
        let nextDate = new Date(this.premiumForm.value['nextDate']);
        obj.golf_next_time = nextDate.getFullYear() + '/' + this.commonS.pad(nextDate.getMonth()+1,2) + '/' + this.commonS.pad(nextDate.getDate(),2);

        if (new Date(obj.date) > new Date(obj.golf_next_time)) {
          this.alertS.alert('알림', '종료 날짜가 잘 못 되었습니다.');
          reject();
        }

      }

      // return obj;
      resolve(obj);

    });
  }

  create() {
    this.data().then(res => {

      let obj: any = res;

      this.verifyS.isCertPhone().then(() => {
        this.verifyS.isProfile(true).then(resolve => {
          if (resolve == 'modal') {
            this._modal.dismiss();
          } else {
            this.premiumS.setCreate(obj).then(resolve => {
              if (resolve) {
                this._modal.dismiss(true);
              }
            });
          }
        }).catch(() => {});
      }).catch(() => {});

    }).catch(e => {});

  }

  premiumHelp(type: String) {
    this.alertS.alertHelp(type);
  }

  async view() {
    this.data().then(async res => {
    
      let obj: any = res;

      obj.club_name_text = this.form.club_name;
      obj.username = this.me.username;

      let modal = await this._modal.create({
        component: PreviewComponent,
        componentProps: { data: obj },
        cssClass: 'modal-popup'
      });
      modal.onDidDismiss().then(detail => {
        if (detail.data) {
        }
      });
      await modal.present();

    }).catch(e => {});
  }

  close() {
    this._modal.dismiss();
  }

}
