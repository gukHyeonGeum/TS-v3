import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonSlides, NavParams, ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/service/authentication.service';

import { appConfig } from '../../../config';
import { CommonService } from 'src/app/service/common.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss'],
})
export class ImageViewComponent implements OnInit {
	@ViewChild(IonSlides) slides: IonSlides;
  @ViewChild('slider', { read: ElementRef })slider: ElementRef;
  
  private observableMe$: any;

  private userId: any;
  private idx: any;
	private images: Object[] = [];

	selected_pic: { id: any, image_file_name: any  };

  private flag = false;

  user: any;
  me: any;
  image: any;
  imageUrl: string = appConfig.teeshotConfig.imageUrl;

	slideIndex = 1;
  sliderOpts = {
		initialSlide: 0,
		zoom: {
			maxRatio: 5
    },
    speed: 100,
    width: window.innerWidth
	}
  
  constructor(
    public auth: AuthenticationService,
    public _modal: ModalController,
    public navParams: NavParams,
    public commonS: CommonService,
    public actionSheet: ActionSheetController,
    public userS: UserService,
    public alertConfirm: AlertController
  ) {
    this.user = this.navParams.get('id');

  	this.idx = this.navParams.get('idx');
    this.image = this.navParams.get('image');

    this.sliderOpts.initialSlide = this.idx;
    
    this.observableMe$ = this.commonS.me$.subscribe((me: any) => {
      this.me = me;
    });
  }

  ngOnInit() {  

  }

  ngOnDestroy() {
    this.observableMe$.unsubscribe();
  }

  thumb(picture: any) {
    return `${appConfig.teeshotConfig.imageUrl}/${picture.id}/medium/${picture.image_file_name}`;
  }
  
  change() {
  	this.slides.getActiveIndex().then(index => {
  		this.selected_pic = this.user.pictures[index];
  		this.slideIndex = index + 1;
  	});
  }

  typical(picture: any) {
    const thumb = `${appConfig.teeshotConfig.imageUrl}/${picture.id}/thumb/${picture.image_file_name}`;
    if (thumb == this.me.profile.thumbnail_image) {
      return true;
    } else {
      return false;
    }
  }

  close(flag: boolean = false) {
    this._modal.dismiss(flag);
  }

  async attach() {
    this.close(true);
  }

  updateProfile(picture: any) {
    this.commonS.getStorage('me').then(me => {
      me.profile.thumbnail_image = `${appConfig.teeshotConfig.imageUrl}/${picture.id}/thumb/${picture.image_file_name}`;
      me.profile.profile_image = `${appConfig.teeshotConfig.imageUrl}/${picture.id}/medium/${picture.image_file_name}`;
      
      this.me = me;
      this.commonS.setStorage('me', me);
    });
    this.typical(picture);
  }

  async thumbHold(val: any) {
  	let action = await this.actionSheet.create({
      header: '선택',
      mode: 'md',
      buttons: [{
      	text: '대표사진으로 등록',
        icon: 'person-circle-outline',
        handler: () => {
          let pic = this.user.pictures[val-1];
          
          this.userS.putProfile(pic).then(resolve => {
            if (resolve) {
            }
          });

        }
      }, {
      	text: '삭제하기',
        icon: 'trash-outline',
        handler: async () => {
          let pic = this.user.pictures[val-1];

          const alertconfirm = await this.alertConfirm.create({
            header: '프로필 사진 삭제',
            message: '선택한 이미지를 삭제하시겠습니까?',
            buttons: [
              {
                text: '취소',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                }
              }, {
                text: '확인',
                handler: () => {
                  this.userS.deleteProfile(pic).then(resolve => {
                    if (resolve) {
                      let idx = this.user.pictures.findIndex((r: { id: any }) => { return r.id === pic.id });
                      this.user.pictures.splice(idx, 1);

                      if (!this.user.pictures.length) {
                        this.close();
                      }
                    }
                  });
                }
              }
            ]
          });
      
          await alertconfirm.present();
          
          const thumb = `${appConfig.teeshotConfig.imageUrl}/${pic.id}/thumb/${pic.image_file_name}`;

        }
			}
			]
  	});
  	await action.present();
  }

  async deleteConfirm() {
    const alertconfirm = await this.alertConfirm.create({
      header: '',
      message: '',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: '확인',
          handler: () => {
          }
        }
      ]
    });

    await alertconfirm.present();
  }
}
