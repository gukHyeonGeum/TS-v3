import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-screen-guide',
  templateUrl: './screen-guide.component.html',
  styleUrls: ['./screen-guide.component.scss'],
})
export class ScreenGuideComponent implements OnInit {
  constructor(
    public modal: ModalController
  ) {
  }

  ngOnInit() {
  }

  close() {
    this.modal.dismiss();  
  }
}
