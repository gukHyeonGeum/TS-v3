import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

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
export class PremiumService {
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
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/premium`, { params });
  }

  getRequest(obj: any, limit: any, offset: any) {
    const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('type', obj.type)
 				.set('limit', limit)
 				.set('offset', offset)
 				;
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/premium/active/request`, { params });
  }
  
  getView(id: any) {
    const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				;
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/premium/${id}`, { params });
  }

  getPostView(id: any) {
    const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				;
    return this.http.get<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/premium/posts/${id}`, { params });
  }

  setReservation(obj: any): Promise<any> {
    return new Promise(resolve => {
      const token = this.auth.isToken();
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/premium/rsvp/store?token=` + token, obj, {
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
      const token = this.auth.isToken();
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/premium/rsvps/delete?token=` + token, obj, {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }).subscribe(res => {
          this.loadingS.hide();
          const result: any = res;
          if (result.success) {
            resolve(true);
          } else {
            this.alertS.alert('오류', result.message);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('에러', e.statusText);
        });
    });
  }

  putFinish(obj: any): Promise<any> {
    return new Promise(resolve => {
      const token = this.auth.isToken();
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/premium/end/${obj.id}?token=` + token, obj, {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }).subscribe(res => {
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
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/premium/rsvps/put?token=` + token, obj, {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }).subscribe(res => {
          this.loadingS.hide();
          const result: any = res;
          if (result.success) {
            this.alertS.alert('프리미엄 확정', '<p>① 통화하여 내용을 확인하세요.</p><p>② 멤버로 맞지 않으면 취소가능합니다.</p>');
            resolve(true);
          } else {
            this.alertS.alert('오류', result.message);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('에러', e.statusText);
        });
    });
  }

  putAdmincheck(obj: any): Promise<any> {
    return new Promise(resolve => {
      const token = this.auth.isToken();
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/premium/hidden?token=` + token, obj, {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }).subscribe(res => {
          this.loadingS.hide();
          const result: any = res;
          if (result.success) {
            this.alertS.alert('등록완료', '<p>신청자로 등록되었습니다.</p>');
            resolve(true);
          } else {
            this.alertS.alert('오류', result.message);
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('에러', e.statusText);
        });
    });
  }

  setCreate(obj: any): Promise<any> {
    return new Promise(resolve => {
      const token = this.auth.isToken();
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/premium/create?token=` + token, obj, {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }).subscribe(res => {
          this.loadingS.hide();
          const result: any = res;
          if (result.success) {
            this.alertS.alert('프리미엄 등록', `
            <p>
              프리미엄 등록 완료 되었습니다.<br><br>

              매칭된 신청자만 초청자 정보 확인이 가능합니다.<br>
              매칭 전 대화요청시 반드시 프리미엄 초청자임을 밝혀주세요.<br><br>
              
              예시)<br>
              ‘안녕하세요. 레이크우드 5월 1일
              프리미엄 초청자 입니다.’<br><br>

              매칭 전에는 등록 내용 수정 가능합니다.
            </p>`);
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

  putCreate(obj: any): Promise<any> {
    return new Promise(resolve => {
      const token = this.auth.isToken();
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/premium/update/${obj.id}?token=` + token, obj, {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }).subscribe(res => {
          this.loadingS.hide();
          const result: any = res;
          if (result.success) {
            this.alertS.alert('수정완료', '<p>수정이 완료되었습니다.</p>');
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
