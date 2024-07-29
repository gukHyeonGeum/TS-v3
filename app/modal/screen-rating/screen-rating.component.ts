import { Component, forwardRef, HostBinding, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/service/authentication.service';

import { InvitationComponent } from 'src/app/pages/screen/invitation/invitation.component';
import { AlertService } from 'src/app/service/alert.service';
import { ScreenService } from 'src/app/service/screen.service';

@Component({
  selector: 'app-screen-rating',
  templateUrl: './screen-rating.component.html',
  styleUrls: ['./screen-rating.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScreenRatingComponent),
      multi: true
    }
  ]
})
export class ScreenRatingComponent implements OnInit {
  @Input() disabled = false;
  @Input() screen: any;
  @HostBinding('style.opacity')

  me: any;
  is_poster: boolean = false;
  btnTitle: string = '기프트머니 받기';
  user: any = {
    thumb: '',
    username: '',
    gender: '',
    dob: '',
    geo_location: ''
  };
  
  images = 'assets/icon/profile-none.jpg';
  ratingTitle: any = ['매너', '실력', '외모'];
  stars: any[] = Array(3).fill(null).map(() => Array(5).fill(false));
  value: any[] = Array(3).fill(0);
  
  constructor(
    public auth: AuthenticationService,
    public _modal: ModalController,
    public alertS: AlertService,
    public screenS: ScreenService
  ) { 
  }

  ngOnInit() {
    this.auth.fbScreen('screengolf_rating');

    this.auth.getMe().then(me => {
      this.me = me;
      if (this.screen.message) this.screen.message = this.screen.message.split(',');
      if (this.me.id == this.screen.poster_id) {
        this.is_poster = true;

        this.user = {
          thumb: this.screen.partner_thumb,
          username: this.screen.partner,
          gender: this.screen.partner_gender,
          dob: this.screen.partner_dob,
          geo_location: this.screen.partner_geo_location
        }
      } else {
        this.user = {
          thumb: this.screen.poster_thumb,
          username: this.screen.poster,
          gender: this.screen.poster_gender,
          dob: this.screen.poster_dob,
          geo_location: this.screen.poster_geo_location
        }
      }

      if (this.screen.poster_gender == 'male') {
        this.btnTitle = '평가완료';
      }

      console.log(this.is_poster);
    });
    console.log(this.stars);
    console.log(this.value);
    console.log(this.screen);

  }

  get opacity() {
    return this.disabled ? 0.25 : 1;
  }

  rate(rating: number, index: any) {
    console.log('rating: ', rating);
    if (!this.disabled) {
      this.writeValue(rating, index);
    }
  }

  onChange = (rating: number) => {};
  onTouched = () => {};

  writeValue(rating: number, index: any): void {
    this.stars[index] = this.stars[index].map((_, i) => rating > i);
    this.value[index] = this.stars[index].reduce((total, starred) => total + (starred ? 1:0));
    console.log(this.stars);
    console.log('value: ', this.value);
    this.onChange(this.value[index]);
  }

  registerOnChange(fn: (rating: number) => void): void {
    console.log('registerOnChange');
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  submit() {
    console.log(this.value);
    let empty = true;
    this.value.forEach(val => {
      if (val === 0) {
        empty = false;
      }
    });

    if (!empty) {
      this.alertS.alert('알림', '별점은 1개 이상씩 선택해야합니다.');
      return;
    }

    let obj = {
      user_id: this.me.id,
      target_id: this.is_poster ? this.screen.partner_id : this.screen.poster_id,
      category: 'screen',
      category_id: this.screen.id,
      manner: this.value[0],
      skill: this.value[1],
      look: this.value[2]
    }

    this.screenS.setRating(obj).then(res => {
      if (res) {
        this.close(true);
      }
    }).catch(() => {});
    
  }

  close(flag: boolean = false) {
    this._modal.dismiss(flag);
  }

  // 매칭완료 후 초대장 modal
  async invitation(rsvp: any = []) {
    let modal = await this._modal.create({
      component: InvitationComponent,
      componentProps: {
        type: 'matchingInfoRating',
        poster: {
          profile_image: this.screen.poster_thumb,
          username: this.screen.poster,
          gender: this.screen.poster_gender
        },
        data: this.screen,
        rsvp: {
          thumbnail_image: this.screen.partner_thumb,
          poster: this.screen.partner,
          poster_id: this.screen.partner_id
        }
      }
    });
    modal.onDidDismiss().then(detail => {
      if (detail.data) {
      }
    });
		await modal.present();
  }

}
