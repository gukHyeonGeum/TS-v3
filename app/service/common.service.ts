import { Injectable } from '@angular/core';
import { ToastController, ModalController, PopoverController, NavController } from '@ionic/angular';

import { Storage } from '@ionic/storage';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  me$ = new BehaviorSubject('');
  badge$ = new BehaviorSubject('');
  selectedIndex$ = new BehaviorSubject(0);
  subscriberMode$ = new BehaviorSubject<any>('');

  constructor(
		public toast: ToastController,
		public storage: Storage,
    public $modal$: ModalController,
    public popover: PopoverController,
    public nav: NavController
	) { }

  convertEmail(email: string) {
    const front = email.split('@')[0];
    return `${front.length > 2 ? `${front.substring(0, 2)}${front.substring(2).replace(/./g, '*')}` : front}@${email.split('@')[1]}`;
  }

	// 자릿수 맞춰서 0 채워넣기
  pad(n, width, z='') {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

	// 생년월일 나이변환
	ageChange(input: any) {
    if (!input) {
      return;
    } else {
        var birth = input.split("-");
        var today = new Date();
        var year	= today.getFullYear()-1; 
        var month	= today.getMonth()+1;
        var day		= today.getDate();
        var ck		= parseInt(birth[0]);

        if(ck == 0) return "";

        var age = year - ck;
        var tmd = parseInt(month+''+day);
        var bmd = parseInt(birth[1]+''+birth[2]);

        if (tmd >= bmd) {
          age++;
        }

        return age;
    }
  }

	// 스토리지 저장
	setStorage(key: string, value: any) {
    this.storage.set(key, value);
  }

  getStorage(key: string) {
    return this.storage.get(key);
  }

  removeStorage(key: string) {
    this.storage.remove(key);
  }

  setDeviceToken(data: any) {
    
  }

	// 토스트 오픈
	async toastMsg(msg: string, pos: any = 'top', dur: number = 1000, color: string = 'dark', css: any = '') {
    const toast = await this.toast.create({
      message: msg,
      position: pos,
      duration: dur,
      color: color,
      cssClass: css
    });
    toast.present();
  }

  async toastMsgOption(data: any, pos: any = 'top', dur: number = 1000) {
    const toast = await this.toast.create({
      header: data.title,
      message: data.body,
      position: pos,
      duration: dur,
      color: 'dark',
      buttons: [
        {
          side: 'end',
          text: '확인',
          handler: () => {
            if (data.id) {
              var page = [data.landing_page, data.id];
            } else {
              var page = [data.landing_page];
            }
            this.nav.navigateRoot(page);
          }
        }
      ]
    });
    toast.present();
  }
	
	async commonModal(obj: any, page: any, css: any = '', backdropDismiss: boolean = true) {
    let modal = await this.$modal$.create({
      component: page,
      componentProps: obj,
      backdropDismiss: backdropDismiss,
      cssClass: css
    });
		await modal.present();
		return modal;
  }

  async commonPopover(component: any, obj: any, ev: any) {
    const popover = await this.popover.create({
      component: component,
      componentProps: obj,
      event: ev,
      translucent: true,
      mode: 'ios'
    });
    await popover.present();
    return popover;
  }
}
