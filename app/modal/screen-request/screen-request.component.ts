import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-screen-request',
  templateUrl: './screen-request.component.html',
  styleUrls: ['./screen-request.component.scss'],
})
export class ScreenRequestComponent implements OnInit {
  @Input() type: string = '';
  @Input() me: any = '';
  @Input() data: any = '';
  @Input() rsvp: any = '';
  
  images = 'assets/icon/profile-none.jpg';
  btnTitle: string = '';

  constructor(
    public _modal: ModalController
  ) { }

  ngOnInit() {
    if (this.type == 'request') {
      this.btnTitle = '신청 완료';
    } else if (this.type == 'canceled') {
      this.btnTitle = '신청 취소';
    } else if (this.type == 'revoke') {
      this.btnTitle = '매칭 취소';
    }
  }

  submit() {
    this.close(true);
  }

  close(flag: boolean = false) {
    this._modal.dismiss(flag);
  }

}
