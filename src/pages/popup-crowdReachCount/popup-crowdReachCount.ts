import { Component } from '@angular/core';
import { NavController, ViewController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-popup-crowdReachCount',
  templateUrl: 'popup-crowdReachCount.html'
})
export class PopupCrowdReachCountPage {	
  crowd_reach_count:any;
  selectedHashTags:any;
  categoryName:any;
  specificLoc:any;
  nearMe:any;
  age_range:any;
  min_age:any;
  max_age:any;
  targetMethod:any; targetValue:any; specific_age:any; locationStatus:any;

  constructor(public navCtrl: NavController, 
    public viewCtrl: ViewController,
    public navParams: NavParams) {
      this.crowd_reach_count = navParams.get("count");
      this.selectedHashTags = navParams.get("tags");
      this.targetMethod = navParams.get("targetMethod");
      this.targetValue = navParams.get("value");
      this.specific_age = navParams.get("age");
      this.locationStatus = navParams.get("location");
      this.categoryName = navParams.get("category");
      this.specificLoc = navParams.get("specificlocation");
      this.nearMe = navParams.get("nearme");
      this.age_range = navParams.get("myage");
      this.min_age = navParams.get("minage");
      this.max_age = navParams.get("maxage");   
  }

  chooseAgain() {
    let data = "choose";
    this.viewCtrl.dismiss(data);
  }
  publishCard() {
    let data = "publish";
    this.viewCtrl.dismiss(data);
  } 
 
}
