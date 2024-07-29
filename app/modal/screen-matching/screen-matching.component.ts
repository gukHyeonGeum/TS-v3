import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-screen-matching',
  templateUrl: './screen-matching.component.html',
  styleUrls: ['./screen-matching.component.scss'],
})
export class ScreenMatchingComponent implements OnInit {
  @Input() type: string = '';
  @Input() data: any = '';

  images = 'assets/icon/profile-none.jpg';
  btnTitle = '';

  constructor(
    public _modal: ModalController
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  submit() {
    this.close(true);
  }

  close(flag: boolean = false) {
    this._modal.dismiss(flag);
  }

}
