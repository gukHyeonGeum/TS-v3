import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';

import { appConfig } from 'src/config';

import { AuthenticationService } from './authentication.service';
import { AlertService } from './alert.service';
import { LoadingService } from './loading.service';

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
export class MessageService {
  leaveRoom$ = new BehaviorSubject('');

  constructor(
    public auth: AuthenticationService,
    public http: HttpClient,
    public loadingS: LoadingService,
    public alertS: AlertService
  ) { }

  getLists(obj: any, limit: any, offset: any) {
    const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('limit', limit)
 				.set('offset', offset)
 				;
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/message`, { params });
  }

  getMessage(thread_id: any, limit: any, offset: any) {
    const params = new HttpParams()
        .set('token', this.auth.isToken())
        .set('thread_id', thread_id)
        .set('limit', limit)
        .set('offset', offset)
        ;

    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/message/room/${thread_id}`, { params });
  }
  
  getAdminLists() {
    const params = new HttpParams()
      .set('token', this.auth.isToken())
      ;
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/message/admin`, { params });
  }

  putLeaveChat(id: any): Promise<any> {
    return new Promise(resolve => {
      const token = this.auth.isToken();
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/msglist/delete/${id}?token=`+ token, {}, 
          { headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8') }
        ).subscribe(res => {
          this.loadingS.hide();
          if (res.success) {
            resolve(true);
          } else {
            this.alertS.alert('알림', res.message);
            resolve(false);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('오류', e.statusText);
          resolve(false);
        });
    });
  }

  putBlockUser(id: any): Promise<any> {
    return new Promise(resolve => {
      const token = this.auth.isToken();
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/msglist/block/${id}?token=`+ token, {},
          { headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8') }
        ).subscribe(res => {
          this.loadingS.hide();
          if (res.success) {
            resolve(true);
          } else {
            this.alertS.alert('알림', res.message);
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
