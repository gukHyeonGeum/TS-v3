import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Device } from '@ionic-native/device/ngx';

import { AlertService } from 'src/app/service/alert.service';
import { CommonService } from 'src/app/service/common.service';
import { LoginService } from 'src/app/service/login.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

let time: any;

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.page.html',
  styleUrls: ['./phone-login.page.scss'],
})
export class PhoneLoginPage implements OnInit {

	phoneLoginForm: FormGroup;
  certNumberForm: FormGroup;
  
  phone: any;
  isSms: any = false;
  randNumber: any;
  expired: boolean = false;
	timeing: boolean = false;
	
  constructor(
		public auth: AuthenticationService,
    public _modal: ModalController,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public alertS: AlertService,
    public commonS: CommonService,
    public loginS: LoginService,
		public nav: NavController,
		public route: ActivatedRoute,
		public userS: UserService,
		private device: Device,
  ) { 
		this.route.queryParams.subscribe(params => {
			
			if (params.phone) {
				this.phone = params.phone;
				this.phoneLoginForm.controls.phone.patchValue(params.phone);
			}
		});

    this.phoneLoginForm = this.formBuilder.group({
      phone: ['', [Validators.minLength(10), Validators.required, Validators.pattern('^[0-9]*$')] ]
    });

    this.certNumberForm = this.formBuilder.group({
  		certNumber: ['', [Validators.minLength(4), Validators.maxLength(4), Validators.required, Validators.pattern('^[0-9]*$')] ]
  	});
	}

  ngOnInit() {
		this.auth.fbLog('phone_login_button_click', { device_uuid: this.device.uuid });
		this.auth.fbScreen('phone_login');
	}

	ionViewWillLeave () {
		clearInterval(time);
	}
	
	isPhoneCheck() {

		if (!this.phoneLoginForm.value['phone']) {
			return false;
		} else {
			this.loginS.getIsPhone({ phone: this.phoneLoginForm.value['phone'] })
				.then(resolve => {
					if (resolve) {
						this.send();
					}
				});

			this.auth.fbLog('get_verification_number_button', {});
		}
	}

  async send() {
  	if (!this.phoneLoginForm.value['phone']) {
  		return false;
  	} else {

			const alert = await this.alertController.create({
				header: '전화번호 인증',
				message: '문자로 인증번호를 보냅니다.',
				buttons: [
					{
						text: '취소',
						role: 'cancel',
						cssClass: 'secondary',
						handler: () => {
							this.auth.fbLog('cancel_phone_number_verification', { });
						}
					}, {
						text: '확인',
						handler: () => {

							this.certNumberForm.controls.certNumber.patchValue('');

							this.loginS.setCertificationNumber(this.phoneLoginForm.value['phone']).then(randNumber => {
								this.isSms = true;
								this.randNumber = randNumber;

								this.expired = false;

								this.startTimer().then(() => {
									this.randNumber = null;
									this.expired = true;
									this.timeing = false;
								});
							});

							this.auth.fbLog('accept_phone_number_verification', { });
						}
					}
				]
			});

			await alert.present();

	  }
  	
  }

  confirmation() {
    if (!this.randNumber) {
      this.alertS.alert('오류', '인증번호 전송 후 로그인하세요');
			this.certNumberForm.controls.certNumber.patchValue('');
      return;
    }

		this.auth.fbLog('certification_number_check_button', { });

  	if (this.randNumber == this.certNumberForm.value['certNumber']) {
      this.loginS.getPhoneLogin({ phone: this.phoneLoginForm.value['phone'] });
  	} else {
      this.alertS.alert('인증번호 오류', '인증번호를 다시 입력하세요.');
			this.certNumberForm.controls.certNumber.patchValue('');
			this.auth.fbLog('certification_number_error', { });
  	}
  }

  startTimer(): Promise<any> {
    return new Promise(resolve => {
      this.timeing = true;

      let countdown: any = 120;
      document.getElementById('countdown-number').innerHTML = countdown;

      time = setInterval(() => {
        // countdown = countdown-- <= 0 ? 5 : countdown;
        countdown--;
        document.getElementById('countdown-number').innerHTML = countdown;

        if (countdown==0) {
          clearInterval(time);
          resolve(true);
        }
      }, 1000);
    });
  };

}
