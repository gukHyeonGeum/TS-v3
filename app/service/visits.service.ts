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
export class VisitsService {

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
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/visits`, { params });
  }

  putReadProfile(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      obj.token = this.auth.isToken();
      this.http.put<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/visits/read/profile`, obj, {
        headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
      }).subscribe(res => {
        if (res.success) {
          resolve(true);
        } else {
          reject();
        }
      }, e => {
        reject();
      });
    });
  }

  deleteLists(obj: any): Promise<any> {
    const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('ids', obj)
 				;
    return new Promise(resolve => {
      this.loadingS.show();
      this.http.delete<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/visits/delete`, { params })
        .subscribe(res => {
          this.loadingS.hide();
          resolve(true);
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('오류', e.statusText);
          resolve(false);
        });
    });
  }
}
