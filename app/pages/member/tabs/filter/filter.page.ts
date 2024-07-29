import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from 'src/app/service/member.service';
import { AlertService } from 'src/app/service/alert.service';

import { ViewComponent } from './view/view.component';
import { IonSegment, IonSegmentButton, ModalController } from '@ionic/angular';
import { VerifyService } from 'src/app/service/verify.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit, AfterViewInit {
  @ViewChild(IonSegment) segment: IonSegment;

  filterForm: FormGroup;

  constructor(
    public auth: AuthenticationService,
    public formBuilder: FormBuilder,
    public memberS: MemberService,
    public commonS: CommonService,
    public alertS: AlertService,
    public modal: ModalController,
    public verifyS: VerifyService,
    private router: Router
  ) { 
    this.filterForm = this.formBuilder.group({
      gender: [ '', Validators.required ],
      age: [ {lower: 20, upper: 60} ],
      distance: [ 0 ],
      golf_score: [ 0 ],
      golf_year: [ 0 ],
      golf_frequency: [ 0 ],
      golf_oversea: [ 0 ],
    });
    const promiseList = [
      this.commonS.getStorage('kr.co.teeshot.filter.is_filtered'), 
      this.commonS.getStorage('kr.co.teeshot.filter.obj'),
    ];
    Promise.all(promiseList).then((values) => {
      if (values[0]) {
        this.verifyS.isExpire().then(() => {
          const obj = JSON.parse(values[1]);
          if (obj) {
            this.router.navigateByUrl('/member/filter/filtered', { replaceUrl: true, state: { obj: JSON.parse(values[1]) } });
          }
        });
      } else {
        if (values[1]) {
          const obj = JSON.parse(values[1]);
          this.init(obj);
        }
      }
    });
  }

  private init(obj: any) {
    if (obj) {
      this.filterForm = this.formBuilder.group({
        gender: [ obj?.sex ?? '', Validators.required ],
        age: [ {lower: obj?.filter_s_age ?? 20, upper: obj?.filter_e_age ?? 60} ],
        distance: [ obj?.locations ?? 0 ],
        golf_score: [ obj?.golf_score ?? 0 ],
        golf_year: [ obj?.golf_year ?? 0 ],
        golf_frequency: [ obj?.golf_frequency ?? 0 ],
        golf_oversea: [ obj?.golf_oversea ?? 0 ],
      });
      if (this.filterForm.value['gender'])
        this.segment.value = this.filterForm.value['gender'];
    }
  }

  ngOnInit() {
    this.auth.fbScreen('member_filter');
  }

  ngAfterViewInit(): void {
    const obj = this.router.getCurrentNavigation().extras.state?.obj;
    this.init(obj);
  }

  segmentButtonClicked(e: any) {
    this.filterForm.controls['gender'].setValue(e.detail.value);
  }

  search() {
    let obj = {
      limit:200,
      offset:0,
      type:'preference', 
      sex: this.filterForm.value['gender'], 
      filter_s_age: this.filterForm.value['age']['lower'], 
      filter_e_age: this.filterForm.value['age']['upper'], 
      locations: this.filterForm.value['distance'], 
      golf_score: parseInt(this.filterForm.value['golf_score']), 
      golf_year: parseInt(this.filterForm.value['golf_year']), 
      golf_frequency: parseInt(this.filterForm.value['golf_frequency']), 
      golf_oversea: parseInt(this.filterForm.value['golf_oversea'])
    }

    this.verifyS.isCertPhone().then(() => {
      this.verifyS.isProfile().then(() => {
        this.verifyS.isExpire().then(() => {
          this.commonS.setStorage('kr.co.teeshot.filter.obj', JSON.stringify(obj));
          this.router.navigateByUrl('/member/filter/filtered', { replaceUrl: true, state: { obj } })
        }).catch(() => {});
      }).catch(() => {});
    }).catch(() => {});
  }

  preference() {
    this.filterForm.controls['golf_score'].setValue(0);
    this.filterForm.controls['golf_year'].setValue(0);
    this.filterForm.controls['golf_frequency'].setValue(0);
    this.filterForm.controls['golf_oversea'].setValue(0);
  }

  async filterView(obj: any) {
    let modal = await this.modal.create({
      component: ViewComponent,
      componentProps: { obj }
    });
		await modal.present();
  }

}
