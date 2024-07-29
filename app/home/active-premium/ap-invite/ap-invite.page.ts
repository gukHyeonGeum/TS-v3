import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonRefresher } from '@ionic/angular';
import { PremiumService } from 'src/app/service/premium.service';
import { AlertService } from 'src/app/service/alert.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-ap-invite',
  templateUrl: './ap-invite.page.html',
  styleUrls: ['./ap-invite.page.scss'],
})
export class ApInvitePage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) refresher: IonRefresher;
  
  private limit = 10;
  private offset = 0;
  private refreshChk: boolean = false;

  lists: any;
  
  constructor(
    public auth: AuthenticationService,
    public premiumS: PremiumService,
    public alertS: AlertService
  ) { }

  ngOnInit() {
    this.auth.fbScreen('premium_invite_list');
    this.getLists();
  }

  getLists() {
    this.premiumS.getLists({ type: 'invite' }, this.limit, this.offset)
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

}
