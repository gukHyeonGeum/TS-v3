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
export class GolfjoinService {
  constructor(
    public http: HttpClient,
    public auth: AuthenticationService,
    public loadingS: LoadingService,
    public alertS: AlertService
  ) { }

  getLists(obj: any, limit: any, offset: any) {
    const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('type', obj.type)
 				.set('limit', limit)
 				.set('offset', offset)
 				;
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/golfjoin`, { params });
  }

  getRequest(obj: any, limit: any, offset: any) {
    const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('type', obj.type)
 				.set('limit', limit)
 				.set('offset', offset)
 				;
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/golfjoin/active/request`, { params });
  }

  getView(id: any) {
    const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				;
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/golfjoin/${id}`, { params });
  }

  setReservation(obj: any): Promise<any> {
    return new Promise(resolve => {
      const token = this.auth.isToken();
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/fields/rsvp/store?token=` + token, obj, {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }).subscribe(res => {
          this.loadingS.hide();

          const result: any = res;
          if (result.success) {
            this.alertS.alert(result.title, result.content);
            resolve(true);
          } else {
            if (result.result_code == 1) {
              this.alertS.alert('신청실패', result.message);
            } else {
              this.alertS.alert('신청중복', result.message);
            }
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('오류', e.statusText);
        });
      });
  }

  putCanceled(obj: any): Promise<any> {
    return new Promise(resolve => {
      const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('id', obj.id)
         ;
      this.loadingS.show();
      this.http.get<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/fields/rsvps/delete`, { params })
        .subscribe(res => {
          this.loadingS.hide();
          if (res.success) {
            resolve(true);
          } else {
            this.alertS.alert('오류', res.message);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('에러', e.statusText);
        });
    });
  }

  putFinish(obj: any): Promise<any> {
    return new Promise(resolve => {
      const params = new HttpParams()
 				.set('token', this.auth.isToken())
         ;
         
      this.loadingS.show();
      this.http.get<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/fields/delete/${obj.id}`, { params })
        .subscribe(res => {
          this.loadingS.hide();
          if (res.success) {
            resolve(true);
          } else {
            this.alertS.alert('오류', res.message);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('에러', e.statusText);
        });
    });
  }

  putConfirm(obj: any): Promise<any> {
    return new Promise(resolve => {
      const token = this.auth.isToken();
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/fields/rsvps/put?token=` + token, obj, {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }).subscribe(res => {
          this.loadingS.hide();
          const result: any = res;
          if (result.success) {
            this.alertS.alert('조인 확정', '<p>① 통화하여 내용을 확인하세요.</p><p>② 멤버로 맞지 않으면 취소가능합니다.</p>');
            resolve(true);
          } else {
            this.alertS.alert('알림', result.message);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('에러', e.statusText);
        });
    });
  }

  setCreate(obj: any): Promise<any> {
    return new Promise((resolve) => {
      if (obj.green_fee < 30000) {
        this.alertS.alert('그린피 금액 확인', '<p>금액을 다시 확인해 주시고</p><p>무료초대를 원하시면 프리미엄으로 등록해주세요.</p>');
        return;
      }
      
      const token = this.auth.isToken();
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/fields/create?token=` + token, obj, {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }).subscribe(res => {
          this.loadingS.hide();
          const result: any = res;
          if (result.success) {
            this.alertS.alert('조인 등록', '<p>등록되었습니다.</p>');
            resolve(true);
          } else {
            this.alertS.alert('오류', result.errors);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('에러', e.statusText);
        });
    });
  }
}
