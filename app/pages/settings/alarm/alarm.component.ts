import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CommonService } from 'src/app/service/common.service';
import { PushService } from 'src/app/service/push.service';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.scss'],
})
export class AlarmComponent implements OnInit {

  push: boolean = false;

  constructor(
    public _modal: ModalController,
    public pushS: PushService,
    public commonS: CommonService
  ) { 
    this.commonS.getStorage('alarm').then(data => {
      if (data) {
        this.push = data.push;
      }
    });
  }

  ngOnInit() {}

  alarmToggle(event: any) {
    let checked: boolean = event.detail.checked;

    this.commonS.getStorage('alarm').then(data => {
      data.push = checked;
      this.commonS.setStorage('alarm', data);

      if (checked) {
        this.pushS.pushToken();
      } else {
        this.pushS.deleteDeviceToken();
      }
    });
  }

  close() {
    this._modal.dismiss();
  }

}
