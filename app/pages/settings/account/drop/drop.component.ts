import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-drop',
  templateUrl: './drop.component.html',
  styleUrls: ['./drop.component.scss'],
})
export class DropComponent implements OnInit {

  me: any;
  dropForm: FormGroup;
  isApple: any;

  constructor(
    public auth: AuthenticationService,
    public _modal: ModalController,
    public formBuilder: FormBuilder,
    public navParams: NavParams
  ) { 
    this.isApple = this.navParams.get('isApple');

    this.auth.getMe().then(me => {
      this.me = me;
    });

    this.dropForm = this.formBuilder.group({
      reason: [ '', Validators.required ],
      agreement: [ false, Validators.requiredTrue ]
    });
  }

  ngOnInit() {}

  dropOk() {
    this.close(this.dropForm.controls['reason'].value);
  }

  close(reason: any = '') {
    this._modal.dismiss(reason);
  }

}
