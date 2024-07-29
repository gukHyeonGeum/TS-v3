import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    public alertCtrl: AlertController
  ) { }

  async alert(title: any, message: any) {

    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: ['확인']
    });
    await alert.present();
    return alert;
    
  }

  confirm(obj: { header: any, message: any, cancelText: any, okText: any }): Promise<any> {
    return new Promise(async resolve => {
      const confirm = await this.alertCtrl.create({
        header: obj.header,
        message: obj.message,
        buttons: [
          {
            text: obj.cancelText,
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve(false);
            }
          }, {
            text: obj.okText,
            role: 'ok',
            handler: data => {
              resolve(true);
            }
          }
        ]
      });
      await confirm.present();
      return confirm;
    });
  }

  async nicknameChange(title: any, message: any) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: '새 닉네임 입력'
        }
      ],
      cssClass: 'nick-change',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: '확인',
          role: 'ok',
          handler: data => {

          }
        }
      ]
    });

    await alert.present();
    return alert;
  }

  alertHelp(type: String) {
    
    let title: any;
    let message: any;

    if (type == 'freeOption') {
      title = '무료초대 옵션';
      message = '<div class="ion-text-left"><p>라운드+(커피, 식사,소주한잔)</p><p>※ 상기 이외의 사항은 상호간 협의에 의함</p></div>';
    } else if (type == 'golfCreate') {
      title = '골프장 등록';
      message = `<div class="ion-text-left"><p>• 부킹예정도 등록가능합니다.</p><p>• 등록후에 '수정'으로 변경하세요</p></div>`;
    } else if (type == 'premiumApplyWaiting') {
      title = '신청 대기중입니다';
      message = `
        <div>
          <p>※ 프로필 사진등록</p>
          <p class="ion-text-left">① 회원님의 프로필 사진이 있는지 확인중입니다.</p>
          <p class="ion-text-left">② 프로필에 <strong><u>사진을 등록</u></strong>해야 하며, 없으면 승인되지 않습니다. (얼굴,전신 각1장)</p>
          <p class="ion-text-left">③ <u>무료로 초대하는 혜택이기 때문에</u>, 초청자가 프로필 사진을 보고 선택할 수 있어야 합니다.</p>
          <p>(다른회원 비공개)</p>
        </div>
        <div class="ion-padding-top">
          <p>※ 비공개 원칙 & 매칭</p>
          <p class="ion-text-left">① 다른회원은 볼 수 없도록 <strong><u>비공개로 진행</u></strong>됩니다.</p>
          <p class="ion-text-left">② 멤버로 선택되어야 <strong>"매칭"</strong>이 되며 멤버끼리 휴대폰번호가 통지됩니다.</p>
          <p class="ion-text-left">③ 통화후에 서로 조건이 맞지 않을 때에는 "멤버 취소"가 가능합니다.</p>
        </div>
      `;
    }

    this.alert(title, message);
  }
}
