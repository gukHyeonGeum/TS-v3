import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-message-room-menu',
  templateUrl: './message-room-menu.component.html',
  styleUrls: ['./message-room-menu.component.scss'],
})
export class MessageRoomMenuComponent implements OnInit {
  
  target: any;

  constructor(
    public navParams: NavParams,
    public popover: PopoverController
  ) {
    this.target = this.navParams.get('target');
  }

  ngOnInit() {}

  report() {
    this.popover.dismiss(true, 'report');
  }

  block() {
    this.popover.dismiss(true, 'block');
  }

  out() {
    this.popover.dismiss(true, 'out');
  }

}
