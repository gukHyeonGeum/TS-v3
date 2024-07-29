import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { StoreComponent } from 'src/app/modal/store/store.component';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-screen-store',
  templateUrl: './screen-store.component.html',
  styleUrls: ['./screen-store.component.scss'],
})
export class ScreenStoreComponent implements OnInit {
  @Input() data: any;

  constructor(
    private _modal: ModalController,
    public commonS: CommonService
  ) { }

  ngOnInit() {
  }

  store() {
    this.commonS.commonModal({ data: this.data }, StoreComponent);
  }

  close(flag: boolean = false) {
    this._modal.dismiss(flag);
  }

}
