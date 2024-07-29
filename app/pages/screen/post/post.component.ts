import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/service/common.service';

import { InvitationComponent } from '../invitation/invitation.component';
import { SearchClubComponent } from 'src/app/modal/search-club/search-club.component';
import { LoadingService } from 'src/app/service/loading.service';
import { ScreenService } from 'src/app/service/screen.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

import { PaymentMoneyComponent } from 'src/app/modal/payment-money/payment-money.component';
import { ScreenGiftmoneyPayComponent } from 'src/app/modal/screen-giftmoney-pay/screen-giftmoney-pay.component';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() data: any;
  @Input() id: any;

  private confirmCheck: boolean = false;

  me: any;
  info: any;
  tags: any = [];
  form: any = { golf_store_name: '검색하세요.', golf_address: '', golf_tel: '' };
  screenForm: FormGroup
  giftMoney: number = 0;
  tagArray = ['스크린+한잔','스크린+식사','스크린 친구','드라이브'];
  btnTitle = '다음';

  backdropShow: boolean = false;

  nowYear = new Date();
  nextDay = new Date().setDate(new Date().getDate());

  date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul'});
  dateTime = new Date(new Date().setHours(new Date().getHours()+2)).toLocaleString('en-US', { timeZone: 'Asia/Seoul'});

  constructor(
    private auth: AuthenticationService,
    private formBuilder: FormBuilder,
    private _modal: ModalController,
    public screenS: ScreenService,
    public commonS: CommonService,
    public loadingS: LoadingService,
    public alertS: AlertService
  ) { 
    this.auth.getMe().then(me => {
      this.me = me;
    }); 

    this.screenForm = this.formBuilder.group({
      golf_store_id: ['', Validators.required],
      golf_store_code: ['', Validators.required],
      golf_store_name: ['', Validators.required],
      golf_store_region_name: ['', Validators.required],
      golf_date: [ this.date, Validators.required ],
      golf_dateTime: [ this.dateTime, Validators.required ],
      golf_partner: [ '', Validators.required ],
      golf_sponsor: [ '', Validators.required ],
      game_fee: [ this.giftMoney, Validators.required ],
      message: [ this.tags ],
      address: [ '' ],
      store_phone: [ '' ]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.storeSet(this.data);
    }

    // 초대장 수정
    if (this.id) {
      this.btnTitle = '수정';

      // 초대장 정보 불러오기
      this.screenS.getView(this.id).then(data => {
        this.info = data;
        this.tags = this.info.message.split(',');

        this.storeSet({
          id: this.info.golf_store_id,
          store_code: this.info.golf_store_code,
          name: this.info.golf_store_name,
          region: this.info.golf_store_region_name,
          address: this.info.address,
          phone: this.info.store_phone
        });

        this.screenForm.patchValue({
          golf_date: this.info.golf_time,
          golf_dateTime: this.info.golf_time,
          golf_partner: this.info.golf_partner,
          golf_sponsor: this.info.golf_sponsor,
          game_fee: this.info.game_fee,
          message: this.tags
        });
      }).catch(() => {});
    } else {
      this.screenS.getTodayCount().then(res => {
        if (!res) {
          this.close();
        }
      });
    }

    this.auth.fbScreen('screen_post');
  }

  // 태그 선택
  selectTag(tag: string, ev: any) {
    if (this.tags.indexOf(tag) === -1) {
      ev.target.setAttribute('color', 'dark');
      this.tags.push(tag);
    } else {
      ev.target.setAttribute('color', 'medium');
      let idx = this.tags.findIndex((r: any) => { return r == tag });
      this.tags.splice(idx, 1);
    }

    this.screenForm.controls['message'].setValue(this.tags);
  }

  // 기프트머니 증가
  plus() {
    if (this.giftMoney >= 1000000) {
      return;
    }

    this.giftMoney += 10000;
    this.screenForm.controls['game_fee'].setValue(this.giftMoney);
  }

  // 기프트머니 감소
  minus() {
    if (this.giftMoney > 0) {
      this.giftMoney -= 10000;
      this.screenForm.controls['game_fee'].setValue(this.giftMoney);
    }
  }

  // 스크린 검색 modal
  searchScreen() {
    this.commonS.commonModal({ type: 'screen' }, SearchClubComponent)
      .then(modal => {
        modal.onDidDismiss().then(detail => {
          if (detail.data) {
            this.storeSet(detail.data);
          }
        });
      });
  }

  helpAlert() {
    let title: string = '';
    let msg: string = '';
    if (this.me.profile.gender == 'male') {
      title = '기프트머니 선물';
      msg = '<p>매칭된 친구에게<br />선물하는 금액이며<br />기프트머니를 충전해야 합니다.</p>';
    } else {
      title = '기프트머니 희망';
      msg = '<p>매칭된 친구에게<br />선물받기를 희망하는 머니이며<br />받고싶은 기프트머니 금액을<br />설정할 수 있습니다.</p>';
    }
    this.alertS.alert(title, msg);
  }

  // 스크린 정보 등록
  storeSet(store: any) {
    this.screenForm.controls['golf_store_id'].setValue(store.id);
    this.screenForm.controls['golf_store_code'].setValue(store.store_code);
    this.screenForm.controls['golf_store_name'].setValue(store.name);
    this.screenForm.controls['golf_store_region_name'].setValue(store.region);
    this.screenForm.controls['address'].setValue(store.address);
    this.screenForm.controls['store_phone'].setValue(store.phone);
    this.form.golf_store_name = store.name;
    this.form.golf_address = store.address;
    this.form.golf_tel = store.phone;
  }

  // 등록 확인 modal
  async confirm() {

    if (this.me.profile.gender == 'male') {
      if (this.me.money < this.giftMoney) {
        this.payConfirmModal();
        return;
      }
    }

    if (this.confirmCheck) {
      this.close(true);
      return;
    }

    let date = new Date();
    date.setHours(date.getHours()+2);
    let golf_time_date = new Date(this.screenForm.value['golf_date']);
    let golf_time_time = new Date(this.screenForm.value['golf_dateTime']);

    let golf_time = new Date(golf_time_date.getFullYear(), golf_time_date.getMonth(), golf_time_date.getDate(), golf_time_time.getHours(), golf_time_time.getMinutes());

    if (date > golf_time) {
      this.alertS.alert('알림', '스크린 날짜는 최소 2시간 이후로 등록하세요.')
      return;
    }

    this.confirmCheck = true;

    if (this.id) {
      const obj = this.screenForm.value;
      obj.id = this.id;
      this.screenS.putCreate(obj)
        .then(() => {
          this.close(true);
        }).catch(() => {
          this.confirmCheck = false;
        });
    } else {
    
      let modals = await this._modal.create({
        component: InvitationComponent,
        componentProps: {
          type: '',
          poster: {
            profile_image: this.me.profile.thumbnail_image,
            username: this.me.username,
            gender: this.me.profile.gender
          },
          data: this.screenForm.value
        }
      });
      modals.onDidDismiss().then(detail => {
        if (detail.data) {
          this.screenS.setCreate(this.screenForm.value)
            .then(() => {
              this.commonS.toastMsg('<div>등록되었습니다.</div>', 'top', 2000, undefined, 'ion-margin-top ion-text-center');
              this.close(true);
            }).catch(() => {
              this.confirmCheck = false;
            }).finally(() => {
              this.loadingS.hide();
            });
        } else {
          this.confirmCheck = false;
        }
      });
      await modals.present();

    }

  }

  // 기프트충전 확인 modal
  async payConfirmModal() {
    this.backdropShow = true;
    let modal = await this._modal.create({
      component: ScreenGiftmoneyPayComponent,
      componentProps: {
        type: 'post',
        data: this.screenForm.value,
        me: this.me
      },
      cssClass: 'auto-height'
    });
    modal.onWillDismiss().then(detail => {
      if (detail.data) {
        this.payMoneyModal();
      }
      this.backdropShow = false;
    });
    await modal.present();
  }

  // 기프트충전 modal
  async payMoneyModal() {
    let modal = await this._modal.create({
      component: PaymentMoneyComponent,
      componentProps: {
        giftmoney: this.screenForm.value['game_fee']
      }
    });
    modal.onWillDismiss().then(detail => {
      if (detail.data) {
        this.auth.getMe().then(me => {
          this.me = me;
        }); 
      }
    });
		await modal.present();
  }
  
  // modal 닫기
  close(flag: boolean = false) {
    this._modal.dismiss(flag);
  }

}
