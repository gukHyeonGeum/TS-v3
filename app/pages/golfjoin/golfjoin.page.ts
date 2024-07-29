import { Component, OnInit, ViewChild } from '@angular/core';

import { PostComponent } from './post/post.component';
import { ModalController, IonInfiniteScroll, IonRefresher } from '@ionic/angular';
import { GolfjoinService } from 'src/app/service/golfjoin.service';
import { AlertService } from 'src/app/service/alert.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { GolfjoinGuideComponent } from 'src/app/modal/golfjoin-guide/golfjoin-guide.component';

@Component({
  selector: 'app-golfjoin',
  templateUrl: './golfjoin.page.html',
  styleUrls: ['./golfjoin.page.scss'],
})
export class GolfjoinPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) refresher: IonRefresher;

  private limit = 10;
  private offset = 0;
  private refreshChk: boolean = false;

  lists: any;
  images = 'assets/icon/profile-none.jpg';

  constructor(
    public auth: AuthenticationService,
    public modal: ModalController,
    public golfjoinS: GolfjoinService,
    public alertS: AlertService
  ) { }

  ngOnInit() {
    this.getLists();

    this.auth.fbScreen('golfjoin_list');
    this.auth.kakaoPixelPageView();
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
    this.modal.create({ component: GolfjoinGuideComponent })
      .then((modal) => modal.present())
  }
}
