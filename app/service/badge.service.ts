import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';

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
  count: any
}

@Injectable({
  providedIn: 'root'
})
export class BadgeService {

  constructor(
    public http: HttpClient,
    public auth: AuthenticationService,
    public commonS: CommonService
  ) { }

  getCount(token: any = this.auth.isToken()) {
    const params = new HttpParams()
 				.set('token', token)
 				;
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/badge/count`, { params });
  }

  refresh(token: any = this.auth.isToken()): Promise<any> {
    return new Promise(resolve => {
      this.getCount(token).subscribe(res => {
        if (res.success) {
          let data: any = res.data;
          this.commonS.setStorage('count', data);
          this.commonS.badge$.next(data);
          resolve(true);
        }
      });
    });
  }

  update(type: string) {
    this.commonS.getStorage('count').then(async count => {
      if (count) {
        if (type == 'friend-delete') {
          count.friendCnt--;
        } else if (type == 'friend-request-delete') {
          count.newInvite--;
        } else if (type == 'friend-request-complete') {
          count.newInvite--;
          count.friendCnt++;
        }

        this.commonS.setStorage('count', count);
        this.commonS.badge$.next(count);

        await this.refresh();
      }
    });
  }
}
