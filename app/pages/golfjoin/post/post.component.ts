import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/service/authentication.service';

import { SearchClubComponent } from '../../../modal/search-club/search-club.component';
import { CommonService } from 'src/app/service/common.service';
import { GolfjoinService } from 'src/app/service/golfjoin.service';
import { VerifyService } from 'src/app/service/verify.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {

  whichPage: any = '4';
  form: any = [];
  clubLists: any;
  golfjoinForm: FormGroup;
  me: any;

  nowYear = new Date();
  nextDay = new Date().setDate(new Date().getDate() + 1);

  constructor(
    public _modal: ModalController,
    public auth: AuthenticationService,
    public formBuilder: FormBuilder,
    public commonS: CommonService,
    public golfjoinS: GolfjoinService,
    public verifyS: VerifyService
  ) { 

    this.auth.getMe().then(me => {
      this.me = me;
    });   

    this.golfjoinForm = this.formBuilder.group({
      club_region: [ '', Validators.required ],
      club_name: [ '', Validators.required ],
      bookingDate: [ '', Validators.required ],
      bookingDateTime: [ '', Validators.required ],
      companion: [ '', Validators.required ],
      partners: [ '', Validators.required ],
      green_fee: [ '', Validators.required ],
      bookingPeople: [ '4', Validators.required ],
      option: [ '' ],
      message: [ '' ]
    });

  }

  ngOnInit() {
    this.auth.fbScreen('golfjoin_post');
  }

  bookingPeople(e: any) {
    this.golfjoinForm.controls['bookingPeople'].setValue(e.detail.value);
  }

  searchGolf() {
    this.commonS.commonModal({}, SearchClubComponent)
      .then(modal => {
        modal.onDidDismiss().then(detail => {
          if (detail.data) {
            const data: any = detail.data;
            this.golfjoinForm.controls['club_region'].setValue(data.club_region);
            this.golfjoinForm.controls['club_name'].setValue(data.id);
            this.form.club_name = data.name;
          }
        });
      });
  }

  create() {
    let obj: any = {
      golf_invite_type: 0,
      club_name: this.golfjoinForm.value['club_name'], 
      partners: this.golfjoinForm.value['partners'], 
      golf_companion: this.golfjoinForm.value['companion'], 
      green_fee: this.golfjoinForm.value['green_fee'], 
      booking_people: this.golfjoinForm.value['bookingPeople'], 
      message: this.golfjoinForm.value['message'],
      filter_sex: 0, 
      filter_s_age: 0, 
      filter_e_age: 0, 
      cart_fee: 0, 
      caddie_fee: 0,
      booking_id: 0
    };

    let date = new Date(this.golfjoinForm.value['bookingDate']);
    let time = new Date(this.golfjoinForm.value['bookingDateTime']);

    let optionSum: any = 0;
    if (this.golfjoinForm.value['option'].length) {
      optionSum = this.golfjoinForm.value['option'].reduce((a:any,b:any) => parseInt(a)+parseInt(b));
    }

    obj.booking_option = parseInt(optionSum);
    obj.date = date.getFullYear() + '/' + this.commonS.pad(date.getMonth()+1,2) + '/' + this.commonS.pad(date.getDate(),2);
    obj.hour = this.commonS.pad(time.getHours(),2) + ':' + this.commonS.pad(time.getMinutes(),2);

    this.verifyS.isCertPhone().then(() => {
      this.verifyS.isProfile(true).then(resolve => {
        if (resolve == 'modal') {
          this.close();
        } else {
          this.golfjoinS.setCreate(obj).then(resolve => {
            if (resolve) {
              this._modal.dismiss(true);
            }
          });
        }
      }).catch(() => {});
    }).catch(() => {});

    
  }


  close() {
    this._modal.dismiss();
  }

}
