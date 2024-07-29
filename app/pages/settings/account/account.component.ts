import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ModalController, Platform } from '@ionic/angular';

import { SettingService } from 'src/app/service/setting.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CommonService } from 'src/app/service/common.service';
import { AlertService } from 'src/app/service/alert.service';

import { DropComponent } from 'src/app/pages/settings/account/drop/drop.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  dropForm: FormGroup;
  me: any;
  joinType: any;
  dropTitle = '탈퇴하기';
  isApple = false;

  constructor(
    public auth: AuthenticationService,
    public _modal: ModalController,
    public settingS: SettingService,
    public formBuilder: FormBuilder,
    public commonS: CommonService,
    public alertS: AlertService,
    public plt: Platform
  ) { 
    this.auth.getMe().then(me => {
      this.me = me;
    });

    this.settingS.getJoinType()
      .then(resolve => {
        resolve.forEach(v => {
          if (this.plt.is('ios') && v.provider_type === 'apple') {
            this.dropTitle = 'Apple ID 삭제 (탈퇴하기)';
            this.isApple = true;
          }
        });
        this.joinType = resolve;
      }).catch(() => {});

    this.dropForm = this.formBuilder.group({
      reason: [ '', Validators.required ]
    });
  }

  ngOnInit() {}

  drop(reason: any) {
    this.alertS.confirm({
      header: '탈퇴안내',
      message: '탈퇴 시 30일간 재가입이 불가능합니다.',
      cancelText: '취소',
      okText: '확인'
    }).then(confirm => {
      if (confirm) {
        if (this.isApple) {
          this.settingS.deleteAppleId().then(res => {
            if (res) {
              this.dropNext(reason);    
            } else {
              this.close();
            }
          });
        } else {
          this.dropNext(reason);
        }
      }
    });
    
  }

  dropNext(reason: any) {
    this.settingS.putDrop({ reason })
      .then(resolve => {
        if (resolve) {
          this.close();
        }
      });
  }

  dropAppleId() {
    this.settingS.deleteAppleId();
  }

  close() {
    this._modal.dismiss();
  }

  async dropModal(isApple: any) {
    let modal = await this._modal.create({
      component: DropComponent,
      componentProps: { isApple }
    });
		await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.drop(data);
    }
  }

}
