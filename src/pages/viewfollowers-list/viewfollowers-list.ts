import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SimpleGlobal } from 'ng2-simple-global';
import {Http, Headers, RequestOptions} from '@angular/http';
import { MyApp } from '../../app/app.component';
import { LoadingController } from 'ionic-angular';
import { YourProfilePage } from '../your_profile/your_profile';

@Component({
  selector: 'page-viewfollowers-list',
  templateUrl: 'viewfollowers-list.html',
})
export class ViewfollowersListPage {
  zone_id: any;
  leaderId: any;
  tkn_sb: any;
  httpOptions= {}; 
  viewFollowersList: any;
  count: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage, public sg: SimpleGlobal,private http: Http, 
    public loadingCtrl: LoadingController, ) {
    this.zone_id = this.navParams.get('zone_id');
    this.leaderId = this.navParams.get('leader_id');

      this.storage.get('sbtkn').then((val) => {
        this.tkn_sb = val;
        this.sg['token'] = val;      
          this.httpOptions = {
            headers: new Headers({ 'Content-Type': 'application/json','Accept':'application/json', 'token': this.tkn_sb })
          };
        if(this.zone_id && this.leaderId){      
          this.http.get(MyApp.API_ENDPOINT+'/zone/'+this.zone_id+'/'+this.leaderId+'/followers',this.httpOptions).map(res => res.json()).subscribe(data => {
            this.viewFollowersList = data.data;
            this.count = this.viewFollowersList.length;
            console.log(this.count);
          });
        }
      })
  }
  userProfile(event,follower){
    this.navCtrl.push(YourProfilePage, {"id":follower.id});
  }
}
