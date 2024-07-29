import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';

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
export class ClubService {

  constructor(
    public auth: AuthenticationService,
    public http: HttpClient,
    public alertS: AlertService,
    public loadingS: LoadingService
  ) { }

  getFindClub(search: string, offset: any, limit: any) {
    const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('search', search)
 				.set('offset', offset)
 				.set('limit', limit);
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/club/find`, { params });
  }

  getLists() {
    const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				;
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/club/lists`, { params });
  }

  getClubTypeLists(clubType: any): Promise<any> {
    return new Promise(resolve => {
      const params = new HttpParams()
          .set('token', this.auth.isToken())
          .set('clubType', clubType)
          ;
      this.loadingS.show();
      this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/club/clubType/lists`, { params })
        .subscribe(res => {
          this.loadingS.hide();
          if (res.success) {
            resolve(res.data);
          } else {
            this.alertS.alert('인증실패', res.message);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('인증실패', e.statusText);
        });
    });
  }

}
