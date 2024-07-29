import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonRefresher, ModalController } from '@ionic/angular';

import { ExchangeComponent } from './exchange/exchange.component';
import { PaymentService } from 'src/app/service/payment.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-giftmoney',
  templateUrl: './giftmoney.page.html',
  styleUrls: ['./giftmoney.page.scss'],
})
export class GiftmoneyPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) refresher: IonRefresher;

  private refreshChk: boolean = false;

  lists: any;
  pages: any = 0;

  constructor(
    private modal: ModalController,
    public auth: AuthenticationService,
    public paymentS: PaymentService
  ) { }

  ngOnInit() {
    this.getLists();

    this.auth.fbScreen('giftmoney_list');
  }

  // 리스트
  getLists() {
    this.paymentS.getGiftmoneyExchange(this.pages).then(res => {
      const data: any = res.data;

      if (this.pages > 0) {
        this.lists = this.lists.concat(data);

        if (!data.length) {
          this.pages = 0;
          this.infiniteScroll.disabled = true;
        }

      } else {
        this.lists = data;

        if (this.refreshChk) {
          this.refresher.complete();
          this.refreshChk = false;
        }
      }
    });
  }

  // 리스트 새로고침
  doRefresh() {
    this.refreshChk = true;
    this.infiniteScroll.disabled = false;
    this.pages = 0;
    this.getLists();
  }

  // 리스트 더보기
  loadData() {
    if (this.lists) {
      this.pages++;
      this.getLists();
    }
    this.infiniteScroll.complete();
  }

  // 기프트머니 교환 modal
  async exchangeModal() {
    let modal = await this.modal.create({
      component: ExchangeComponent,
      componentProps: { }
    });
    modal.onWillDismiss().then(detail => {
      console.log(detail.data);
      if (detail.data) {
        this.doRefresh();
      }
    });
		await modal.present();
  }

}
