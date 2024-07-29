import { Injectable } from '@angular/core';

import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { LogsService } from './logs.service';

import { appConfig } from 'src/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { CommonService } from './common.service';
import { UserService } from './user.service';
import { DistrictService } from './district.service';
import { from, Observable, of } from 'rxjs';
import { filter, first, map, mergeMap, tap } from 'rxjs/operators';

interface HttpResponse {
  success: boolean,
  data: any,
  message: any
}

@Injectable({
  providedIn: 'root'
})
export class GeoService {
  private updProfileTime = 0;
  private isUpdateProfile = true;

  lat: any = 0;
  long: any = 0;

  constructor(
    private geolocation: Geolocation,
    public auth: AuthenticationService,
    public http: HttpClient,
    public logS: LogsService,
    public commonS: CommonService,
    public districtS: DistrictService,
    public userS: UserService
  ) { }

  /**
   * GPS 권한 요청을 위해서만 사용되는 함수
   * @returns {Observable<Geolocation>}
   */
  selGeoLocationForPermission(): Observable<Geoposition> {
    return from(this.geolocation.getCurrentPosition({ timeout: 1000 }))
      .pipe(first())
  }

  /**
   * 위도, 경도 반환 함수
   * @returns {Observable<{ latitude: number, longitude: number }>}
   */
  selGeoLocation(): Observable<{ latitude: number, longitude: number }> {
    return from(this.geolocation.getCurrentPosition({ maximumAge: 1800000, timeout: 3000 })
      .then((geoPosition) => { return { coords: geoPosition.coords } })
      .catch((err) => {
        if (err?.code == 1 || err?.code == 2 || err?.code == 3) {
          throw { code: err.code, message: 'kr_co_teeshot_app_geo_illegal_access' };
        } else {
          throw err;
        }
      }))
      .pipe(map((geoWrapper) => geoWrapper.coords))
  }

  /**
   * 이전 위도, 경도와 거리를 비교해서 `distance` 보다 크면 현재 위도, 경도를 반환하는 함수
   * @param {number} distance 거리
   * @returns {Observable<{ lat: number, lng: number }>}
   */
  selGeoLocationByDistance(latitude: number, longitude: number, distance: number): Observable<{ lat: number, lng: number}> {
    return of({ latitude, longitude })
      .pipe(mergeMap((neo) => from(this.commonS.storage.get('kr.co.teeshot.geo.LAT_LNG'))
        .pipe(map((old) => old ? JSON.parse(old) : old))
        .pipe(mergeMap((old) => (!old || old?.lat == undefined || old?.lng == undefined)
          ? of({ next: true, lat: neo.latitude, lng: neo.longitude })
          : this.calcDistance(old, { lat: neo.latitude, lng: neo.longitude })
            .pipe(map((measured) => { return { next: measured >= distance, lat: neo.latitude, lng: neo.longitude } }))
        ))
      ))
      .pipe(filter((result) => result.next))
      .pipe(mergeMap((src) => from(this.commonS.storage.set('kr.co.teeshot.geo.LAT_LNG', JSON.stringify(src)))
        .pipe(map(() => src))
      ));
  }

  /**
   * 사용자의 위도, 경도 업데이트 함수
   * @param {number} latitude 위도
   * @param {number} longitude 경도
   * @param token 토큰
   * @returns {Observable<{ latitude: number, longitude: number }>}
   */
  updCoords(latitude: number, longitude: number, token: any = this.auth.isToken()): Observable<{ latitude: number, longitude: number}> {
    if (!token) return;
    if (this.updProfileTime && (this.updProfileTime + 1800000 < new Date().getTime())) {
      this.isUpdateProfile = true;
    }
    const obj = { token: token, lat: latitude, long: longitude }
    return (this.isUpdateProfile 
      ? this.http.post<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/user/putCoords`, obj, 
      { headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8') })
        .pipe(map(() => { 
          this.updProfileTime = new Date().getTime();
          return { latitude, longitude };
        }))
      : of({ latitude, longitude }))
      .pipe(tap(() => this.isUpdateProfile = false))
  }

  /**
   * d = R ⋅ acos(sin φ₁ ⋅ sin φ₂ + cos φ₁ ⋅ cos φ₂ ⋅ cos Δλ)
   * @param {number} src 시작 지점의 위도, 경도
   * @param {number} dst 목적 지점의 위도, 경도
   * @returns {Observable<number>}
   */
  calcDistance(src: { lat: number, lng: number }, dst: { lat: number, lng: number }): Observable<number> {
    return of((6371e3 * Math.acos(
      Math.sin(src.lat * Math.PI / 180) * Math.sin(dst.lat * Math.PI / 180)
      + Math.cos(src.lat * Math.PI / 180) * Math.cos(dst.lat * Math.PI / 180) * Math.cos((dst.lng - src.lng) * Math.PI / 180)
    )));
  }

  /**
   * @deprecated
   * @returns 
   */
  getCurrentCoords(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.commonS.getStorage('auth-token').then(token => {
        if (token) {
          this.geolocation.getCurrentPosition({ timeout: 2000 }).then(res => {
            this.lat = res.coords.latitude;
            this.long = res.coords.longitude;

            this.putCoords(this.lat, this.long, token);

            this.userS.putUserUpdate('latlng', { latitude: this.lat, longitude: this.long });

            resolve(res.coords);
          }).catch(async (e: any) => {
            if (e && e.code != 3) {
              await this.logS.errors({
                f_1: 'geo',
                f_2: 'getCurrentCoords',
                f_5: 'ionic',
                body: e.message
              });
            }
            reject();
          });
        } else {
          reject();
        }
      });

      // this.geolocation.getCurrentPosition().then(async res => {
      //   console.log(res);
      //   this.lat = res.coords.latitude;
      //   this.long = res.coords.longitude;
  
      //   await this.commonS.getStorage('auth-token').then(token => {
      //     this.putCoords(this.lat, this.long, token);
      //   });

      //   this.userS.putUserUpdate('latlng', { latitude: this.lat, longitude: this.long });

      //   resolve(res.coords);
      // }).catch(async (e: any) => {
      //   await this.logS.errors({
      //     f_1: 'geo',
      //     f_2: 'getCurrentCoords-test',
      //     f_5: 'ionic',
      //     body: e.message
      //   });
      //   reject();
      // });
    });
  }

  /**
   * @deprecated
   * @returns 
   */
  putCoords(lat: any, long: any, token: any = this.auth.isToken()) {
    if (!token) return;

    let obj = {
      token: token,
      lat: lat,
      long: long
    }
    this.http.post<HttpResponse>(`${appConfig.teeshotConfig.nodeUrl}/user/putCoords`, obj, {
        headers: new HttpHeaders().set('Content-Type','application/json; charset=utf-8')
      }).subscribe(async res => {
        if(!res.success) {
          await this.logS.errors({
            f_1: 'geo',
            f_2: 'putCoords',
            f_5: 'ionic',
            body: res.message
          });
        }
      }, async e => {
        await this.logS.errors({
          f_1: 'geo',
          f_2: 'putCoords-error',
          f_5: 'ionic',
          body: e
        });
      });
  }
}
