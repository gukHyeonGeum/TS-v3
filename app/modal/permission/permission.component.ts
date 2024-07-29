import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss'],
})
export class PermissionComponent implements OnInit {
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
