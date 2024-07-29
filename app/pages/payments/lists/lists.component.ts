import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonInfiniteScroll, IonRefresher } from '@ionic/angular';

import { ViewComponent } from './view/view.component';
import { PaymentService } from 'src/app/service/payment.service';
import { AlertService } from 'src/app/service/alert.service';
import { CommonService } from 'src/app/service/common.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) refresher: IonRefresher;

  private limit = 10;
  private offset = 0;
  private refreshChk: boolean = false;

  lists: any;

  constructor(
    public auth: AuthenticationService,
    public _modal: ModalController,
    public paymentS: PaymentService,
    public alertS: AlertService,
    public commonS: CommonService
  ) { 
  }

  ngOnInit() {
    this.getLists();

    this.auth.fbScreen('payment_list');
  }

  getLists() {
    this.paymentS.getLists({}, this.limit, this.offset)
    .subscribe(res => {
      if (res.success) {
        const data: any = res.data;
        if (this.offset) {
					this.lists = this.lists.concat(data);
					this.infiniteScroll.complete();

					if (data.length < this.limit) {
						this.infiniteScroll.disabled = true;
						this.offset = 0;
					}
				} else {
          this.lists = data;
          
		  		if (this.refreshChk) {
            this.refresher.complete();
            this.refreshChk = false;
          }

		  		if (this.lists.length >= this.limit) {
  					this.infiniteScroll.disabled = false;
  				} else {
  					this.infiniteScroll.disabled = true;
  				}
					
				}
      } else {
        this.alertS.alert('오류', res.message);
      }
    }, e => {
      this.alertS.alert('오류', e.statusText);
    });
  }

  loadData() {
    this.offset = this.offset + this.limit;
    this.getLists();
  }

  doRefresh() {
    this.refreshChk = true;
    this.offset = 0;
    this.getLists();
  }

  close() {
    this._modal.dismiss();
  }

  viewModal(id: any) {
    this.commonS.commonModal({ id }, ViewComponent);
  }
}
