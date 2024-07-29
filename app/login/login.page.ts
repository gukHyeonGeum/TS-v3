import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';

import { HttpClient } from '@angular/common/http';
import { SocialService } from '../service/social.service';
import { LoadingService } from '../service/loading.service';
import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';
import { GeoService } from '../service/geo.service';
import { CommonService } from '../service/common.service';
import { PermissionComponent } from '../modal/permission/permission.component';
import { from, of } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showAppleSignIn: boolean = false;

  constructor(
    public nav: NavController,
    public platform: Platform,
    public http: HttpClient,
    public device: Device,
    public socialS: SocialService,
    public loadingS: LoadingService,
    public auth: AuthenticationService,
    public commonS: CommonService,
    public geoS: GeoService,
    public modal: ModalController,
    public alertS: AlertService
  ) { 
    if (this.platform.is('ios')) {
      this.showAppleSignIn = true;
    }
  }

  ngOnInit() {
    from(this.commonS.storage.get('kr.co.teeshot.app.is_permission_confirm'))
      .pipe(mergeMap((v) => from(this.commonS.storage.set('kr.co.teeshot.app.is_permission_confirm', 1))
        .pipe(mergeMap(() => !v 
          ? from(this.modal.create({ component: PermissionComponent, }))
              .pipe(tap((modal) => modal.present()))
              .pipe(mergeMap((modal) => from(modal.onDidDismiss())))
          : of(true)
        ))
      ))
      .pipe(mergeMap(() => this.geoS.selGeoLocationForPermission()
        .pipe(catchError(() => of(true)))
      ))
      .subscribe();
  }

  ionViewWillEnter() {
    this.auth.fbScreen('login');
  }

  socialLogin(provider: string) {
    if (provider == 'naver') {
      this.socialS.naverLogin().then(() => {});
    } else if (provider == 'kakao') {
      this.socialS.kakaoLogin().then(() => {});
    } else if (provider == 'kakaoSync') {
      this.socialS.kakaoSync();
    } else if (provider == 'facebook') {
      this.socialS.facebookLogin().then(() => {});
    } else if (provider == 'apple') {
      this.socialS.appleLogin();
    }    
  }

  joinCheck(provider: string) {
    if (!this.platform.is('cordova')) {
      return;
    }

    this.auth.fbLog('social_login_button', { device_uuid: this.device.uuid, social: provider });

    this.platform.ready().then(() => {
      this.socialS.getJoinDevice(this.device.uuid, provider).subscribe(res => {
        if (res.success) {
          const data: any = res.data;

          if (res.cnt > 0) {
            if (data.isSocial > 0) {
              this.socialLogin(provider);
            } else {
              this.loadingS.hide();
              this.nav.navigateForward('join-info');
            }
          } else {
            this.socialLogin(provider);
          }
        } else {
          this.loadingS.hide();
        }
        
      });
    });
  }

  memberLogin() {
    this.nav.navigateForward('phone-login');

    this.auth.fbLog('member_login_button', { device_uuid: this.device.uuid });
  }

}
