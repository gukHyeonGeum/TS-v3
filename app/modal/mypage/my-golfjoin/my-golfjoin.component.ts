import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonInfiniteScroll, IonRefresher } from '@ionic/angular';
import { GolfjoinService } from 'src/app/service/golfjoin.service';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-my-golfjoin',
  templateUrl: './my-golfjoin.component.html',
  styleUrls: ['./my-golfjoin.component.scss'],
})
export class MyGolfjoinComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) refresher: IonRefresher;

  private limit = 10;
  private offset = 0;
  private refreshChk: boolean = false;

  lists: any;
  whichPage: string = '';
  title: string = '';
  images = 'assets/icon/profile-none.jpg';

  constructor(
    public _modal: ModalController,
    public golfjoinS: GolfjoinService,
    public alertS: AlertService
  ) { }

  ngOnInit() {
    this.segmentChanged({ detail: { value: 'invite' } });
  }

  segmentChanged(e: any) {
    this.whichPage = e.detail.value;
    if (this.whichPage == 'invite') {
      this.title = '등록';
    } else {
      this.title = '신청';
    }

    this.getLists();
  }

  getLists() {
    this.golfjoinS.getLists({}, this.limit, this.offset)
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

  close() {
    this._modal.dismiss();
  }

}
