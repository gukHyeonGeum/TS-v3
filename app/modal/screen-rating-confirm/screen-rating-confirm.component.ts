import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-screen-rating-confirm',
  templateUrl: './screen-rating-confirm.component.html',
  styleUrls: ['./screen-rating-confirm.component.scss'],
})
export class ScreenRatingConfirmComponent implements OnInit {
  @Input() screen: any;
  
  me: any;
  user: any = {
    thumb: '',
    username: '',
    gender: '',
    dob: '',
    geo_location: ''
  }
  is_poster: boolean;

  images = 'assets/icon/profile-none.jpg';

  constructor(
    public auth: AuthenticationService,
    private _modal: ModalController
  ) { 
  }

  ngOnInit() {

    this.auth.getMe().then(me => {
      this.me = me;
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
    });

    console.log(this.screen);
  }

  confirm(answer: string) {
    this._modal.dismiss(answer);
  }

}
