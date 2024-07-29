import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { CommonService } from 'src/app/service/common.service';
import { UserService } from 'src/app/service/user.service';

import { AgreementComponent } from './agreement/agreement.component';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.scss'],
})
export class CertificationComponent implements OnInit {

  certificationForm: FormGroup;
  telecom: any = "01";
  nation: any = "1";
  me: any;
  
  constructor(
    public auth: AuthenticationService,
    public _modal: ModalController,
    public formBuilder: FormBuilder,
    public userS: UserService,
    public storage: Storage,
    public common: CommonService
  ) { 
    this.certificationForm = this.formBuilder.group({
      realname: ['', Validators.required],
      agreement: [false, Validators.requiredTrue],
      birth: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', [ Validators.minLength(10), Validators.required, Validators.pattern('^[0-9]*$') ] ],
      certnumber: [''],
      carrier: [this.telecom],
      nation: [this.nation],
      rid: [''],
    });

    this.auth.getMe().then(me => {
      this.me = me;
      if (this.me.profile.is_certified) {
        this.certificationForm.controls.realname.patchValue(this.me.profile.realname);
        this.certificationForm.controls.birth.patchValue(this.me.profile.dob.replace(/-/g,'').substr(2));
        this.certificationForm.controls.phone.patchValue(this.me.profile.phone);
      }
    });
  }

  ngOnInit() {
    this.auth.fbScreen('phone_certification');
  }

  segmentChanged(event: any) {
    let telecom: any = event.detail.value;
    this.telecom = telecom;
    this.certificationForm.controls.carrier.patchValue(telecom);
  }

  nationChanged(event: any) {
    let nation: any = event.detail.value;
    this.nation = nation;
    this.certificationForm.controls.nation.patchValue(nation);

  }

  requestNumber() {
    this.auth.fbLog('phone_cert_get_number_button', {});
    
    const year = (this.certificationForm.value['gender'] == 1 || this.certificationForm.value['gender'] == 2 || this.certificationForm.value['gender'] == 5 || this.certificationForm.value['gender'] == 6) ? '19' : '20';

    const obj: any = {
      tel: this.certificationForm.value['phone'].replace(/[^0-9]/g,""),
      dob: year + this.certificationForm.value['birth'].replace(/[^0-9]/g,""),
      name: this.certificationForm.value['realname'],
      gender: (this.certificationForm.value['gender'] % 2),
      carrier: this.certificationForm.value['carrier'],
      nation: this.certificationForm.value['nation']
    }

    this.userS.getRequestCertNumber(obj)
      .then(rid => {
        if (rid) {
          this.certificationForm.controls.rid.patchValue(rid);
          this.storage.set('certification', obj);
        }
      }).catch(e => {
        this.close();
      });
    
  }

  certSubmit() {
    this.auth.fbLog('phone_cert_number_check_button', {});

    this.storage.get('certification').then(data => {
      this.userS.setCertification(
        {
          rid: this.certificationForm.value['rid'], 
          tel: data.tel, 
          secret: this.common.pad(this.certificationForm.value['certnumber'], 6),
          chType:'realnameNew',
          realname: data.name,
          dob: data.dob,
          year: data.dob.substr(0,4),
          month: data.dob.substr(4,2),
          day: data.dob.substr(6,2),
          gender: (data.gender % 2) ? 'male' : 'female'
        }
      ).then(res => {
        if (res) {
          this.close();
        }
      });
    });
    
  }

  close() {
    this._modal.dismiss();
  }

  async agreementModal() {
    let modal = await this._modal.create({
      component: AgreementComponent,
    });
    return await modal.present();
  }

}
