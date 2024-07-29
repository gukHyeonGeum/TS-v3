import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ScreenService } from 'src/app/service/screen.service';

import { ScreenStoreComponent } from 'src/app/modal/screen-store/screen-store.component';
import { PostComponent } from 'src/app/pages/screen/post/post.component';
import { VerifyService } from 'src/app/service/verify.service';
import { GeoService } from 'src/app/service/geo.service';
import { AlertService } from 'src/app/service/alert.service';
import { ScreenGuideComponent } from 'src/app/modal/screen-guide/screen-guide.component';

declare var google: any;
declare var MarkerClusterer: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  @ViewChild('map', { read: ElementRef, static: false }) mapElement: ElementRef;

  map: any;
  me: any;
  segment: any;
  location: any;
  infoWindows: any = [];
  center: any = {
    lat: 37.48323200, 
    lng: 126.89745725
  };
  markers: any = [];
  markerCluster: any;
  division = 'screenStore';

  screenMarker = {
    url: 'assets/icon/icon-location-map-nor.png',
    size: new google.maps.Size(28, 36),
    scaledSize: new google.maps.Size(28, 36)
  }
  screenMarkerOver = {
    url: 'assets/icon/icon-location-map-on.png',
    scaledSize: new google.maps.Size(28, 36)
  }

  style = [
    {
      width: 30,
      height: 30,
      className: 'custom-clustericon-1',
    },
    {
      width: 40,
      height: 40,
      className: 'custom-clustericon-2',
    },
    {
      width: 50,
      height: 50,
      className: 'custom-clustericon-3',
    }
  ];

  constructor(
    private nav: NavController,
    private modal: ModalController,
    public auth: AuthenticationService,
    public screenS: ScreenService,
    public verifyS: VerifyService,
    public geoS: GeoService,
    public alertS: AlertService
  ) { 
    
  }

  ngOnInit() {
    this.auth.getMe().then(me => {
      this.me = me;
      if (this.me.profile.latitude && this.me.profile.longitude) {
        this.center.lat = parseFloat(this.me.profile.latitude);
        this.center.lng = parseFloat(this.me.profile.longitude);
      }
      this.loadMap();
    });

    this.auth.fbScreen('screen_map');
  }

  ionViewDidEnter() {
    
  }

  segmentChanged(ev: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        tabs: ev.detail.value
      }
    }
    this.nav.navigateRoot(['screen'], navigationExtras);
  }

  loadMap() {
    const mapOption = {
      center: new google.maps.LatLng(this.center.lat, this.center.lng),
      zoom: 14,
      maxZoom: 19,
      minZoom: 13,
      disableDefaultUI: true
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOption);

    // 지도 드래그 리스너
    this.map.addListener('dragend', () => {
      let center = this.map.getCenter();

      this.center.lat = center.lat();
      this.center.lng = center.lng();

      this.removeMarkerCluster();
      this.deleteMarkers();

      this.addStoreMarkers();
    });

    this.addStoreMarkers();
    this.addMeMarker();
  }

  // 스크린 데이터 가져오기
  async addStoreMarkers() {
    await this.screenS.getScreenStore(
        {
          lat: this.center.lat,
          lng: this.center.lng,
          division: this.division
        }
      ).then(data => {
      data.forEach((list: any) => {
        this.displayPosition(list);
      });

      if (this.division !== 'screenStore') {
        if (this.markerCluster === undefined) {
          this.markerCluster = new MarkerClusterer(this.map, this.markers, {
            gridSize: this.division === 'user'? 10 : 60,
            styles: this.style,
            clusterClass: 'custom-clustericon',
            zoomOnClick: false
          });
          google.maps.event.addListener(this.markerCluster, 'clusterclick', (cluster: any) => {
            this.markerCluster.zoomOnClick = true;
            this.map.fitBounds(cluster.getBounds());
          });
        }
      }
    });
  }

  addMeMarker() {
    let meMarker = new google.maps.Marker({
      position: new google.maps.LatLng(this.center.lat, this.center.lng),
      map: this.map,
      icon: 'assets/icon/marker-screen-me.png',
      title: '내위치'
    });
  }

  // 마커 등록
  displayPosition(data: any) {
    let addLabel: any = '';

    if (this.division === 'myList' || this.division === 'requestList') {
      addLabel = {
        text: data.golf_store_name,
        color: '#333333',
        fontSize: '12px',
        className: 'global-screen-marker-label'
      }
    }

    let position = new google.maps.LatLng(data.latitude, data.longitude);
    let marker = new google.maps.Marker({
      position: position,
      map: this.map,
      icon: this.screenMarker,
      name: data.name,
      region: data.region,
      address: data.address,
      phone: data.phone,
      id: data.id,
      store_code: data.store_code,
      lat: data.latitude,
      lng: data.longitude,
      title: data.name,
      label: addLabel
    });

    this.markers.push(marker);
    this.addInfoWindowToMarker(marker);
  }

  // 마커 컨텐츠 적용
  addInfoWindowToMarker(marker: any) {

    marker.addListener('click', () => {
      if (this.division === 'myList' || this.division === 'requestList') {
        this.routerLink({ id: marker.id});
      } else {
        marker.setIcon(this.screenMarkerOver);
        this.infoModal(marker);
      }
    });
  }

  // 마커 정보창 닫기
  closeAllInfoWindows() {
    for (let window of this.infoWindows) {
      window.close();
    }
  }

  // 마커 배열 설정
  setMapOnAll(map: any = this.map) {
    for (let i=0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  // 지도에서 마커 제거
  clearMarkers() {
    this.setMapOnAll(null);
  }

  // 마커 배열 삭제
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  // 클러스터 삭제
  removeMarkerCluster() {
    if (this.markerCluster !== undefined) {
      this.markerCluster.setMap(null);
      this.markerCluster = undefined;
    }
  }

  // 내 위치로 이동
  currentPosition() {
    this.geoS.getCurrentCoords()
      .then(coords => {
        this.center.lat = parseFloat(coords.latitude);
        this.center.lng = parseFloat(coords.longitude);
        this.map.panTo(new google.maps.LatLng(coords.latitude, coords.longitude));
        // this.loadMap();
        this.deleteMarkers();
        this.addStoreMarkers();
      }).catch(() => {
        this.alertS.alert('위치정보 사용하기', '<p>이 기능을 사용하려면<br />위치 정보가 필요합니다.</p><p>설정에서 위치 정보 사용에<br /> 동의해 주세요.</p>');
      });
  }

  // 스크린 리스트 이동 후 갱신
  navScreen() {
    let navigationExtras: NavigationExtras = {
      state: {
        type: true
      }
    }
    this.nav.navigateRoot(['screen'], navigationExtras);
  }

  requestDivision(division: string) {

    if (this.division === division) {
      return;
    }
    this.division = division;
    this.removeMarkerCluster();
    this.deleteMarkers();
    this.addStoreMarkers();
    if (division === 'screenStore') {
      this.map.setOptions({ minZoom: 13});
    } else {
      this.map.setOptions({ minZoom: 10});
    }
  }

  // 초대장 상세보기 이동
  routerLink(list: any) {
    this.nav.navigateForward(['/screen/view', list.id]);
  }

  // 번개 만들기
  create(store: any = undefined) {
    this.verifyS.verify().then(() => {
      this.screenS.getTodayCount().then(res => {
        if (res) this.createModal(store);
      });
    }).catch(() => {});
  }

  // 스크린 정보 Modal
  async infoModal(markerContent: any) {
    let modal = await this.modal.create({
      component: ScreenStoreComponent,
      componentProps: {
        data: markerContent
      },
      cssClass: 'global-modal-screen height260'
    });
    modal.onWillDismiss().then(detail => {
      markerContent.setIcon(this.screenMarker);

      if (detail.data) {
        this.screenS.getTodayCount().then(res => {
          if (res) this.create(markerContent);
        });
      }
    });
		await modal.present();
  }

  // 등록하기 Modal
  async createModal(store: any = undefined) {
    let modal = await this.modal.create({
      component: PostComponent,
      componentProps: {
        data: store
      }
    });
    modal.onWillDismiss().then(detail => {
      if (detail.data) {
        this.navScreen();  
      }
    });
		await modal.present();
  }

  showGuide() {
    this.modal.create({ component: ScreenGuideComponent })
      .then((modal) => modal.present())
  }
}
