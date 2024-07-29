import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  @Input() message: any;

  constructor(
    private _modal: ModalController
  ) { }

  ngOnInit() {
  }

  close() {
    this._modal.dismiss();
  }

}
