import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { PremiumService } from 'src/app/service/premium.service';
import { NavParams, ModalController } from '@ionic/angular';
import { ClubService } from 'src/app/service/club.service';
import { CommonService } from 'src/app/service/common.service';

import { SearchClubComponent } from '../../../modal/search-club/search-club.component';

@Component({
  selector: 'app-post-modify',
  templateUrl: './post-modify.component.html',
  styleUrls: ['./post-modify.component.scss'],
})
export class PostModifyComponent implements OnInit {

  me: any;
  id: any;
  info: any;
  whichPage: any;
  form: any = [];
  clubLists: any;
  premiumForm: FormGroup;

  nowYear = new Date();
  nextDay = new Date().setDate(new Date().getDate() + 1);

  constructor(
    public formBuilder: FormBuilder,
    public auth: AuthenticationService,
    public premiumS: PremiumService,
    public navParams: NavParams,
    public _modal: ModalController,
    public clubS: ClubService,
    public commonS: CommonService
  ) { 
    this.id = this.navParams.get('id');

    this.premiumS.getPostView(this.id).subscribe(res => {
      this.info = res.data;

      this.whichPage = this.info.golf_type;
      
      

      if (this.info.golf_type==3) {
        let code = this.info.golf_club_code.substring(0,2);
        this.clubType({ detail: { value: code }}).then(resolve => {
          if (resolve) {
            this.form.club_name = this.info.golf_club_id;
          }
        });
        this.premiumForm.controls['club_region'].setValue(parseInt(code));
        
      } else {
        this.premiumForm.controls['club_region'].setValue(this.info.golf_club_code);

          this.form.club_name = this.info.golf_club_name;
      }

      this.premiumForm.controls['golfType'].setValue(this.info.golf_type);
      this.premiumForm.controls['club_name'].setValue(this.info.golf_club_id);
      this.premiumForm.controls['bookingDate'].setValue(this.info.golf_time);
      this.premiumForm.controls['nextDate'].setValue(this.info.golf_next_time);
      this.premiumForm.controls['bookingDateTime'].setValue(this.info.golf_time);
      this.premiumForm.controls['sponsor'].setValue(this.info.golf_sponsor);
      this.premiumForm.controls['gender'].setValue(this.info.filter_sex);
      this.premiumForm.controls['age'].setValue({ lower: this.info.filter_s_age, upper: this.info.filter_e_age });
      this.premiumForm.controls['partners'].setValue(this.info.golf_partner);
      this.premiumForm.controls['option'].setValue(this.info.golf_option);
      this.premiumForm.controls['partnerType'].setValue(this.info.golf_partner_type);
      this.premiumForm.controls['message'].setValue(this.info.message);

    });

    this.auth.getMe().then(me => {
      this.me = me;
    });   

    this.premiumForm = this.formBuilder.group({
      golfType: [ '', Validators.required ],
      club_region: [ '', Validators.required ],
      club_name: [ '', Validators.required ],
      bookingDate: [ '', Validators.required ],
      nextDate: [ '' ],
      bookingDateTime: [ '' ],
      sponsor: [ '' ],
      gender: [ '' ],
      age: [ '' ],
      partners: [ '' ],
      option: [ '' ],
      partnerType: [ '' ],
      message: [ '' ]
    });
  }

  ngOnInit() {
    this.auth.fbScreen('premium_post_modify');
  }

  segmentChanged(e: any) {
    let golfType: string = e.detail.value;
    this.whichPage = golfType;
    this.premiumForm.controls['golfType'].setValue(golfType);

    if (golfType === '3') {
      this.premiumForm.controls['sponsor'].setValue('1');
    } else {
      this.premiumForm.controls['sponsor'].setValue(this.info.golf_sponsor);
    }
  }

  segmentButtonClicked(e: any) {
    this.premiumForm.controls['gender'].setValue(e.detail.value);
  }
  
  clubType(e: any): Promise<any> {
    return new Promise(resolve => {
      this.clubS.getClubTypeLists(e.detail.value).then(data => {
        if (data) {
          this.clubLists = data;
          resolve(true);
        }
      });
    });
  }

  modify() {

    let obj: any = {
      id: this.id,
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
      screen_name: ''
    };

    let date = new Date(this.premiumForm.value['bookingDate']);
    let time = new Date(this.premiumForm.value['bookingDateTime']);

    obj.date = date.getFullYear() + '/' + this.commonS.pad(date.getMonth()+1,2) + '/' + this.commonS.pad(date.getDate(),2);
    obj.hour = this.commonS.pad(time.getHours(),2);
    obj.minute = this.commonS.pad(time.getMinutes(),2);

    if (this.premiumForm.value['golfType'] == 4) {
      obj.screen_area = this.premiumForm.value['club_region'];
      obj.screen_name = this.premiumForm.value['club_name'];
    }

    if (this.premiumForm.value['golfType'] == 2 || this.premiumForm.value['golfType'] == 3) {
      let nextDate = new Date(this.premiumForm.value['nextDate']);
      obj.golf_next_time = nextDate.getFullYear() + '/' + this.commonS.pad(nextDate.getMonth()+1,2) + '/' + this.commonS.pad(nextDate.getDate(),2);
    }
    
    this.premiumS.putCreate(
        obj
      ).then(resolve => {
        if (resolve) {
          this._modal.dismiss(true);
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

  close() {
    this._modal.dismiss();
  }

}
