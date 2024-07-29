import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.page.html',
  styleUrls: ['./email-login.page.scss'],
})
export class EmailLoginPage implements OnInit {

  findPassForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public loginS: LoginService
  ) {
    this.findPassForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  emailLogin() {
    this.loginS.getEmailLogin({ email: this.findPassForm.value['email'], password: this.findPassForm.value['password'] });
  }
}
