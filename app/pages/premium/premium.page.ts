import { Component, OnInit, ViewChild } from '@angular/core';
import { PremiumService } from 'src/app/service/premium.service';
import { AlertService } from 'src/app/service/alert.service';
import { IonInfiniteScroll, IonRefresher, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/service/common.service';

import { PostComponent } from './post/post.component';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { PremiumGuideComponent } from 'src/app/modal/premium-guide/premium-guide.component';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.page.html',
  styleUrls: ['./premium.page.scss'],
})
export class PremiumPage implements OnInit {
	@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) refresher: IonRefresher;
  
  private limit = 10;
  private offset = 0;
  private refreshChk: boolean = false;

  lists: any;
  
  constructor(
    public auth: AuthenticationService,
    public premiumS: PremiumService,
    public alertS: AlertService,
    public commonS: CommonService,
    public modal: ModalController
  ) { 
    
  }

  ngOnInit() {
    this.getLists();
    
    this.auth.fbScreen('premium_list');
  }

  getLists() {
    this.premiumS.getLists({}, this.limit, this.offset)
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

  help() {
    this.alertS.alert(
      '프리미엄 서비스란?', 
      `<p>
        <span style="font-size: 14px; color: red !important;">프리미엄조인은 초청자가 비용을 부담하여 같이 골프를 즐길 멤버를 모집하는 서비스 입니다.<br><br>

        *신청자의 정보는 초청자만 확인 가능합니다.<br>
        *초청자의 정보는 매칭된 신청자에게만 제공됩니다.<br><br></span>
        
        <span style="font-weight: bold !important;">프리미엄 진행 절차<br></span>
        초청자 등록 → 신청자 신청 → 초청자 매칭 선택 → 매칭 완료<br>
        (매칭 선택시 프리미엄 이용권 필요)
      </p>`
    );
  }

  async create() {
    let modal = await this.modal.create({
      component: PostComponent,
      componentProps: {}
    });
    modal.onDidDismiss().then(detail => {
      if (detail.data) {
        this.doRefresh();
      }
    });
		await modal.present();
  }

  showGuide() {
    this.modal.create({ component: PremiumGuideComponent })
      .then((modal) => modal.present())
  }
}
