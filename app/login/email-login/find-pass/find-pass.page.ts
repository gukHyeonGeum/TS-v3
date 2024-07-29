import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/service/login.service';
import { LoadingService } from 'src/app/service/loading.service';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-find-pass',
  templateUrl: './find-pass.page.html',
  styleUrls: ['./find-pass.page.scss'],
})
export class FindPassPage implements OnInit {

  findPassPhoneForm: FormGroup;
  findPassEmailForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public loginS: LoginService,
    public loadingS: LoadingService,
    public alertS: AlertService
  ) { 
    this.findPassPhoneForm = this.formBuilder.group({
      realname: ['', Validators.required],
      phone: ['', Validators.required]
    });

    this.findPassEmailForm = this.formBuilder.group({
      email: ['', Validators.required],
      domain: ['', Validators.required],
      selEmail: ['']
    });
  }

  ngOnInit() {
  }

  findPassPhone() {
    this.loadingS.show();
    this.loginS.getFindPassPhone(
        {
          name: this.findPassPhoneForm.value['realname'],
          phone: this.findPassPhoneForm.value['phone']
        }
      ).subscribe(res => {
        this.loadingS.hide();
        if (res.success) {
          this.alertS.alert('알림', '등록된 폰으로 패스워드를 전송하였습니다.');
        } else {
          this.alertS.alert('오류', res.message);
        }
      }, e => {
        this.alertS.alert('오류', e);
        this.loadingS.hide();
      });
  }

  findPassEmail() {
    this.loadingS.show();
    this.loginS.getFindPassEmail(
      {
        email: this.findPassEmailForm.value['email'],
        domain: this.findPassEmailForm.value['domain']
      }
    ).subscribe(res => {
      this.loadingS.hide();
      if (res.success) {
        this.alertS.alert('알림', '등록된 이메일로 패스워드를 전송하였습니다.');
      } else {
        this.alertS.alert('오류', res.message);
      }
    }, e => {
      this.alertS.alert('오류', e);
      this.loadingS.hide();
    });
  }

  selEmailChange(event) {
    this.findPassEmailForm.controls.domain.patchValue(event.detail.value);
  }

}
