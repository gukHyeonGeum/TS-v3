import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

import { appConfig } from 'src/config';

import { AuthenticationService } from './authentication.service';
import { AlertService } from './alert.service';

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
export class NewsService {

  constructor(
    public auth: AuthenticationService,
    public http: HttpClient,
    public alertS: AlertService
  ) { }

  getLists(obj: any, limit: any, offset: any) {
    const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('limit', limit)
 				.set('offset', offset)
 				;
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/news`, { params });
  }

  putRead(obj: any): Promise<any> {
    return new Promise(resolve => {
      obj.token = this.auth.isToken();
      this.http.put<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/news/read`, obj, {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }).subscribe(res => {
          if (res.success) {
            resolve(true);
          } else {
            this.alertS.alert('알림', res.message);
            resolve(false);
          }
        }, e => {
          this.alertS.alert('오류', e.statusText);
          resolve(false);
        });
    });
  }
}
