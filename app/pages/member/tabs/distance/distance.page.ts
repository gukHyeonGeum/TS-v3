import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonRefresher, NavController } from '@ionic/angular';
import { ProfileService } from 'src/app/service/profile.service';
import { MemberService } from 'src/app/service/member.service';
import { AlertService } from 'src/app/service/alert.service';
import { LoadingService } from 'src/app/service/loading.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-distance',
  templateUrl: './distance.page.html',
  styleUrls: ['./distance.page.scss'],
})
export class DistancePage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) refresher: IonRefresher;
  @ViewChild('lblBottomGuide', { read: ElementRef }) lblBottomGuide: ElementRef;

  private limit = 48;
  private offset = 0;
  private refreshChk: boolean = false;

  me: any;
  lists: any;
  images = 'assets/icon/profile-none.jpg';

  constructor(
    public auth: AuthenticationService,
    public profileS: ProfileService,
    public memberS: MemberService,
    public alertS: AlertService,
    public loadingS: LoadingService,
    public nav: NavController
  ) { 
    this.auth.getMe().then(me => {
      this.me = me;
    }); 
  }

  ngOnInit() {
    this.getLists();

    this.auth.fbScreen('member_distance_list');
  }

  getLists() {
    this.memberS.getLists({ type: 'distance'}, this.limit, this.offset)
    .subscribe(res => {
      if (res.success) {
        const data: any = res.data;
        if (this.offset) {
					this.lists = this.lists.concat(data);
					this.infiniteScroll.complete();

					if (data.length < this.limit) {
            this.lblBottomGuide.nativeElement.style.display = 'block';
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

  imgError(event: any) {
    event.target.src = this.images;
  }  

  profile(target: any) {
    let obj: any = {
      id: this.me.id,
      target
    }
    this.profileS.profileOpen(obj).then(modal => {
    });
  }

}
