import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { SettingService } from 'src/app/service/setting.service';

@Component({
  selector: 'app-bugs',
  templateUrl: './bugs.component.html',
  styleUrls: ['./bugs.component.scss'],
})
export class BugsComponent implements OnInit {

  bugsForm: FormGroup;

  me: any;

  constructor(
    public auth: AuthenticationService,
    public _modal: ModalController,
    public formBuilder: FormBuilder,
    public settingS: SettingService
  ) { 
    this.bugsForm = this.formBuilder.group({
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
        form_type: 'bug',
        subject: 'etc',
        body: this.bugsForm.value['message']
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
