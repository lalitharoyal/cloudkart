import { Component, ViewChild ,NgZone} from '@angular/core';
import { NavController, NavParams, Tabs,App,} from 'ionic-angular';
import { TagsPage } from '../tags/tags';
import { PeoplePage } from '../people/people';
import { ZonesPage } from '../zones/zones';
import { TimelinePage } from '../timeline/timeline';
import { NotificationListPage } from '../notificationList/notificationList';
import { YourProfilePage } from '../your_profile/your_profile';
import { SimpleGlobal } from 'ng2-simple-global';

import { Storage } from '@ionic/storage';
import {Http, Headers, RequestOptions} from '@angular/http';
import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;
  // tab1: any;  tab2: any;  tab3: any;  tab4: any;  tab5: any;
  notification_count : number;
  tkn_sb: any;
  httpOptions = {};
  selectedTab: any;
  tab1Root = TimelinePage;
  // tab2Root = DiscoverPage;
  tab2Root = TagsPage;
  tab3Root = ZonesPage;
  tab4Root = PeoplePage;
  // public tab1Root = HomePage;
  //   this.tab1 = TimelinePage;
  //   this.tab2 = DiscoverPage;
  //   this.tab3 = TagsPage;
  //   this.tab4 = ZonesPage;
  //   this.tab5 = PeoplePage;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,public zone: NgZone,
    private storage: Storage, private app: App,
    private http: Http,
    public sg: SimpleGlobal) {
      this.selectedTab = this.navParams.get('selectedTab') || 0;
  }
  ionViewWillEnter() {
    if(this.selectedTab) {
      this.tabRef.select(this.selectedTab);
    }
  }
  ionViewDidEnter() {
    // this.navCtrl.parent.select(0);
    // this.app.getRootNav().getActiveChildNav().select(0);
    let docId:any = 0;
    //this.tabRef.select(docId);
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','Accept':'application/json', 'token': this.tkn_sb })
      };
    });  
  }

  notifications(count) {
    //this.stories = []; 
    this.navCtrl.push(NotificationListPage); 
    if(count > 0){
      let headers = new Headers( );  
        headers.append( 'Content-Type','application/json');
        headers.append( 'Accept', 'application/json');
        headers.append( 'token', this.tkn_sb);    
      let options = new RequestOptions({
        headers: headers                
      });   
      this.http.get(MyApp.API_ENDPOINT+'/me/notification/new/clear', options).map(res => res.json()).subscribe(data => {
        this.sg['myProfileData'].new_notification_count = data.new_notification_count ;
      }); 
    }
  }
  myProfilePage() {
    this.navCtrl.push(YourProfilePage);               
  }
}
