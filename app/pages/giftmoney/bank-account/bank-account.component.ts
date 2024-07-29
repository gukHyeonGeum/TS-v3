import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss'],
})
export class BankAccountComponent implements OnInit {
  @Input() bankInfo: any;

  bankList: any = ['국민은행', '기업은행', '농협은행', '신한은행', '우리은행', '하나은행', 'SC제일은행', '한국씨티은행', '새마을금고', '산업은행', '전북은행', '광주은행', '경남은행', '부산은행', '대구은행', '제주은행', '카카오뱅크', '케이뱅크'];

  bankForm: FormGroup;

  constructor(
    private _modal: ModalController,
    private formBuilder: FormBuilder,
  ) { 
    this.bankForm = this.formBuilder.group({
      accountNumber: ['', Validators.required],
      accountName: ['', Validators.required],
      accountBank: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.bankInfo) {
      this.bankForm.patchValue({
        accountNumber: this.bankInfo.accountNumber,
        accountName: this.bankInfo.accountName,
        accountBank: this.bankInfo.accountBank,
      });
    }
  }

  selected(val: string) {
    this.bankForm.controls.accountBank.setValue(val);
  }

  submit() {
    console.log(this.bankForm.value);
    this._modal.dismiss(this.bankForm.value);
  }

  close() {
    this._modal.dismiss();
  }

}
