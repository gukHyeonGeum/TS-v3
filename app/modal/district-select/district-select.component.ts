import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { from, Subscription } from 'rxjs';
import { first, map, mergeMap, tap } from 'rxjs/operators';
import { AlertService } from 'src/app/service/alert.service';
import { CommonService } from 'src/app/service/common.service';
import { DistrictService } from 'src/app/service/district.service';
import { GeoService } from 'src/app/service/geo.service';
import { LogsService } from 'src/app/service/logs.service';

@Component({
  selector: 'app-district-select',
  templateUrl: './district-select.component.html',
  styleUrls: ['./district-select.component.scss'],
})
export class DistrictSelectComponent implements OnInit {
  private districtSubscription: Subscription;
  private kakaoSubscription: Subscription;

  lstDistrict: any;
  selectedSido: number = 0;
  selectedSigungu: number = 0;
  selectedTab: number = 0;
  districtCode: number;

  constructor(
    public districtS: DistrictService,
    public commonS: CommonService,
    public logS: LogsService,
    public geoS: GeoService,
    public alertS: AlertService,
    private modal: ModalController
  ) {
  }

  ngOnInit() {
    this.districtSubscription = from(this.commonS.storage.get('kr.co.teeshot.geo.DISTRICT_TYPE'))
      .pipe(tap((type) => this.selectedTab = type ? type : 0))
      .pipe(mergeMap(() => this.districtS.selDistrictList()))
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.lstDistrict = res.data;
            if (this.lstDistrict) {
              if (this.districtCode) {
                for (const idxSido of this.lstDistrict.keys()) {
                  if (this.lstDistrict[idxSido].cd == ~~(this.districtCode / 1000)) {
                    this.selectedSido = idxSido;
                    for (const idxSigungu of this.lstDistrict[idxSido].list.keys()) {
                      if (this.lstDistrict[idxSido].list[idxSigungu].cd == this.districtCode % 1000) {
                        this.selectedSigungu = idxSigungu;
                        break;
                      }
                    }
                    break;
                  }
                }
              }
              this.lstDistrict[this.selectedSido].selected = true;
              this.lstDistrict[this.selectedSido].list[this.selectedSigungu].selected = true;
            }
          }
        },
        error: (err) => this.logS.errors({
          f_1: 'district',
          f_2: 'SelectDistrictPage::ngOnInit',
          f_5: 'ionic',
          body: err?.stack
        })
    });
  }
  ngOnDestroy() {
    this.districtSubscription?.unsubscribe();
    this.kakaoSubscription?.unsubscribe();
  }

  changeTab(idx: number) {
    this.selectedTab = idx;
  }
  selectSido(idx: number) {
    this.lstDistrict[this.selectedSido].list[this.selectedSigungu].selected = false;
    this.lstDistrict[idx].list[0].selected = true;
    this.selectedSigungu = 0;
    this.lstDistrict[this.selectedSido].selected = false;
    this.lstDistrict[idx].selected = true
    this.selectedSido = idx;
  }
  selectSigungu(idx: number) {
    this.lstDistrict[this.selectedSido].list[this.selectedSigungu].selected = false;
    this.lstDistrict[this.selectedSido].list[idx].selected = true;
    this.selectedSigungu = idx;
  }
  close() {
    this.modal.dismiss(); 
  }
  confirm() {
    from(this.commonS.storage.set('kr.co.teeshot.geo.DISTRICT_TYPE', this.selectedTab))
      .pipe(first())
      .pipe(mergeMap(() => {
        if (this.selectedTab) {
          return from([{ 
            cd: (this.lstDistrict[this.selectedSido].cd * 1000) + this.lstDistrict[this.selectedSido].list[this.selectedSigungu].cd, 
            depth1: this.lstDistrict[this.selectedSido].name,
            depth2: this.lstDistrict[this.selectedSido].list[this.selectedSigungu].name
          }])
            .pipe(first());
        } else {
          return this.geoS.selGeoLocation()
            .pipe(first())
            .pipe(mergeMap((geo) => this.geoS.selGeoLocationByDistance(geo.latitude, geo.longitude, 0)), tap(console.log))
            .pipe(mergeMap(({ lat, lng }) => from(this.districtS.selCoord2Regioncode(lat, lng))))
            .pipe(map((document) => { return { cd: null, depth1: document.region_1depth_alias, depth2: document.region_2depth_alias } }))
        }
      }))
      .pipe(tap(({ cd, depth1, depth2 }) => this.modal.dismiss({ type: this.selectedTab, cd, depth1, depth2 })))
      .subscribe({
        error: (err) => err?.message == 'kr_co_teeshot_app_geo_illegal_access' 
          ? this.alertS.alert('알림', `위치정보를 가져올 수 없습니다.${
            (err?.code == 1 ? `<br>권한을 허용해주세요.` : (
              err?.code == 2 ? `<br>잘못된 요청입니다.` : (
              err?.code == 3 ? `<br>설정에 위치를 확인해주세요.` : '')))
            }`) 
          : this.logS.errors({
              f_1: 'district',
              f_2: 'SelectDistrictPage::confirm',
              f_5: 'ionic',
              body: err?.stack ?? err?.message
            })
      });
  }
}
