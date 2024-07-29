import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-screen-giftmoney-pay',
  templateUrl: './screen-giftmoney-pay.component.html',
  styleUrls: ['./screen-giftmoney-pay.component.scss'],
})
export class ScreenGiftmoneyPayComponent implements OnInit {
  @Input() type: string = '';
  @Input() data: any;
  @Input() me: any;

  description: any;
  
  constructor(
    public _modal: ModalController
  ) { }

  ngOnInit() {
    if (this.type == 'post') {
      this.description = '선물';
    } else if (this.type == 'ask') {
      this.description = '희망';
    }
  }

  submit() {
    this.close(true);
  }

  close(flag: boolean = false) {
    this._modal.dismiss(flag);
  }

}
