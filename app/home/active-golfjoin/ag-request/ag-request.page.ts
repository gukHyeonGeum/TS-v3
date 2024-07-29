import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonRefresher } from '@ionic/angular';
import { GolfjoinService } from 'src/app/service/golfjoin.service';
import { AlertService } from 'src/app/service/alert.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-ag-request',
  templateUrl: './ag-request.page.html',
  styleUrls: ['./ag-request.page.scss'],
})
export class AgRequestPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) refresher: IonRefresher;

  private limit = 10;
  private offset = 0;
  private refreshChk: boolean = false;
  
  me: any;
  lists: any;
  images = 'assets/icon/profile-none.jpg';
  
  constructor(
    public auth: AuthenticationService,
    public golfjoinS: GolfjoinService,
    public alertS: AlertService
  ) { }

  ngOnInit() {
    this.auth.fbScreen('golfjoin_request_list');
    this.getLists();
  }

  getLists() {
    this.golfjoinS.getRequest({ type: 'request' }, this.limit, this.offset)
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

  imgSrc(src: any) {
    let str = src.replace('/images/avatars/avatar-unknown.jpg', this.images);
    return str;
  }

  imgError(event: any) {
    event.target.src = this.images;
  }
}
