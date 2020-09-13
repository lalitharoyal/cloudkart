import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import { MyApp } from '../../app/app.component';
@Component({
  selector: 'page-popup-crowdInfo',
  templateUrl: 'popup-crowdInfo.html'
})
export class PopupCrowdInfoPage {
  crowd_count : any; 
  target_values : any;
  tkn_sb:any; storyId :any;
  httpOptions = {}; 
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,   
    private http: Http,
    public loadingCtrl: LoadingController,
    public viewCtrl:ViewController) {
      this.crowd_count = this.navParams.get('count');
      this.target_values = this.navParams.get('values');
      this.tkn_sb = this.navParams.get('token');
      this.storyId = this.navParams.get('storyId');
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','tenaAcceptnt':'application/json', 'token': this.tkn_sb })                    
      };   
  }
  showSimilarCards() {
    let data = "active";   
    this.viewCtrl.dismiss(data);
  }
}
