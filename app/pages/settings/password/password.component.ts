import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingService } from 'src/app/service/setting.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {

  passwordForm: FormGroup;

  constructor(
    public _modal: ModalController,
    public formBuilder: FormBuilder,
    public setttingS: SettingService
  ) { 
    this.passwordForm = this.formBuilder.group({
      oldPassword: [ '', Validators.required ],
      newPassword: [ '', Validators.required ]
    });
  }

  ngOnInit() {}

  change() {
    this.setttingS.putPassword(
      {
        old_password: this.passwordForm.value['oldPassword'],
        new_password: this.passwordForm.value['newPassword'],
      }
    ).then(resolve => {
      if (resolve) {
        this.close();
      }
    })
  }

  close() {
    this._modal.dismiss();
  }

}
