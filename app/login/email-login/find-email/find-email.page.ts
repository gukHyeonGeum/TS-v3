import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/service/login.service';
import { AlertService } from 'src/app/service/alert.service';
import { LoadingService } from 'src/app/service/loading.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-find-email',
  templateUrl: './find-email.page.html',
  styleUrls: ['./find-email.page.scss'],
})
export class FindEmailPage implements OnInit {

  findNickForm: FormGroup;
  findUserForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public loginS: LoginService,
    public alertS: AlertService,
    public loadingS: LoadingService,
    public commonS: CommonService
  ) {

    this.findNickForm = this.formBuilder.group({
      nickname: ['', Validators.required]
    });

    this.findUserForm = this.formBuilder.group({
      realname: ['', Validators.required],
      birth: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  findNick() {
    this.loadingS.show();
    this.loginS.getFindEmailNick({ nickname: this.findNickForm.value['nickname'] })
      .subscribe(res => {
        this.loadingS.hide();
        if (res.success) {
          this.alertS.alert('알림', '아이디는 ' + res.user.email + '입니다.');
        } else {
          this.alertS.alert('오류', res.message);
        }
      }, e => {
        this.loadingS.hide();
      });
  }

  findUser() {
    const birth = new Date(this.findUserForm.value['birth']);
    
    this.loadingS.show();
    this.loginS.getFindEmailUser(
        {
          realname: this.findUserForm.value['realname'], 
					year: birth.getFullYear(), 
					month: this.commonS.pad(birth.getMonth()+1, 2), 
					day: this.commonS.pad(birth.getDate(), 2), 
					gender: this.findUserForm.value['gender'],
					phone: this.findUserForm.value['phone']
        }
      ).subscribe(res => {
        this.loadingS.hide();
        if (res.success) {
          this.alertS.alert('알림', '아이디는 ' + res.user.email + '입니다.');
        } else {
          this.alertS.alert('오류', res.message);
        }
      }, e => {
        this.loadingS.hide();
      });
  }

}
