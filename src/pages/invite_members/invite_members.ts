import { Component } from '@angular/core';
import { NavController , MenuController,Platform, NavParams, ToastController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';
import { MyApp } from '../../app/app.component';
import { LoadingController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { AppMinimize } from '@ionic-native/app-minimize';
import { SimpleGlobal } from 'ng2-simple-global';
import { EmailInvitationsPage } from '../email_invitations/email_invitations';
import { CreateZonePage } from '../create_zone/create_zone';
//import { CreateZonePage } from '../create_zone/create_zone';

@Component({
  selector: 'page-invite_members',
  templateUrl: 'invite_members.html'
})
export class InviteMembersPage {
  tkn_sb : any;
  zoneRes:any;
  searchQuery: string = '';
  selected_item:any;
  users : any[] = [];
  search: string = '';
	items: Array<{picture: string, name: string, done: string}>;
  users_data : any[];
  httpOptions = {};
  selectedMembers  = [];
  selectedUserIds = []; 
  zone_name:any; zone_description:any; zoneInfo:any;
  emailList: any =[];
  page_people:number=1;
  infinitescrollObj:any;
  userProfile: any;
  users_temp: any;
  userStatus = [];
  url: string;

  constructor(public navCtrl: NavController, 
    private menu: MenuController, 
    private storage: Storage, 
    private http: Http, 
    public loadingCtrl: LoadingController, 
    public popoverCtrl: PopoverController, 
    private appMinimize: AppMinimize,
    public platform: Platform,
    public navParams : NavParams,
    public sg: SimpleGlobal,
    private toastCtrl: ToastController) {
      
    this.sg['userStatus'] = [];
    this.sg['selectedUserIds'] = [];
    this.sg['selectedMembers'] = [];
    this.sg['users_temp'] = [];
    this.sg['users'] = [];
    this.platform.registerBackButtonAction(() => {
      if(this.navCtrl.canGoBack()){
        this.navCtrl.pop();
      }
      else {
        this.appMinimize.minimize();
      }
    });
    this.storage.get('userProfile').then((val) => {
      this.userProfile = val;      
      let temp1 = (val.id).search("_");
      if(temp1 > 0) {
        this.userProfile.id = (val.id).split("_")[0];      
      } 
    });
    this.getUsers();
  }
  
  getUsers() {
    this.menu.swipeEnable(false, 'menu1');
    this.zoneInfo = this.navParams.get('zone_list');
    if(this.zoneInfo) {
      this.url = '/zone/'+this.zoneInfo.id+'/search/people';
    }
    else {
      this.url = '/util/search/people';
    } 
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
      this.sg['token_zones'] = val;
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','Accept':'application/json', 'token': this.tkn_sb})
      };
      //if(!this.sg['users']) {
        let loader = this.loadingCtrl.create({
          spinner: 'dots',
          content: 'Getting Users'
        });
        loader.present().then(() => {
          let body = {
            "search_string": "",
            "page": 1,
            "page_size": 15,
          }       
          this.http.post(MyApp.API_ENDPOINT+this.url, body, this.httpOptions).map(res => res.json()).subscribe(data => {  
            loader.dismiss();
            this.sg['users'] = data.data.users;
            this.sg['users_temp'] = data.data.users;
            this.sg['userStatus'] = [];
            for(var i=0; i<this.sg['users'].length; i++) {
              this.sg['userStatus'][this.sg['users'][i].id] = false;
            }          
          }, 
          err => {
            loader.dismiss();        
          }); 
        });
      //}
    });  
  }  
  selectUserToInvite(userInfo, index) {    
    if(this.sg['userStatus'][userInfo.id]) {
      this.sg['userStatus'][userInfo.id] = false;
      for(var i=0; i<this.sg['selectedUserIds'].length; i++) {
        if(this.sg['selectedUserIds'][i] == userInfo.id) {
          this.sg['selectedUserIds'].splice(i, 1);
          this.sg['selectedMembers'].splice(i, 1);
        }
      }
    } 
    else {
      this.sg['userStatus'][userInfo.id] = true;
      this.sg['selectedUserIds'].push(userInfo.id);
      this.sg['selectedMembers'].push(userInfo);
    }
  }
  unselectInvitedMember(index, userInfo) {
    this.sg['selectedUserIds'].splice(index, 1);
    this.sg['selectedMembers'].splice(index, 1);
    this.sg['userStatus'][userInfo.id] = false;
  }
  initialiseItems() {
    this.sg['users'] =  this.sg['users_temp'];
  }

  inviteUsers() {
    if(!this.zoneInfo) {
      this.navCtrl.push(CreateZonePage);
    }
    else {
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Inviting people'
      });
      loader.present().then(() => {   
        let body = {      
          "invite_members": {
            "emails": [],
            "users": this.sg['selectedUserIds']
          }
        }
        this.http.post(MyApp.API_ENDPOINT+'/zone/'+this.zoneInfo.id+'/invite',body, this.httpOptions).map(res => res.json()).subscribe(data => {      
          this.sg['editZoneId'] = this.zoneInfo.id;
          this.sg['selectedMembers'] = [];
          this.sg['selectedUserIds'] = [];
          this.sg['userStatus'] = [];
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: 'Successfully added members',
            duration: 1000,
            position : "middle"
          });
          toast.present();
          this.navCtrl.pop();      
        }, err => {
          loader.dismiss();
        });
      });    
    }       
  }
  /* ----------------- infinite scroll of members --------------------- */
  doInfinite(infiniteScroll) {
    //this.infinitescrollObj = infiniteScroll;
    this.page_people = this.page_people+1;      
    let body = {
      "search_string": this.search,
      "page": this.page_people,
      "page_size": 10,
    }     
    this.http.post(MyApp.API_ENDPOINT+this.url, body, this.httpOptions).map(res => res.json()).subscribe(data => {
      let users = data.data.users;          
      for(var i=0;i<users.length;i++) {
        let id = users[i].id;
        let temp1 = id.search("_");
        if(temp1 > 0) {
          id = (users[i].id).split("_")[0];      
        } 
        if(id != this.userProfile.id) {
          this.sg['users'].push(users[i]);
        }
      } 
      infiniteScroll.complete();
    }, err => {       
      infiniteScroll.complete();
    });
  }
  getItems(ev:any) {
    this.initialiseItems();
      let value = ev.target.value;
      if (value && value.trim() != '') {
        this.sg['users'] = this.sg['users'].filter((item) => {
          return (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
        })
      }
  }
  email(email: any): any {
    throw new Error("Method not implemented.");
  }
  open(event, userdata) {
    this.search = userdata.name;
    //  console.log(this.name);
    if(this.selected_item === userdata) {
      this.selected_item = '';
    }
    else {
      this.selected_item = userdata;         
    }
  }
  inviteViaEmail() {
    this.navCtrl.push(EmailInvitationsPage, {"zone_list" :this.zoneInfo});
  }
}