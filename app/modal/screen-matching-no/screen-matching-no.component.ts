import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-screen-matching-no',
  templateUrl: './screen-matching-no.component.html',
  styleUrls: ['./screen-matching-no.component.scss'],
})
export class ScreenMatchingNoComponent implements OnInit {

  constructor(
    private _modal: ModalController
  ) { }

  ngOnInit() {}

  close() {
    this._modal.dismiss();
  }

}
