import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ActionSheetController } from '@ionic/angular';

import { AuthenticationService } from 'src/app/service/authentication.service';

import { appConfig } from 'src/config';
import { ImageViewService } from 'src/app/service/image-view.service';
import { CommonService } from 'src/app/service/common.service';
import { ImageUploadService } from 'src/app/service/image-upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;

  private observableMe$: any;
  
  me: any;
  images = 'assets/icon/profile-none.jpg';
  slideIndex = 1;
  profile_img: any;
  imageUrl: string = appConfig.teeshotConfig.imageUrl;

  constructor(
    public auth: AuthenticationService,
    public imageViewS: ImageViewService,
    public commonS: CommonService,
    public actionSheet: ActionSheetController,
    public imgUploadS: ImageUploadService
  ) { 
    this.profile_img = { 'height.px': window.innerWidth };

    this.observableMe$ = this.commonS.me$.subscribe((me: any) => {
      if (me) {
        me.pictures.sort((a: any, b: any) => {
          return b['id'] - a['id'];
        });
        this.me = me;
      }
    });
  }

  ngOnInit() {
    this.auth.fbScreen('mypage_profile');
  }

  ngOnDestroy() {
    this.observableMe$.unsubscribe();
  }

  change() {
    this.slides.getActiveIndex().then(index => {
  		this.slideIndex = index + 1;
  	});
  }

  imageView(id: any, index: any) {
    let obj: any = {
      id: this.me,
      idx: index
    }
    this.imageViewS.imageView(obj).then(modal => {
      modal.onWillDismiss().then(res => {
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
            }
          });
        }
      }, {
        text: '카메라',
        icon: 'camera',
        handler: () => {
          this.imgUploadS.uploadProfile('camera').then(resolve => {
            if (resolve) {
            }
          });
        }
      }]
    });
    await action.present();
  }

}
