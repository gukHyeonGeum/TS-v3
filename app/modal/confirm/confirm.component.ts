import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent implements OnInit {
  @Input() data: any;

  constructor(
    private _modal: ModalController
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  confirm(answer: string) {
    this._modal.dismiss(answer);
  }

}
