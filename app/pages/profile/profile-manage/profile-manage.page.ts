import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';

import { appConfig } from 'src/config';
import { AlertService } from 'src/app/service/alert.service';
import { CommonService } from 'src/app/service/common.service';

import { SearchClubComponent } from '../../../modal/search-club/search-club.component';
import { UserService } from 'src/app/service/user.service';
import { ClubService } from 'src/app/service/club.service';
import { ImageViewService } from 'src/app/service/image-view.service';
import { ActionSheetController, ModalController, NavController, Platform } from '@ionic/angular';
import { ImageUploadService } from 'src/app/service/image-upload.service';
import { DistrictService } from 'src/app/service/district.service';
import { from, Subscription } from 'rxjs';
import { filter, first, map, mergeMap, tap } from 'rxjs/operators';
import { LogsService } from 'src/app/service/logs.service';
import { LoadingService } from 'src/app/service/loading.service';
import { DistrictSelectComponent } from 'src/app/modal/district-select/district-select.component';

@Component({
  selector: 'app-profile-manage',
  templateUrl: './profile-manage.page.html',
  styleUrls: ['./profile-manage.page.scss'],
})
export class ProfileManagePage implements OnInit, OnDestroy {
  private backButtonSubscription: Subscription;
  private observableMe$: any;

  me: any;
  images: Object[] = [];
  clubLists: any;
  districtType: number = 0;

  imageUrl: string = appConfig.teeshotConfig.imageUrl;

  constructor(
    public auth: AuthenticationService,
    public alertS: AlertService,
    public commonS: CommonService,
    public userS: UserService,
    public clubS: ClubService,
    public imageViewS: ImageViewService,
    public actionSheet: ActionSheetController,
    public imgUploadS: ImageUploadService,
    public districtS: DistrictService,
    public loadingS: LoadingService,
    public nav: NavController,
    public logS: LogsService,
    public plt: Platform,
    private modal: ModalController
  ) { 
    for (let i = 0; i < 3; i++) {
  		this.images.push('assets/icon/profile-none.jpg');
    }
    from(this.commonS.storage.get('kr.co.teeshot.geo.DISTRICT_TYPE'))
      .pipe(first(), map((type) => type ? type : 0))
      .subscribe({ next: (districtType) => this.districtType = districtType })
    this.observableMe$ = this.commonS.me$.subscribe((me: any) => {
      if (me) {
        me.pictures.sort((a: any, b: any) => {
          return b['id'] - a['id'];
        });
        this.me = me;
        if (this.images.length > this.me.pictures.length) {
          this.images.splice(0, this.me.pictures.length);
        }
      }
    });
  }

  ngOnInit() {
    this.backButtonSubscription = this.plt.backButton.subscribeWithPriority(10, () => {
      this.nav.back();
    });

    this.clubS.getLists().subscribe(res => {
      if (res.success) {
        this.clubLists = res.data;
      }
    });

    this.auth.fbScreen('mypage_profile_manage');
  }

  ngOnDestroy() {
    this.backButtonSubscription?.unsubscribe();
    this.observableMe$.unsubscribe();
  }

  // getMe() {
  //   this.auth.getMe().then(me => {
  //     me.pictures.sort((a: any, b: any) => {
  //       return b['id'] - a['id'];
  //     });
  //     this.me = me;
  //     if (this.images.length > this.me.pictures.length) {
  //       this.images.splice(0, this.me.pictures.length);
  //     }
  //   });
  // }

  // thumb(picture: any) {
  //   return `${appConfig.teeshotConfig.imageUrl}/${picture.id}/thumb/${picture.image_file_name}`;
  // }

  // typical(picture: any) {
  //   const thumb = `${appConfig.teeshotConfig.imageUrl}/${picture.id}/thumb/${picture.image_file_name}`;
  //   if (thumb == this.me.profile.thumbnail_image) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  async myInfo() {
    this.alertS.alert('기본정보', `<div class="myInfo">
    <ion-item class="ion-no-padding global-alert-item"><ion-label><strong>이름</strong></ion-label>${this.me.profile.realname ? this.me.profile.realname : '-'}</ion-item>
    <ion-item class="ion-no-padding global-alert-item"><ion-label><strong>성별</strong></ion-label>${this.me.profile.gender=='male'? '남자' : this.me.profile.gender=='female' ? '여자' : '-'}</ion-item>
    <ion-item class="ion-no-padding global-alert-item"><ion-label><strong>나이</strong></ion-label>${this.me.profile.dob ? this.commonS.ageChange(this.me.profile.dob) + '세' : '-'}</ion-item>
    <p class="ion-no-margin ion-margin-top">* 위 항목은 수정할 수 없습니다.</p>
    </div>`);
  }

  nickChange() {
    this.alertS.nicknameChange('닉네임', `<div>
    <ion-item class="ion-no-padding global-alert-item"><ion-label><strong>현재</strong></ion-label>${this.me.username}</ion-item>
    <div><br><br>한글, 숫자, -, _ 만 입력 가능합니다.<br>길이 한글 2자 이상 10자 이하</div>
    </div>`).then(alert => {
      alert.onWillDismiss().then(res => {
        const data = res.data;
        if (res.role == 'ok') {
          this.userS.putChangeNickname({ new_username: data.values.username }).then(resolve => {
            if (resolve) {
              this.me.username = data.values.username;
            }
          });
        }
      });
    });
  }

  profileChange(type: string, val: any) {
    let value: any;

    if (type == 'bio') {
      value = val;
    } else {
      value = val.detail.value;
    }
    this.userS.putProfileChange({ type: type, value: value });
  }

  searchGolf() {
    this.commonS.commonModal({}, SearchClubComponent)
      .then(modal => {
        modal.onDidDismiss().then(detail => {
          if (detail.data) {
            const data: any = detail.data;
            this.userS.setAddClub({ club_id: data.id, club_name: data.name }).then(res => {
              if (res) {
                this.me.clubs.push(data);
              }
            })
          }
        });
      });
  }

  clubDelete(id: any, index: any) {
    this.userS.setRemoveClub(id).then(res => {
      if (res) {
        this.me.clubs.splice(index, 1);
      }
    })
  }

  imageView(id: any, index: any) {
    let obj: any = {
      id: this.me,
      idx: index
    }
    this.imageViewS.imageView(obj).then(modal => {
      modal.onWillDismiss().then(res => {
        // this.getMe();
        if (res.data) {
          this.attach();
        }
      });
    });
  }

  addPicture(pictures: any) {
    this.commonS.getStorage('me').then(me => {
      me.pictures = pictures;
      this.me.pictures = pictures.reverse();

      this.commonS.setStorage('me', me);
    });
  }

  async attach() {
    let action = await this.actionSheet.create({
      header: '선택',
      mode: 'md',
      buttons: [{
        text: '사진',
        icon: 'images',
        handler: () => {
          this.imgUploadS.uploadProfile('photo').then(resolve => {
            if (resolve) {
              // this.addPicture(resolve.pictures);
            }
          });
        }
      }, {
        text: '카메라',
        icon: 'camera',
        handler: () => {
          this.imgUploadS.uploadProfile('camera').then(resolve => {
            if (resolve) {
              // this.addPicture(resolve.pictures);
            }
          });
        }
      }]
    });
    await action.present();
  }

  selectDistrict(districtCode: number) {
    from(this.modal.create({ component: DistrictSelectComponent, componentProps: { districtCode } }))
      .pipe(first(), tap((modal) => modal.present()))
      .pipe(mergeMap((modal) => from(modal.onDidDismiss())), map((wrapper) => wrapper['data']))
      .pipe(filter((data) => data))
      .pipe(tap(() => this.loadingS.show()), tap((event: any) => this.districtType = event.type))
      .pipe(mergeMap((src: any) => this.userS.updProfile('district', { code: src.cd, depth1: src.depth1, depth2: src.depth2 })))
      .pipe(tap((district) => this.me.profile.geo_location = `${district.depth1}${district.depth2 ? ` ${district.depth2}` : ''}`))
      .subscribe({
        next: () => this.loadingS.hide(),
        error: (err) => this.logS.errors({
          f_1: 'district',
          f_2: 'ProfileManagePage::selectDistrict',
          f_5: 'ionic',
          body: err?.stack
        }).finally(() => this.loadingS.hide())
      });
  }
}
