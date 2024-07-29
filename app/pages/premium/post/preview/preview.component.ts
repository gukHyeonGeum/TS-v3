import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})

export class PreviewComponent implements OnInit {

  data: any;
  time: any = new Date();

  constructor(
    public _modal: ModalController,
    public navParams: NavParams
  ) { 
    this.data = this.navParams.get('data');
  }

  ngOnInit() {}

  close() {
    this._modal.dismiss();
  }

}
