import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavController, NavParams } from '@ionic/angular';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { LoadingService } from 'src/app/service/loading.service';
import { ProfileService } from 'src/app/service/profile.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
})
export class InvitationComponent implements OnInit {
  @Input() type: string = '';
  @Input() poster: any;
  @Input() data: any;
  @Input() rsvp: any;

  me: any;
  params: any;
  images = 'assets/icon/profile-none.jpg';
  stars: any = [];

  constructor(
    private _modal: ModalController,
    private navParam: NavParams,
    private nav: NavController,
    private action: ActionSheetController,
    public auth: AuthenticationService,
    public loadingS: LoadingService,
    public userS: UserService,
    public profileS: ProfileService
  ) { 

    this.params = this.navParam.get('type');

    this.auth.getMe().then(me => {
      this.me = me;
    });
  }

  ngOnInit() {
    if (this.data.rating) {
      const arrRating = this.data.rating.split(',');
      const score = arrRating.reduce((sum: any = 0, v: any) => {
        return parseInt(sum) + parseInt(v);
      });
      let rating = Math.floor(score / arrRating.length);
      for (let index = 0; index < 5; index++) {
        if (rating > index) {
          this.stars.push(1);
        } else {
          this.stars.push(0);
        }
      }
    }

    this.auth.fbScreen('screen_invitation');
  }

  message() {
    let message_id: any;
    
    if (this.me.id == this.data.poster_id) {
      message_id = this.rsvp.poster_id;
    } else {
      message_id = this.data.poster_id;
    }
    this.userS.setCreateThreadNext({ id: message_id }).then(thread_id => {
      if (thread_id) {
        this.nav.navigateForward(['message/room/' + thread_id]);
        this.close();
      }
    });
  }

  send() {
    this.loadingS.show(2000);
    this.close(true);
  }

  imgError(event: any) {
    event.target.src = this.images;
  }

  profile(target: any) {
    if (target.poster_id == this.me.id) return;

    let obj: any = {
      id: this.me.id,
      target: target.poster_id
    }
    this.profileS.profileOpen(obj).then(() => {});
  }
  
  close(flag: boolean = false) {
    this._modal.dismiss(flag);
  }

  // 더보기 메뉴
  async more() {
    const actionSheet = await this.action.create({
      buttons: [
       {
          text: '매칭 취소하기',
          handler: () => {
            this.close(true);
          }
        }
      ]
    });
    await actionSheet.present();
  }
}
