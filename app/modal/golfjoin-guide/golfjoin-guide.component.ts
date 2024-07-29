import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-golfjoin-guide',
  templateUrl: './golfjoin-guide.component.html',
  styleUrls: ['./golfjoin-guide.component.scss'],
})
export class GolfjoinGuideComponent implements OnInit {
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
