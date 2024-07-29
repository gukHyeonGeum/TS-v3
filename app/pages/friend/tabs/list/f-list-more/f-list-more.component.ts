import { Component, OnInit } from '@angular/core';
import { FriendService } from 'src/app/service/friend.service';
import { NavParams, PopoverController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-f-list-more',
  templateUrl: './f-list-more.component.html',
  styleUrls: ['./f-list-more.component.scss'],
})
export class FListMoreComponent implements OnInit {

  id: any;

  constructor(
    public friendS: FriendService,
    public navParams: NavParams,
    public popover: PopoverController,
    public alertController: AlertController
  ) { 
    this.id = this.navParams.get('id');
  }

  ngOnInit() {}

  delete() {
    this.friendS.putDelete({ id: this.id }).then(resolve => {
      if (resolve) {
       this.popover.dismiss(true);
      }
    });
  }

}
