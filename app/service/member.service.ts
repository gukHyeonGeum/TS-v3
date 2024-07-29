import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

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
export class MemberService {

  constructor(
    public auth: AuthenticationService,
    public http: HttpClient,
    public loadingS: LoadingService,
    public alertS: AlertService
  ) { }

  getLists(obj: any, limit: any, offset: any) {
    let params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('limit', limit)
 				.set('offset', offset);
    if (obj.interval != null) {
      params = params.set('interval', obj.interval);
    }
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/member/${obj.type}`, { params });
  }

  getFilter(obj: any): Promise<any> {
    return new Promise(resolve => {
      obj.token = this.auth.isToken();
      this.loadingS.show()
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/member/preference`, obj, {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }).subscribe(res => {
          this.loadingS.hide();
          if (res.success) {
            resolve(res.data);
          } else {
            this.alertS.alert('중복', res.message);
            resolve(false);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('오류', e.statusText);
          resolve(false);
        });
    });
  }
  
  getFilterObservable(obj: any) {
    obj['token'] = this.auth.isToken();
    return this.http.post<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/member/preference`, obj, {
      headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
    });
  }
}
