import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { appConfig } from 'src/config';

import { AuthenticationService } from './authentication.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor(
    public auth: AuthenticationService,
    public http: HttpClient,
    public alertS: AlertService
  ) { }

  getLists(obj: any, limit: any, offset: any): Promise<any> {
    return new Promise(resolve => {
      const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('company', obj.company)
 				.set('limit', limit)
 				.set('offset', offset)
       ;
       
      this.http.get<any>(`${appConfig.teeshotConfig.nodeUrl}/package`, { params })
        .subscribe(res => {
          if (res.success) {
            resolve(res.data);
          } else {
            this.alertS.alert('오류', res.message);
            resolve(false);
          }
        }, e => {
          this.alertS.alert('에러', e.statusText);
          resolve(false);
        });
    });
  }

  getView(id: any): Promise<any> {
    return new Promise(resolve => {
      const params = new HttpParams()
        .set('token', this.auth.isToken())
      ;

      this.http.get<any>(`${appConfig.teeshotConfig.nodeUrl}/package/view/${id}`, { params })
        .subscribe(res => {
          if (res.success) {
            resolve(res);
          } else {
            this.alertS.alert('오류', res.message);
            resolve(false);
          }
        }, e => {
          this.alertS.alert('에러', e.statusText);
          resolve(false);
        });
    });
  }

}
