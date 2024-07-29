import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { appConfig } from 'src/config';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  constructor(
    public auth: AuthenticationService,
    public http: HttpClient
  ) { }

  errors(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      obj.token = this.auth.isToken();
      this.http.post<any>(`${appConfig.teeshotConfig.webUrl}/logs/error`, obj,
        { headers: new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8') }
      ).subscribe(() => {
        resolve(true);
      }, e => {
        resolve(false);
      });
    });
  }

  getLogLists(obj: any, limit: any, offset: any) {
    const params = new HttpParams()
 				.set('token', this.auth.isToken())
 				.set('limit', limit)
 				.set('offset', offset)
 				;
    return this.http.get<any>(`${appConfig.teeshotConfig.nodeUrl}/common/logLists`, { params });
  }
}
