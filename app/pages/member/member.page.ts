import { Component, OnInit, ViewChild } from '@angular/core';
import { from, of } from 'rxjs';
import { filter, first, map, mergeMap } from 'rxjs/operators';
import { CommonService } from 'src/app/service/common.service';
import { DistrictService } from 'src/app/service/district.service';
import { GeoService } from 'src/app/service/geo.service';
import { LogsService } from 'src/app/service/logs.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.page.html',
  styleUrls: ['./member.page.scss'],
})
export class MemberPage implements OnInit {
  title: string = '오늘의 추천';
  tabName: string = 'recommended';

  constructor(
    public geoS: GeoService,
    public commonS: CommonService,
    public logS: LogsService,
    public userS: UserService,
    public districtS: DistrictService
  ) {
  }

  ngOnInit() {
    this.geoS.selGeoLocation()
      .pipe(first())
      .pipe(mergeMap((geo) => this.geoS.updCoords(geo.latitude, geo.longitude)))
      .pipe(mergeMap((geo) => from(this.commonS.storage.get('kr.co.teeshot.geo.DISTRICT_TYPE'))
        .pipe(filter((type) => !type))
        .pipe(map(() => geo))))
      .pipe(mergeMap((geo) => this.geoS.selGeoLocationByDistance(geo.latitude, geo.longitude, 10000)))
      .pipe(mergeMap(({ lat, lng }) => from(this.districtS.selCoord2Regioncode(lat, lng))))
      .pipe(map((document) => { return { depth1: document.region_1depth_alias, depth2: document.region_2depth_alias } }))
      .pipe(mergeMap((district) => this.userS.updProfile('district', district)))
      .subscribe({
        error: (err) => err?.message == 'kr_co_teeshot_app_geo_illegal_access' 
          ? of(true).toPromise()
          : this.logS.errors({
              f_1: 'district',
              f_2: 'MemberPage::ngOnInit',
              f_5: 'ionic',
              body: err?.stack ?? err?.message
            }).then().catch()
      });
  }

  change(ev: any) {
    this.tabName = ev.tab;
    if (ev.tab == 'popular') {
      this.title = '인기회원';
    } else if (ev.tab == 'distance') {
      this.title = '근처회원';
    } else if (ev.tab == 'created') {
      this.title = '신규회원';
    } else if (ev.tab == 'filter') {
      this.title = '회원검색';
    } else if (ev.tab == 'updated') {
      this.title = '접속회원';
    } else {
      this.title = '오늘의 추천';
    }
  }

}
