import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {

  eventImg = "https://teeshot-photo.s3-ap-northeast-1.amazonaws.com/etc/event_20210301.jpg";

  date = new Date();
  day = 1;
  eventType = 'screen';

  constructor(
    private _modal: ModalController,
    private nav: NavController,
    public commonS: CommonService
  ) { 
  }

  ngOnInit() {
  }

  routeLink() {
    this.nav.navigateRoot('screen/map');
    this.close();
  }

  dayClose() {
    let lastDay = this.date.setHours(23,59,59,59);

    this.commonS.setStorage('eventPopup', 
      [
        {
          type: this.eventType,
          date: new Date(lastDay)
        }
      ]
    );
    this.close();
  }

  close(flag: boolean = false) {
    this._modal.dismiss(flag);
  }
}
