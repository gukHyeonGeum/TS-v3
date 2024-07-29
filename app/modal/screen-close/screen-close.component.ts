import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-screen-close',
  templateUrl: './screen-close.component.html',
  styleUrls: ['./screen-close.component.scss'],
})
export class ScreenCloseComponent implements OnInit {

  constructor(
    private _modal: ModalController
  ) { }

  ngOnInit() {}

  submit() {
    this.close(true);
  }

  close(flag: boolean = false) {
    this._modal.dismiss(flag);
  }

}
