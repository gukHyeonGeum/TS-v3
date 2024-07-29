import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/service/alert.service';
import { SettingService } from 'src/app/service/setting.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {

  user: any;
  me: any;
  etcText: boolean = false;
  reportForm: FormGroup;
  reportContent: any;

  constructor(
    public _modal: ModalController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertS: AlertService,
    public settingS: SettingService
  ) { 
    this.user = this.navParams.get('user');
    this.me = this.navParams.get('me');

    this.reportForm = this.formBuilder.group({
      reportNum: ['', Validators.required],
      etcMsg: ['']
    });

    this.reportContent = [
      '', 
      '불쾌감을 주는 언행(욕설, 비방 등)', 
      '가짜 프로필 사진', 
      '허위 가입(성별, 나이 등)', 
      '사생활 침해', 
      '광고, 홍보성 글', 
      '기타'
    ];
  }

  ngOnInit() {}

  change(event: any) {
    if (event.detail.value == 99) this.etcText = true;
    else this.etcText = false;
  }

  submit() {

    let obj = this.reportForm.value;
    let etcMsg: String;

    if (!obj.reportNum) return;

    if (obj.reportNum == 99) {
      if (!obj.etcMsg) {
        this.alertS.alert('알림', '기타 내용을 입력하세요.');
        return;
      }
      etcMsg = obj.etcMsg;
    } else {
      etcMsg = this.reportContent[obj.reportNum];
    }

    this.settingS.setReception(
      {
        form_type: 'report',
        subject: 'etc',
        body: etcMsg,
        target_id: this.user.id
      }
    ).then(resolve => {
      if (resolve) {
        this.close(true);
      }
    });

  }

  close(flag: boolean) {
  	this._modal.dismiss(flag);
  }

}
