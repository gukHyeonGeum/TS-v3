import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss'],
})
export class UsernameComponent implements OnInit {

  usernameForm: FormGroup;

  me: any;
  
  constructor(
    public auth: AuthenticationService,
    public _modal: ModalController,
    public formBuilder: FormBuilder
  ) { 
    this.usernameForm = this.formBuilder.group({
      username: [ '', Validators.required ]
    });

    this.auth.getMe().then(me => {
      this.me = me;
    }); 
  }

  ngOnInit() {}

  change() {
    
  }

  close() {
    this._modal.dismiss();
  }

}
