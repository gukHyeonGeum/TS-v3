import { Component, OnInit, ViewChild } from '@angular/core';

import { IonInfiniteScroll, IonRefresher } from '@ionic/angular';

import { AuthenticationService } from 'src/app/service/authentication.service';
import { AlertService } from 'src/app/service/alert.service';
import { ProfileService } from 'src/app/service/profile.service';
import { VisitsService } from 'src/app/service/visits.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.page.html',
  styleUrls: ['./visit.page.scss'],
})
export class VisitPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) refresher: IonRefresher;

  private observableMe$: any;
  private limit = 10;
  private offset = 0;
  private refreshChk: boolean = false;
  
  me: any;
  lists: any;
  checkbox: boolean = false;
  selectList: any = [];

  images = 'assets/icon/profile-none.jpg';

  constructor(
    public auth: AuthenticationService,
    public profileS: ProfileService,
    public visitsS: VisitsService,
    public alertS: AlertService,
    public commonS: CommonService
  ) { 
    this.observableMe$ = this.commonS.me$.subscribe(me => {
      this.me = me;
    });

    this.getLists();
  }

  ngOnInit() {
    this.auth.fbScreen('visit');
  }

  ngOnDestroy() {
    this.observableMe$.unsubscribe();
  }

  getLists() {
    this.visitsS.getLists({}, this.limit, this.offset)
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

  imgError(event: any) {
    event.target.src = this.images;
  }

  profile(target: any) {
    if (this.checkbox) return;

    let obj: any = {
      id: this.me.id,
      target: target.visitor_id
    }
    this.profileS.profileOpen(obj).then(modal => {
      if (target.state == 'new') {
        this.visitsS.putReadProfile({ visitor_id: target.visitor_id }).then(resolve => {
          if (resolve) {
            target.state = '';
          }
        });
      }
    });
  }

  checkboxToggle() {
    this.checkbox = !this.checkbox;
  }

  selectChecked(id: any, ev: any) {
    if (ev.detail.checked) {
      this.selectList.push(id);
    } else {
      let list = this.selectList.findIndex((r:any) => { return r == id });
      this.selectList.splice(list, 1);
    }
    
  }

  visitDelete() {

    this.visitsS.deleteLists(this.selectList).then(resolve => {
      if (resolve) {
        this.selectList.forEach((id:any, i:any) => {
          let list = this.lists.findIndex((r:any) => { return r.id == id });
          this.lists.splice(list, 1);
          if ((this.selectList.length-1) == i) {
            this.selectList = [];
            if (this.lists.length < this.limit) {
              this.doRefresh();
            }
          }
        });
      }
    });
  }

}
