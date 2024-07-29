import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { appConfig } from 'src/config';

import { AuthenticationService } from './authentication.service';
import { AlertService } from './alert.service';
import { BadgeService } from './badge.service';
import { LoadingService } from './loading.service';
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
  count: any
}

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  constructor(
    public auth: AuthenticationService,
    public http: HttpClient,
    public alertS: AlertService,
    public loadingS: LoadingService,
    public badgeS: BadgeService,
    public commonS: CommonService
  ) { }

  getLists(obj: any, limit: any, offset: any) {
    const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('limit', limit)
 				.set('offset', offset)
 				;
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/friend`, { params });
  }

  getReqLists(obj: any, limit: any, offset: any) {
    const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('limit', limit)
 				.set('offset', offset)
 				;
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/friend/request`, { params });
  }

  putAccept(obj: any): Promise<any> {
    let token: any = this.auth.isToken();
    return new Promise(resolve => {
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/user/friend/`+ obj.id +`?token=`+ token, {}, 
          { headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8') }
        ).subscribe(res => {
          this.loadingS.hide();
          if (res.success) {
            this.alertS.alert('알림', '친구로 승낙되었습니다.');
            this.badgeS.update('friend-request-complete');
            resolve(true);
          } else {
            this.alertS.alert('오류', '친구등록에 실패하였습니다.');
            resolve(false);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('오류', e.statusText);
          resolve(false);
        });
    });
  }

  putReqDelete(obj: any): Promise<any> {
    let token: any = this.auth.isToken();
    return new Promise(resolve => {
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/user/unfriend/`+ obj.id +`?token=`+ token, {}, 
          { headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8') }
        ).subscribe(res => {
          this.loadingS.hide();
          if (res.success) {
            this.badgeS.update('friend-request-delete');
            resolve(true);
          } else {
            this.alertS.alert('오류', '친구요청 삭제에 실패하였습니다.');
            resolve(false);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('오류', e.statusText);
          resolve(false);
        });
    });
  }

  putDelete(obj: any): Promise<any> {
    let token: any = this.auth.isToken();
    return new Promise(resolve => {
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/user/unfriend/`+ obj.id +`?token=`+ token, {}, 
          { headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8') }
        ).subscribe(res => {
          this.loadingS.hide();
          if (res.success) {
            this.badgeS.update('friend-delete');
            resolve(true);
          } else {
            this.alertS.alert('오류', '친구 삭제에 실패하였습니다.');
            resolve(false);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('오류', e.statusText);
          resolve(false);
        });
    });
  }

}
