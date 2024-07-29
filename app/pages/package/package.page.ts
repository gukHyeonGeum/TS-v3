import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonRefresher } from '@ionic/angular';

import { appConfig } from 'src/config';

import { AuthenticationService } from 'src/app/service/authentication.service';
import { PackageService } from 'src/app/service/package.service';

@Component({
  selector: 'app-package',
  templateUrl: './package.page.html',
  styleUrls: ['./package.page.scss'],
})
export class PackagePage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) refresher: IonRefresher;

  private limit = 20;
  private offset = 0;
  private refreshChk: boolean = false;

  me: any;
  lists: any;
  webRoot: string = appConfig.teeshotConfig.webRoot;

  constructor(
    public auth: AuthenticationService,
    public packageS: PackageService
  ) { 
    this.auth.getMe().then(me => {
      this.me = me;
    });

    this.getLists();
  }

  ngOnInit() {
  }

  getLists() {
    this.packageS.getLists({ company: 'hanagolf' }, this.limit, this.offset)
      .then(data => {
        if (data) {
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

}
