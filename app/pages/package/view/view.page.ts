import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { appConfig } from 'src/config';

import { AuthenticationService } from 'src/app/service/authentication.service';
import { LogsService } from 'src/app/service/logs.service';
import { PackageService } from 'src/app/service/package.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  me: any;
  list: any;
  pricing: any;
  bankInfo: any;
  webRoot: string = appConfig.teeshotConfig.webRoot;

  constructor(
    private activatedRoute: ActivatedRoute,
    public auth: AuthenticationService,
    public packageS: PackageService,
    public logS: LogsService
  ) { 
    this.auth.getMe().then(me => {
      this.me = me;
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.list = params;

      this.packageS.getView(this.list.code).then(res => {
        if (res.success) {
          this.pricing = res.data;
          this.bankInfo = res.bankInfo;
        }
      });
		});
  }

  ngOnInit() {
    this.logS.errors({
      f_1: 'package',
      f_2: 'view',
      f_5: 'ionic',
      body: this.list
    });
  }

  telClick() {
    this.logS.errors({
      f_1: 'package',
      f_2: 'telClick',
      f_5: 'ionic',
      body: this.list
    });
  }

}
