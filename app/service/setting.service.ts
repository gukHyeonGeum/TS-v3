import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { appConfig } from 'src/config';

import { AuthenticationService } from './authentication.service';
import { AlertService } from './alert.service';
import { LoadingService } from './loading.service';
import { PushService } from './push.service';

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
export class SettingService {
  constructor(
    public auth: AuthenticationService,
    public http: HttpClient,
    public alertS: AlertService,
    public loadingS: LoadingService,
    public pushS: PushService
  ) { 
  }

  getJoinType(): Promise<any> {
    return new Promise((resolve, reject) => {
      const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				;
      this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/setting/account/joinType`, { params })
        .subscribe(res => {
          if (res.success) {
            resolve(res.data);
          } else {
            this.alertS.alert('에러', res.message);
            reject();
          }
        }, e => {
          this.alertS.alert('오류', e.statusText);
          reject();
        });
    });
  }

  putDrop(obj: any): Promise<any> {
    return new Promise(resolve => {
      this.loadingS.show();
      const token = this.auth.isToken();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/user/quit?token=`+ token, obj, 
          { headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8') }
        ).subscribe(res => {
          this.loadingS.hide();
          const data: any = res;
          if (data.success) {
            this.alertS.alert('탈퇴완료', '정상적으로 탈퇴처리 되었습니다.').then(alert => {
              alert.onDidDismiss().then(() => {
                this.pushS.deleteDeviceToken();
                this.auth.leave();
                resolve(true);
              });
            });
          } else {
            this.alertS.alert('알림', data.message);
            resolve(false);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('오류', e.statusText);
        });
    });
  }

  putPassword(obj: any): Promise<any> {
    return new Promise(resolve => {
      this.loadingS.show();
      const token = this.auth.isToken();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/user/password?token=`+ token, obj, 
          { headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8') }
        ).subscribe(res => {
          this.loadingS.hide();
          const data: any = res;
          if (data.success) {
            this.alertS.alert('변경완료', '비밀번호가 변경되었습니다.');
            resolve(true);
          } else {
            this.alertS.alert('알림', data.message);
            resolve(false);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('오류', e.statusText);
        });
    });
  }

  setReception(obj: any): Promise<any> {
    return new Promise(resolve => {
      this.loadingS.show();
      const token = this.auth.isToken();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/inquiry?token=`+ token, obj, 
          { headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8') }
        ).subscribe(res => {
          this.loadingS.hide();
          const data: any = res;
          if (data.success) {
            this.alertS.alert('접수완료', `<p>신고하신 건은 내용을 확인하여 서비스 운영규정에 따라 처리될 예정입니다.<br>감사합니다.</p>`);
            resolve(true);
          } else {
            this.alertS.alert('알림', data.error.body[0]);
            resolve(false);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('오류', e.statusText);
        });
    });
  }

  // AppleId 삭제
  deleteAppleId(): Promise<any> {
    return new Promise(resolve => {
      this.http.delete<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/deleteAppleId?token=${this.auth.isToken()}`,
        {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }
      ).subscribe(res => {
        if (res.success) {
          resolve(true);
        } else {
          this.alertS.alert('알림', res.message);
          this.auth.logout();
          resolve(false);
        }
      }, e => {
        this.alertS.alert('오류', e.statusText);
        resolve(false);
      });
    });
  }

}
