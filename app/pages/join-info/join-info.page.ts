import { Component, OnInit } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';
import { ModalController, Platform } from '@ionic/angular';

import { LoadingService } from 'src/app/service/loading.service';
import { SocialService } from 'src/app/service/social.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-join-info',
  templateUrl: './join-info.page.html',
  styleUrls: ['./join-info.page.scss'],
})
export class JoinInfoPage implements OnInit {
  
  lists: any;
  showAppleSignIn: boolean = false;

  constructor(
    public auth: AuthenticationService,
    public socialS: SocialService,
    public device: Device,
    public loadingS: LoadingService,
    public modal: ModalController,
    private platform: Platform
  ) { 
    if (this.platform.is('ios')) {
      this.showAppleSignIn = true;
    }
  }

  ngOnInit() {
    this.socialS.getJoinInfoList(this.device.uuid).subscribe(res => {
      if (res.success) {
        this.lists = res.data;
      } else {
      }
    });

    this.auth.fbScreen('memberLogin');
  }

  socialLogin(provider: string) {
    this.loadingS.show();
    if (provider == 'naver') {
      this.socialS.naverLogin().then(res => {
      }).catch(e => {
      }).finally(() => {
        this.loadingS.hide();
      });
    } else if (provider == 'kakao') {
      this.socialS.kakaoSync();
    } else if (provider == 'kakaoSync') {
      this.socialS.kakaoSync();
    } else if (provider == 'facebook') {
      this.socialS.facebookLogin().then(res => {
      }).catch(e => {
      }).finally(() => {
        this.loadingS.hide();
      });
    } else if (provider == 'apple') {
      this.socialS.appleLogin();
    }

    this.auth.fbLog('member_social_login_button_click', { device_uuid: this.device.uuid, social: provider });
  }

}
