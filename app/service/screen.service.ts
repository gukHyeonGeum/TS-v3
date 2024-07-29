import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { appConfig } from 'src/config';

import { AuthenticationService } from './authentication.service';
import { AlertService } from './alert.service';
import { LoadingService } from './loading.service';
import { UserService } from './user.service';
import { CommonService } from './common.service';

import { AlertComponent } from 'src/app/modal/alert/alert.component';

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
export class ScreenService {

  constructor(
    private auth: AuthenticationService,
    private http: HttpClient,
    public alertS: AlertService,
    public loadingS: LoadingService,
    public userS: UserService,
    public commonS: CommonService
  ) { }


  /**
  * node backend
  */

  getFind(search: string, offset: any, limit: any) {
    const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('search', search)
 				.set('offset', offset)
 				.set('limit', limit);
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/screen/find`, { params });
  }

  getLists(obj: any, pages: any):Promise<any> {
    return new Promise((resolve, reject) => {
      const params = new HttpParams()
          .set('token', this.auth.isToken())
          .set('pages', pages);
      
      let type = '';
      if (obj.segment == 1) {
        if (obj.type == 'mypage') {
          type = 'request';
        } else {
          type = 'invite';
        }
      }
      this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/screen/${type}`, { params })
        .subscribe(res => {
          if (res.success) {
            resolve(res);
          } else {
            this.alertS.alert('알림', res.message);
            reject();
          }
        }, e => {
          this.alertS.alert('오류', e.statusText);
          reject();
        }); 
    });
  }

  getView(id: any):Promise<any> {
    return new Promise((resolve, reject) => {
      const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				;
      this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/screen/${id}`, { params })
        .subscribe(res => {
          if (res.success) {
            resolve(res.data);
          } else {
            this.alertS.alert('알림', res.message);
            reject();
          }
        }, e => {
          this.alertS.alert('오류', e.statusText);
          reject();
        });
    });
  }

  getScreenStore(obj: any):Promise<any> {
    return new Promise((resolve, reject) => {
      const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('lat', obj.lat)
 				.set('lng', obj.lng)
 				.set('division', obj.division)
 				;
      this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/screen/store`, { params })
        .subscribe(res => {
          if (res.success) {
            resolve(res.data);
          } else {
            this.alertS.alert('알림', res.message);
            reject();
          }
        }, e => {
          this.alertS.alert('오류', e.statusText);
          reject();
        });
    });
  }

  getScreenRatings():Promise<any> {
    return new Promise((resolve) => {
      const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				;
      this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/screen/ratings`, { params })
        .subscribe(res => {
          if (res.success) {
            resolve(res.data);
          }
        });
    });
  }

  getTodayCount():Promise<any> {
    return new Promise((resolve) => {
      const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				;
      this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/screen/todayCount`, { params })
        .subscribe(res => {
          if (res.success) {
            resolve(true);
          } else {
            this.commonS.commonModal({ message: res.message }, AlertComponent, 'auto-height');
            resolve(false);
          }
        }, e => {
          this.alertS.alert('오류', e.statusText);
          resolve(false);
        });
    });
  }


  /**
  * Laravel backend
  */

  setCreate(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/screens/create?token=${this.auth.isToken()}`, obj, 
        {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }
      ).subscribe(res => {
        if (res.success) {
          resolve(true);

          let data: any = res.data;
          let me: any = res.user;

          this.userS.putUserUpdate('giftMoney', me);
          
          this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/screens/invite?token=${this.auth.isToken()}`, 
              {
                screen_id: data.id
              }, 
              { headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8') }
            ).subscribe(() => {
            });
        } else {
          this.alertS.alert('알림', res.message);
          reject();
        }
      }, e => {
        this.alertS.alert('오류', e.statusText);
        reject();
      });
    });
  }

  setRsvp(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/screens/rsvp?token=${this.auth.isToken()}`, obj,
        {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }
      ).subscribe(res => {
        this.loadingS.hide();
        
        if (res.success) {
          resolve(true);
        } else {
          this.alertS.alert('알림', res.message);
          reject();
        }
      }, e => {
        this.loadingS.hide();
        this.alertS.alert('오류', e.statusText);
        reject();
      });
    });
  }

  deleteScreen(id: any):Promise<any> {
    return new Promise((resolve, reject) => {
      const params = new HttpParams()
 				.set('token', this.auth.isToken())
      ;
      this.http.get<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/screens/delete/${id}`, { params })
        .subscribe(res => {
          if (res.success) {
            resolve(true);

            let me: any = res.user;
            this.userS.putUserUpdate('giftMoney', me.money);
          } else {
            this.alertS.alert('알림', res.message);
            reject();
          }
        }, e => {
          this.alertS.alert('오류', e.statusText);
          reject();
        });
    });
  }

  deleteRsvp(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingS.show();
      this.http.delete<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/screens/rsvp?token=${this.auth.isToken()}`,
        {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8'),
          params: obj
        }
      ).subscribe(res => {
        this.loadingS.hide();
        
        if (res.success) {
          resolve(true);
        } else {
          this.alertS.alert('알림', res.message);
          reject();
        }
      }, e => {
        this.loadingS.hide();
        this.alertS.alert('오류', e.statusText);
        reject();
      });
    });
  }

  deleteRevokeRsvp(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingS.show();
      this.http.delete<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/screens/rsvp/revoke?token=${this.auth.isToken()}`,
        {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8'),
          params: obj
        }
      ).subscribe(res => {
        this.loadingS.hide();
        
        if (res.success) {
          resolve(true);
        } else {
          this.alertS.alert('알림', res.message);
          reject();
        }
      }, e => {
        this.loadingS.hide();
        this.alertS.alert('오류', e.statusText);
        reject();
      });
    });
  }

  setMatching(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingS.show();
      this.http.put<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/screens/rsvp?token=${this.auth.isToken()}`, obj,
        {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }
      ).subscribe(res => {
        this.loadingS.hide();
        
        if (res.success) {
          resolve(true);
        } else {
          this.alertS.alert('알림', res.message);
          reject();
        }
      }, e => {
        this.loadingS.hide();
        this.alertS.alert('오류', e.statusText);
        reject();
      });
    });
  }

  setRating(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/ratings?token=${this.auth.isToken()}`, obj,
        {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }
      ).subscribe(res => {
        console.log(res);
        this.loadingS.hide();
        
        if (res.success) {
          resolve(true);
        } else {
          this.alertS.alert('알림', res.message);
          reject();
        }
      }, e => {
        this.loadingS.hide();
        this.alertS.alert('오류', e.statusText);
        reject();
      });
    });
  }

  putCreate(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/screens/update/${obj.id}?token=${this.auth.isToken()}`, obj,
        {
          headers: new HttpHeaders().set('Content-Type', 'application/json; charset=uft-8')
        }
      ).subscribe(res => {
        this.loadingS.hide();
        
        if (res.success) {
          this.alertS.alert('완료', res.message);
          resolve(true);
        } else {
          this.alertS.alert('알림', res.message);
          reject();
        }
      }, e => {
        this.loadingS.hide();
        this.alertS.alert('오류', e.statusText);
        reject();
      });
    });
  }

  putComplete(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/screens/complete/${obj.id}?token=${this.auth.isToken()}`, obj,
        {
          headers: new HttpHeaders().set('Content-Type', 'application/json; charset=uft-8')
        }
      ).subscribe(res => {
        console.log(res);
        this.loadingS.hide();
        
        if (res.success) {
          resolve(true);
        } else {
          this.alertS.alert('알림', res.message);
          reject();
        }
      }, e => {
        this.loadingS.hide();
        this.alertS.alert('오류', e.statusText);
        reject();
      });
    });
  }

  putRsvp(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/screens/rsvp/retry?token=${this.auth.isToken()}`, obj,
        {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }
      ).subscribe(res => {
        this.loadingS.hide();
        
        if (res.success) {
          resolve(true);
        } else {
          this.alertS.alert('알림', res.message);
          reject();
        }
      }, e => {
        this.loadingS.hide();
        this.alertS.alert('오류', e.statusText);
        reject();
      });
    });
  }
}
