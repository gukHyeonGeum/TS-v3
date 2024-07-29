import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-premium-guide',
  templateUrl: './premium-guide.component.html',
  styleUrls: ['./premium-guide.component.scss'],
})
export class PremiumGuideComponent implements OnInit {
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
