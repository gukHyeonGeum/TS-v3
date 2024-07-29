import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams, IonSlides, NavController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/service/authentication.service';

import { appConfig } from '../../../config';
import { ImageViewService } from 'src/app/service/image-view.service';
import { UserService } from 'src/app/service/user.service';
import { ReportComponent } from '../report/report.component';
import { CommonService } from 'src/app/service/common.service';
import { VerifyService } from 'src/app/service/verify.service';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  
  me: any;
  user: any;
  userId: any;
  target: any;
  profile_img: any;
  slideIndex = 1;
  images = 'assets/icon/profile-none.jpg';

  constructor(
    public auth: AuthenticationService,
    public _modal: ModalController,
    public imageViewS: ImageViewService,
    public navParams: NavParams,
    public userS: UserService,
    public commonS: CommonService,
    public nav: NavController,
    public alertCtrl: AlertController,
    public verifyS: VerifyService,
    public alertS: AlertService
  ) { 
    this.userId = this.navParams.get('id');
    this.target = this.navParams.get('target');

    this.profile_img = { 'height.px': window.innerWidth };

    this.auth.getMe().then(me => {
      this.me = me;

      if (this.me.id == this.target) {
        this.close(true);
        this.nav.navigateRoot('home');
      } else {
        this.auth.fbScreen('another_user_profile');
      }
      if (!this.me.pictures.length) {
        this.close(true);
        this.nav.navigateRoot('profile');
      }
    });

    this.userS.getUser(this.target, 'profile').then(data => {
      this.user = data;
    });
  }

  ngOnInit() {}

  thumb(picture: any) {
    return `${appConfig.teeshotConfig.imageUrl}/${picture.id}/original/${picture.image_file_name}`;
  }

  typical(picture: any) {
    const thumb = `${appConfig.teeshotConfig.imageUrl}/${picture.id}/thumb/${picture.image_file_name}`;
    if (thumb == this.me.profile.thumbnail_image) {
      return true;
    } else {
      return false;
    }
  }

  change() {
    this.slides.getActiveIndex().then(index => {
  		this.slideIndex = index + 1;
  	});
  }

  userReport(user: any, me: any) {
    this.commonS.commonModal({ user, me }, ReportComponent).then(modal => {

    });
  }

  like(flag: number) {
    if (flag == 0) this.auth.fbLog('action_event_like_user');
    
    this.userS.putLike({ flag, id: this.user.id }).then(resolve => {
      if (resolve) {
        this.user.isLike = !flag;
        if (flag) {
          this.user.profile.like_count--;
        } else {
          this.user.profile.like_count++;
        }
      }
    });
  }

  forcedQuit(userId: number) {
    this.alertS.confirm({
      header: '강제탈퇴',
      message: this.user.username + '님을 강제 탈퇴 시키겠습니까?',
      cancelText: '취소',
      okText: '확인'
    }).then(confirm => {
      if (confirm) {
        this.userS.deleteForcedUser(userId).then(resolve => {
          if (resolve) {
            this.userS.getUser(this.target, 'profile').then(data => {
              this.user = data;
            });
          }
        });
      }
    })
  }

  async addFriend() {

    this.alertS.confirm({
      header: '친구신청',
      message: this.user.username + '님께<br />친구 신청을 하시겠습니까?',
      cancelText: '취소',
      okText: '확인'
    }).then(confirm => {
      if (confirm) {
        this.verifyS.isCertPhone().then(() => {
          this.auth.fbLog('action_event_add_friend');
          this.userS.setAddFriend({ id: this.user.id }).then(() => {});
        });
      }
    });
  }

  message() {
    if (this.target === 1) {
      this.messageThread('');
    } else {
      this.verifyS.isExpire(true).then(resolve => {
        this.messageThread(resolve);
      }).catch(() => {});
    }
  }

  messageThread(resolve: any) {
    if (resolve == 'modal') {
      this.close(true);
    } else {
      if (this.user.thread.length) {
        this.nav.navigateForward(['message/room/' + this.user.thread[0].thread_id]).then(() => {
          this.close(true);
        });
      } else {
        this.userS.setCreateThread({ user_id: this.user.id }).then(thread_id => {
          if (thread_id) {
            this.nav.navigateForward(['message/room/' + thread_id]).then(() => {
              this.close(true);
            });
          }
        });
      }
    }
  }

  close(flag = false) {
    this._modal.dismiss(flag);
  }

  imageView(id: any, index: any) {
    let obj: any = {
      id: this.user,
      idx: index
    }
    this.imageViewS.imageView(obj).then(modal => {
    });
  }

}
