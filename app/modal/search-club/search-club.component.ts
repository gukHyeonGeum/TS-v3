import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonInfiniteScroll, IonSearchbar } from '@ionic/angular';
import { ClubService } from 'src/app/service/club.service';
import { ScreenService } from 'src/app/service/screen.service';

@Component({
  selector: 'app-search-club',
  templateUrl: './search-club.component.html',
  styleUrls: ['./search-club.component.scss'],
})
export class SearchClubComponent implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSearchbar) searchbar: IonSearchbar;
  @Input() type: string = '';
  
  private limit: number = 15;
  private offset: number = 0;
  private searchVal: any;

  lists: any = [];
  flag: boolean = false;

  constructor(
    public _modal: ModalController,
    public clubS: ClubService,
    public screenS: ScreenService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.searchbar.setFocus();  
    }, 1000); 
  }

  searchGolf(event: any) {
    this.searchVal = event.detail.value.trim();
    if (this.searchVal) {

      if (this.type === 'screen') {
        this.screenS.getFind(this.searchVal, this.offset, this.limit)
          .subscribe(res => {
            if (res.success) {
              this.listData(res.data);
            }
          });
      } else {

        this.clubS.getFindClub(this.searchVal, this.offset, this.limit)
          .subscribe(res => {
            if (res.success) {
              this.listData(res.data);
            }
          });
      }
    } else {
      this.lists = [];
    }
  }

  loadData(event: any) {
    this.offset = this.offset + this.limit;

    this.searchGolf({ detail: { value: this.searchVal }});  
  }

  listData(data: any) {
    if (this.offset) {
      this.lists = this.lists.concat(data);
      this.infiniteScroll.complete();

      if (data.length < this.limit) {
        this.infiniteScroll.disabled = true;
        this.offset = 0;
      }
    } else {
      this.lists = data;

      if (this.lists.length >= this.limit) {
        this.infiniteScroll.disabled = false;
      } else {
        this.infiniteScroll.disabled = true;
      }

      if (!this.lists.length) {
        this.flag = true;
      } else {
        this.flag = false;
      }
    }
  }

  selected(item: any) {
    this.close(item);
  }

  close(item: any = '') {
    this._modal.dismiss(item);
  }

}
