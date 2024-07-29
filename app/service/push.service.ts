import { Injectable, NgZone } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Platform, NavController } from '@ionic/angular';

import { Device } from '@ionic-native/device/ngx';
// import { FCM } from '@ionic-native/fcm/ngx';
import { INotificationPayload } from 'cordova-plugin-fcm-with-dependecy-updated';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';

import { appConfig } from 'src/config';

import { AuthenticationService } from './authentication.service';
import { CommonService } from './common.service';

interface HttpResponse {
  success: boolean
  errCode: string,
  message: string,
  token: string,
  data: object,
  cnt: number,
  error: string,
  user: any,
  code: string
}

@Injectable({
  providedIn: 'root'
})
export class PushService {

  public pushPayload: INotificationPayload;

  constructor(
    public auth: AuthenticationService,
    public http: HttpClient,
    public device: Device,
    public platform: Platform,
    public fcm: FCM,
    public ngZone: NgZone,
    public router: Router,
    public commonS: CommonService,
    public nav: NavController
  ) { }

  setDeviceToken(id: any, data: any): Promise<any> {
    return new Promise(resolve => {

      this.commonS.getStorage('alarm').then(alarm => {
        let flag: boolean = true;
        
        if (alarm != null) {
          flag = alarm.push;
        }
  
        if (flag) {
          this.commonS.getStorage('auth-token').then(token => {
            if (token) {
              const params = new HttpParams()
                .set('token', token)
                .set('uuid', id)
                .set('push_token', data.registrationId)
                .set('device_id', this.device.uuid)
                .set('push_type', data.registrationType)
              ;
              this.http.get<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/push/register`, { params })
                .subscribe(res => {
                  if (res.success) {
                    this.commonS.setStorage('alarm', { push: true });
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                }, e => {
                  resolve(false);
                });
            }
          });
        }
      });
    });
  }

  deleteDeviceToken(): Promise<any> {
    return new Promise(resolve => {

      if (this.platform.is('cordova')) {

        let obj: any = {
          pushType: '',
          platform: ''
        };

        if (this.platform.is('android')) {
          obj.pushType = 'fcm';
          obj.platform = 'android';
        } else {
          obj.pushType = 'apns';
          obj.platform = 'ios';
        }

        this.auth.getMe().then(me => {
          if (me) {
            const params = new HttpParams()
              .set('token', this.auth.isToken())
              .set('uuid', me.id)
              .set('push_type', obj.pushType)
            ;
            this.http.get<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/push/delete`, { params })
              .subscribe(res => {
                if (res.success) {
                  this.commonS.getStorage('alarm').then(alarm => {
                    alarm.push = false;
                    this.commonS.setStorage('alarm', alarm);
                  });
                }

                if (me.profile.gender) this.unsetTopic(me.profile.gender);
                this.unsetTopic(obj.platform);
                this.unsetTopic('all');

                resolve(true);
              }, e => {
                resolve(true);
              });
          }
        });

      }

    });
  };

  setTopic(topic: string) {
    this.fcm.subscribeToTopic(topic);
  }

  unsetTopic(topic: string) {
    this.fcm.unsubscribeFromTopic(topic);
  }

  async pushToken() {
    if (!this.platform.is('cordova')) {
      return;
    }

    let pushType = '';
    if (this.platform.is('android')) {
      pushType = 'fcm';
      this.setTopic('android');
    } else {
      pushType = 'apns';
      this.setTopic('ios');
      await this.fcm.requestPushPermission({ ios9Support: { timeout: 10, interval: 0.3 }});
    }
    this.setTopic('all');
    
    let obj: any = {
      registrationType: pushType
    };

    if (!this.platform.is('android')) await this.fcm.deleteInstanceId();

    this.fcm.getToken().then(token => {
      if (!token) return;
      obj.registrationId = token;

      this.auth.getMe().then((me: any) => {
        if (me) {
          this.setDeviceToken(me.id, obj);
          if (me.profile.gender) {
            // 성별 구독
            this.setTopic(me.profile.gender);

            // 성별 회원아이디 그룹 구독
            this.setTopic(me.profile.gender + '_id_' + Math.ceil(me.id / 100000) * 100000);

            // 생년별 구독
            if (me.profile.dob) {
              this.setTopic(me.profile.gender + '_age_' + me.profile.dob.substr(0, 4));
            }
          }
        }
      });
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      if (!token) return;
      obj.registrationId = token;
      this.auth.getMe().then((me: any) => {
        if (me) {
          this.setDeviceToken(me.id, obj);
        }
      });
    });

    this.fcm.onNotification().subscribe(data => {
      this.payload(data);
    });

    this.pushPayload = await this.fcm.getInitialPushPayload();
    if (this.pushPayload) {
      await this.payload(this.pushPayload);
    }

    await this.fcm.clearAllNotifications();
  }

  async payload(data: any) {
    if (data.wasTapped) {
      let page: any;
      this.ngZone.run(() => {
        if (data.id) {
          page = [data.landing_page, data.id];
        } else {
          page = [data.landing_page];
        }
        this.nav.navigateForward(page);
      });
    } else {
      let url: any;
      if (data.id) {
        url = '/' + data.landing_page + '/' + data.id;
      } else {
        url = '/' + data.landing_page;
      }
      if (this.router.url != url) {
        this.commonS.toastMsgOption(data, 'top', 5000);
      }
    }
  }
}
