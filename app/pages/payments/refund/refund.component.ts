import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss'],
})
export class RefundComponent implements OnInit {

  constructor(
    public _modal: ModalController
  ) { }

  ngOnInit() {}

  close() {
    this._modal.dismiss();
  }

}
