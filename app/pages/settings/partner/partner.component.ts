import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { SettingService } from 'src/app/service/setting.service';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss'],
})
export class PartnerComponent implements OnInit {

  partnerForm: FormGroup;

  me: any;

  constructor(
    public auth: AuthenticationService,
    public _modal: ModalController,
    public formBuilder: FormBuilder,
    public settingS: SettingService
  ) { 
    this.partnerForm = this.formBuilder.group({
      message: [ '', Validators.required ]
    });

    this.auth.getMe().then(me => {
      this.me = me;
    }); 
  }

  ngOnInit() {}

  submit() {
    this.settingS.setReception(
      {
        form_type: 'partner',
        subject: 'etc',
        body: this.partnerForm.value['message']
      }
    ).then(resolve => {
      if (resolve) {
        this.close();
      }
    });
  }

  close() {
    this._modal.dismiss();
  }

}
