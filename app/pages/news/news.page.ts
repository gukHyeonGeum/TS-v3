import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonRefresher, NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ProfileService } from 'src/app/service/profile.service';
import { NewsService } from 'src/app/service/news.service';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
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
    public profileS: ProfileService,
    public newsS: NewsService,
    public alertS: AlertService,
    public nav: NavController
  ) { 
    this.auth.getMe().then(me => {
      this.me = me;
    });

    this.getLists();
  }

  ngOnInit() {
    this.auth.fbScreen('news_list');
  }

  getLists() {
    this.newsS.getLists({}, this.limit, this.offset)
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

  imgSrc(src: any) {
    let str = src.replace('/images/avatars/avatar-unknown.jpg', this.images);
    return str;
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

  movePage(list: any) {
    let page: any;

    if (list.type == 'like') {
      this.profile(list.user_id);
    } else {
    
      if (list.type == 'requested') {
        page = ['friend/request'];
      } else if (list.type == 'accepted') {
        page = ['friend/list'];
      } else if (list.type == 'message') {
        page = ['message'];
      }

      this.nav.navigateForward(page);

    }

    list.read = 1;

    this.newsS.putRead({ id: list.id }).then(resolve => {
      if (!resolve) {
        list.read = 0;
      }
    })
  }

}
