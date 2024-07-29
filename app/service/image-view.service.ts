import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { appConfig } from 'src/config';

import { AuthenticationService } from './authentication.service';
import { AlertService } from './alert.service';
import { CommonService } from './common.service';
import { LoadingService } from './loading.service';
import { UserService } from './user.service';

import { ImageViewComponent } from '../modal/image-view/image-view.component';

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
export class ImageViewService {
  constructor(
    public auth: AuthenticationService,
    public commonS: CommonService,
    public loadingS: LoadingService,
    public http: HttpClient,
    public alertS: AlertService,
    public userS: UserService
  ) { }

  imageView(obj: any) {
    return this.commonS.commonModal(obj, ImageViewComponent);
  }

  setProfile(obj: any): Promise<any> {
    return new Promise(resolve => {
      const token = this.auth.isToken();
      this.loadingS.show();
      this.http.post<HttpResponse>(`${appConfig.teeshotConfig.webUrl}/pictures/update/${obj.id}?token=` + token, obj, {
          headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
        }).subscribe(res => {
          if (res) {
            this.userS.putUserUpdate('thumbnail', { thumbnail: obj.name });
            resolve(true);
          } else {
            this.alertS.alert('알림', '메인사진 설정 중 오류가 발생하였습니다.');
          }
        }, e => {
          this.loadingS.hide();
          this.alertS.alert('오류', e.statusText);
        });
    });
  }
}
