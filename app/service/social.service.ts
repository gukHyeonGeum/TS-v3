import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Platform, NavController } from '@ionic/angular';

import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';

import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { Facebook, Kakao, Naver } from 'ng2-cordova-oauth/core';

import { appConfig } from 'src/config';

import { AuthenticationService } from './authentication.service';
import { AlertService } from './alert.service';
import { CommonService } from './common.service';
import { BadgeService } from './badge.service';
import { LoadingService } from './loading.service';
import { PushService } from './push.service';
import { UserService } from './user.service';
import { LogsService } from './logs.service';

declare var window: any;

interface HttpResponse {
  success: boolean
  errCode: string,
  message: string,
  token: string,
  data: object,
  cnt: number,
  error: string,
  user: any,
  count: any
}

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  private oauth: OauthCordova = new OauthCordova();
  private facebookProvider: Facebook = new Facebook({
    redirectUri: `${appConfig.teeshotConfig.apiUrl}/callback`, 
    clientId: appConfig.teeshotConfig.facebookClientId,
    appScope: ["email"]
  });

  private kakaoProvider: Kakao = new Kakao({
    redirectUri: `${appConfig.teeshotConfig.apiUrl}/callback`, 
    clientId: appConfig.teeshotConfig.kakaoClientId,
    responseType: 'code'
  });

  private naverProvider: Naver = new Naver({
    redirectUri: `${appConfig.teeshotConfig.apiUrl}/callback`, 
    clientId: appConfig.teeshotConfig.naverClientId,
    clientSecret: appConfig.teeshotConfig.clientSecret,
    responseType: 'code',
    state: this.token()
  });

  constructor(
    public http: HttpClient,
    public platform: Platform,
    public loadingS: LoadingService,
    public auth: AuthenticationService,
    public nav: NavController,
    public commonS: CommonService,
    public badgeS: BadgeService,
    public pushS: PushService,
    public alertS: AlertService,
    public userS: UserService,
    public logS: LogsService,
    private SignApple: SignInWithApple,
    public ngZone: NgZone
  ) {
  }

  rand() {
    return Math.random().toString(36).substr(2); // remove `0.`
  };

  token() {
    return encodeURI(this.rand() + this.rand()); // to make it longer
  };

  facebookLogin(): Promise<any> {
    return new Promise(resolve => {
      this.auth.fbScreen('facebook_login_modal');

      this.oauth.logInVia(this.facebookProvider).then(success => {

        const result: any = success;
        const params = new HttpParams()
           .set('access_token', result.access_token)
           .set('fields', 'name,gender,location,picture,email,id,birthday')
           .set('format', 'json')
         ;
           
        this.http.get('https://graph.facebook.com/me', { params }).subscribe(res => {
          const result: any = res;

          const facebookObj = {
            email: result.email,
            name: result.name,
            provider_type: 'facebook',
            provider_key: result.id
          }

          this.socialLogin(facebookObj).subscribe(data => {
            if (data.success) {
              if (data.token) {
                this.loadingS.hide();
                this.auth.login(data.token);
                
                this.userS.getMeExpired(data.user).then(me => {
                  this.auth.setMe(me).then(() => {
                    this.pushS.pushToken();
                  });
                  this.commonS.me$.next(me);
                });

                this.commonS.setStorage('count', data.count);

                this.nav.navigateRoot('home');

                resolve(data);

                this.auth.fbLog('facebook_login_success', {});
              } else {
                console.log('토큰값이 없습니다. 다시 시도해 주세요');
                this.loadingS.hide();
                this.auth.fbLog('facebook_login_user_token_error', {});
              }
            } else {
              console.log(data.error);
              this.loadingS.hide();
              this.auth.fbLog('facebook_login_user_auth_error', {});
            }
          }, e => {
            console.log('naverLogin token error: ', e);
            this.loadingS.hide();
            this.auth.fbLog('facebook_login_user_send_fail', {});
          });
        }, error => {
          console.log('user error: ', error);
          this.loadingS.hide();
          this.auth.fbLog('facebook_login_api_send_fail', {});
        });
      }, error => {
        console.log('facebookProvider error: ', error);
        this.loadingS.hide();
        this.auth.fbLog('facebook_login_error', {});
      });      
    });
  }

  // 카카오싱크 연동
  kakaoSync() {

    this.auth.fbLog('kakao_sync_open', {});

    window["KakaoCordovaSDK"].login(
      { authTypes: [1] },
      (res: any) => {
        const kakaoInfo: any = res;
        const kakaoObj = {
          email: kakaoInfo.kakao_account.email,
          username: kakaoInfo.properties.nickname,
          is_email_verified: kakaoInfo.kakao_account.is_email_verified,
          provider_type: 'kakao',
          provider_key: kakaoInfo.id,
          kakaoInfo: res
        }

        try {
          const account = kakaoInfo['kakao_account'];

          //프로필 이미지 
          if (!account['profile_needs_agreement']) {
            if (!account['profile']['is_default_image'] && account['profile']?.['profile_image_url']) {
              kakaoObj["thumbnail_image"] = account['profile']['profile_image_url'];
            }
          }
          //전화번호
          if (!account['phone_number_needs_agreement'] && account['has_phone_number']) {
            if (account['phone_number'].indexOf('+82 ') == 0) {
              kakaoObj["phone"] = account['phone_number'].replace('+82 ', '0')?.replaceAll('-', '');
            }
          }
          //생년월일
          if (account['has_birthyear'] && account['has_birthday']) {
            if (!account['birthyear_needs_agreement'] && !account['birthday_needs_agreement']) {
              kakaoObj["dob"] = `${account['birthyear']}-${account['birthday'].substr(0, 2)}-${account['birthday'].substr(2, 2)}`;
            }
          }
          //이름
          if (!account['name_needs_agreement'] && account['name']) {
          	kakaoObj["realname"] = account['name'];
          }
          //성별
          if (!account['gender_needs_agreement'] && account['has_gender']) {
          	kakaoObj["gender"] = account['gender'];
          }
          //CI
          if (!account['ci_needs_agreement'] && account['has_ci']) {
            kakaoObj["ci"] = account['ci'];
          }
        } catch (e) {
          this.logS.errors({
            f_1: 'kakaoSync',
            f_2: 'kakao_data_parsing_fail',
            f_5: 'ionic',
            body: e
          });
        }

        if (kakaoObj.email) {
          if (kakaoObj.is_email_verified) {
            this.loadingS.show();
            this.socialLogin(kakaoObj).subscribe((data: any) => {
              if (data.success) {
                if (data.token) {
                  this.loadingS.hide();
                  this.auth.login(data.token);

                  this.userS.getMeExpired(data.user).then(me => {
                    this.auth.setMe(me).then(() => {
                      this.pushS.pushToken();
                    });
                    this.commonS.me$.next(me);
                  });

                  this.commonS.setStorage('count', data.count);

                  this.ngZone.run(() => {
                    this.nav.navigateRoot('home');
                  });

                  this.auth.fbLog('kakao_login_success', {});
                } else {
                  this.loadingS.hide();
                  this.alertS.alert('오류', '토큰값이 없습니다. 앱 종료 후 다시 시도해 주세요');
                  this.auth.fbLog('kakao_login_user_token_error', {});
                }
              } else {
                this.loadingS.hide();
                if (data.type == 'guide') {
                  this.alertS.alert('기존 회원 안내', `${data.created_at} 일에 
                  ${data.providre_type == 'naver' 
                    ? '네이버' : (data.provider_type == 'kakao' 
                    ? '카카오' : '웹')}(${this.commonS.convertEmail(data.email)})${data.providre_type ? '' : '으'}로 가입한 회원입니다.<br>
                  ${data.providre_type == 'naver' 
                    ? '네이버' : (data.provider_type == 'kakao' 
                    ? '카카오' : '웹')} 계정으로 로그인해주세요.`);
                } else {
                  this.alertS.alert('알림', data.error);
                  this.auth.fbLog('kakao_login_user_auth_error', {});
                }
              }
            }, e => {
              this.loadingS.hide();
              this.alertS.alert('에러', '카카오계정 인증 후 통신 오류가 발생하였습니다.');
              this.auth.fbLog('kakao_login_user_send_fail', {});
              this.logS.errors({
                f_1: 'kakaoSync',
                f_2: 'kakao_login_user_send_fail',
                f_5: 'ionic',
                body: e
              });
            });
          } else {
            this.loadingS.hide();
            this.alertS.alert('오류', '인증받지 않은 카카오계정 이메일입니다.<br />인증 후 다시 시도하시기 바랍니다.');
            this.auth.fbLog('kakao_login_email_auth_error', {});
          }
        } else {
          this.loadingS.hide();
          this.alertS.alert('오류', '카카오계정 이메일 값이 넘어오지 않았습니다.<br />다시 시도하시기 바랍니다.');
          this.auth.fbLog('kakao_login_email_error', {});
        }
      },
      (res: any) => {
        this.loadingS.hide();
        this.auth.fbLog('kakao_error', {});
        this.logS.errors({
          f_1: 'kakaoSync',
          f_2: 'fail',
          f_5: 'ionic',
          body: res
        });
      }
    );
    
  }

  kakaoLogin(): Promise<any> {
    return new Promise(resolve => {
      this.auth.fbScreen('kakao_login_modal');

      this.oauth.logInVia(this.kakaoProvider).then(success => {        
        const result: any = success;
        const obj = {
          grant_type: 'authorization_code',
          client_id: this.kakaoProvider.options.clientId,
          redirect_uri: this.kakaoProvider.options.redirectUri,
          code: result.code
        }
        const qry = 'grant_type=' + obj.grant_type + '&client_id=' + obj.client_id + '&redirect_uri=' + obj.redirect_uri + '&code=' + obj.code;

        this.http.post('https://kauth.kakao.com/oauth/token?' + qry, {}, {
            headers: new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded;charset=utf-8')
          }).subscribe(authorization_code => {
            const authorization: any = authorization_code;

            this.http.post(`${appConfig.teeshotConfig.webUrl}/socialauth/user`, 
              { token: authorization.access_token, provider: 'kakao' }, 
              { headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8') }
            ).subscribe(user => {
              const info: any = user;
              const kakaoInfo: any = JSON.parse(info.response);

              const kakaoObj = {
                email: kakaoInfo.kakao_account.email,
                username: kakaoInfo.properties.nickname,
                is_email_verified: kakaoInfo.kakao_account.is_email_verified,
                provider_type: 'kakao',
                provider_key: kakaoInfo.id
              }

              if (kakaoObj.email) {
                if (kakaoObj.is_email_verified) {
                  this.socialLogin(kakaoObj).subscribe(async (data) => {
                    if (data.success) {
                      if (data.token) {
                        this.loadingS.hide();
                        await this.auth.login(data.token);

                        await this.userS.getMeExpired(data.user).then(me => {
                          this.auth.setMe(me).then(() => {
                            this.pushS.pushToken();
                          });
                          this.commonS.me$.next(me);
                        });

                        // this.commonS.setStorage('count', data.count);

                        await this.badgeS.refresh(data.token).then(() => {});

                        this.nav.navigateRoot('home');

                        resolve(data);

                        this.auth.fbLog('kakao_login_success', {});
                      } else {
                        this.loadingS.hide();
                        this.auth.fbLog('kakao_login_user_token_error', {});
                      }
                    } else {
                      this.loadingS.hide();
                      this.auth.fbLog('kakao_login_user_auth_error', {});
                    }
                  }, e => {
                    this.loadingS.hide();
                    this.auth.fbLog('kakao_login_user_send_fail', {});
                  });
                } else {
                  this.loadingS.hide();
                  this.auth.fbLog('kakao_login_email_auth_error', {});
                }
              } else {
                this.loadingS.hide();
                this.auth.fbLog('kakao_login_email_error', {});
              }

              resolve(kakaoObj);
              
            }, error => {
              this.loadingS.hide();
              this.auth.fbLog('kakao_login_user_call_fail', {});
            });

          }, error => {
            this.loadingS.hide();
            this.auth.fbLog('kakao_login_api_send_fail', {});
          });

      }, error => {
        this.loadingS.hide();
        this.auth.fbLog('kakao_login_error', {});
      });      
    });
  }

  naverLogin(): Promise<any> {
    return new Promise(resolve => {
      try {
        this.auth.fbLog('naver_login_open', {});
        this.auth.fbScreen('naver_login_modal');

        this.oauth.logInVia(this.naverProvider)
          .then(success => {
            const naver_code: any = success;
            const obj = {
              grant_type: 'authorization_code',
              client_id: this.naverProvider.options.clientId,
              client_secret: this.naverProvider.options.clientSecret,
              code: naver_code.code,
              state: naver_code.state
            }

            this.http.post(`${appConfig.teeshotConfig.webUrl}/socialauth/naver`,  
                obj, 
                { headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8') }
              ).subscribe(res => {

                const result: any = res;

                if (result.success) {
                  if (result.data.resultcode == '00') {
                    const obj = {
                      email: result.data.response.email,
                      gender: result.data.response.gender,
                      realname: result.data.response.name,
                      username: result.data.response.nickname,
                      dob: result.data.response.birthday,
                      provider_type: 'naver',
                      provider_key: result.data.response.id,
                      access_token: result.token.access_token,
                      refresh_token: result.token.refresh_token
                    }
  
                    this.socialLogin(obj).subscribe(async (data) => {
                      if (data.success) {
                        if (data.token) {
                          this.loadingS.hide();
                          await this.auth.login(data.token);

                          await this.userS.getMeExpired(data.user).then(me => {
                            this.auth.setMe(me).then(() => {
                              this.pushS.pushToken();
                            });
                            this.commonS.me$.next(me);
                          });

                          await this.badgeS.refresh(data.token).then(() => {});

                          this.nav.navigateRoot('home');
  
                          resolve(data);

                          this.auth.fbLog('naver_login_success', {});
                        } else {
                          this.loadingS.hide();
                          this.alertS.alert('오류', '토큰값이 없습니다. 다시 시도해 주세요');
                          this.auth.fbLog('naver_login_user_token_error', {});
                        }
                      } else {
                        this.loadingS.hide();
                        this.alertS.alert('알림', data.error);
                        this.auth.fbLog('naver_login_user_auth_error', {});
                      }
                    }, e => {
                      this.loadingS.hide();
                      this.auth.fbLog('naver_login_user_send_fail', {});
                    });
                  } else {
                    this.loadingS.hide();
                    this.alertS.alert('오류', result.data.message);
                    this.auth.fbLog('naver_login_api_call_fail', {});
                  }

                } else {
                  this.loadingS.hide();
                  this.alertS.alert('오류', result.error);
                  this.auth.fbLog('naver_login_email_error', {});
                }
              }, error => {
                this.loadingS.hide();
                this.alertS.alert('에러', error);
                this.auth.fbLog('naver_login_api_send_fail', {});
              });
          }).catch(error => {
            this.loadingS.hide();

            this.auth.fbLog('naver_login_cancel', {});
          });

      } catch (error) {
        this.loadingS.hide();
        this.alertS.alert('에러', error);
        this.auth.fbLog('naver_login_error', {});
      }

    });
  }

  appleLogin() {
      this.SignApple.signin({
        requestedScopes: [
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
        ]
      })
      .then((res: AppleSignInResponse) => {
        this.socialLogin(
            {
              provider_type: 'apple',
              scopes: res
            }
          ).subscribe(async (data) => {
            this.loadingS.hide();
            if (data.success) {
              await this.auth.login(data.token);
              
              await this.userS.getMeExpired(data.user).then(me => {
                this.auth.setMe(me).then(() => {
                  this.pushS.pushToken();
                });
                this.commonS.me$.next(me);
              });

              await this.badgeS.refresh(data.token).then(() => {});

              this.nav.navigateRoot('home');

              this.auth.fbLog('apple_login_success', {});
            } else {
              this.alertS.alert('알림', data.error);
              this.auth.fbLog('apple_login_user_auth_error', {});
            }
          }, e => {
            this.loadingS.hide();
            this.logS.errors({
              f_1: 'social',
              f_2: 'socialLoginError',
              f_5: 'ionic',
              body: e
            });
            this.auth.fbLog('apple_login_user_send_fail', {});
          });

        this.logS.errors({
          f_1: 'social',
          f_2: 'appleLogin',
          f_5: 'ionic',
          body: res
        });
        
      })
      .catch((e: AppleSignInErrorResponse) => {
        const res: any = e;
        if (e.error === 'PLUGIN_ERROR') {
          this.alertS.alert('알림', '애플 로그인은 iOS 13 이상 지원됩니다.');
        } else {
          if (res.code === '1001' || res.code === '1003') {
            this.alertS.alert('알림', '<p>사용자 취소</p>' + res.code);
          } else if (res.code === '1000') {
            this.alertS.alert('에러', '<p>알 수 없는 이유로 승인 시도가 실패했습니다.</p>' + res.code);
          } else if (res.code === '1002') {
            this.alertS.alert('에러', '<p>승인 요청에 잘못된 응답을 받았습니다.</p>' + res.code);
          } else {
            this.alertS.alert('에러', e.error);
          }
          this.auth.fbLog('apple_login_error', {});
        }

        this.logS.errors({
          f_1: 'social',
          f_2: 'appleLoginError',
          f_5: 'ionic',
          body: e
        });
        this.loadingS.hide();
      });
  }

  socialLogin(obj: any) {
    return this.http.post<HttpResponse>(
      `${appConfig.teeshotConfig.webUrl}/authsns`,
      obj, 
      { headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8') }
    );
  }

  getJoinDevice(uuid: string, provider: string) {
    const params = new HttpParams()
            .set('uuid', uuid)
            .set('provider', provider)
            ;
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/user/joinDevice`, { params });
  }

  getJoinInfoList(uuid: string) {
    const params = new HttpParams()
            .set('uuid', uuid)
            ;
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/user/joinInfoList`, { params });
  }

}
