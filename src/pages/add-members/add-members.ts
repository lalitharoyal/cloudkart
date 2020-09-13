import { Component } from '@angular/core';
import { NavController , MenuController,Platform, NavParams, LoadingController, PopoverController, AlertController, ToastController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';
import { MyApp } from '../../app/app.component';
import { AppMinimize } from '@ionic-native/app-minimize';
import {SimpleGlobal} from 'ng2-simple-global';

import { YourProfilePage } from '../your_profile/your_profile';
@Component({
  selector: 'page-add-members',
  templateUrl: 'add-members.html',
})
export class AddMembersPage {
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
  selectedUserIds = []; zone_name:any; zone_description:any; zoneInfo:any;
  emailList: any =[];
  page_people:number=1;
  userProfile: any;
  selectedUsers = [];
  userIds = []; admins = []; mentors = []; members = []; userRole : any; 
  users_temp = [];
  editStatus: boolean =  false;;

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
    public alertCtrl : AlertController,
    public toastCtrl: ToastController) { 
         
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
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;      
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','tenaAcceptnt':'application/json', 'token': this.tkn_sb })
      };
    });  
  }

  ionViewDidEnter() {
    this.zoneInfo = this.navParams.get('zone_list');
    this.menu.swipeEnable(false, 'menu1');
    if(!this.users || this.users.length < 1) {            
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Getting Members'
      });
      loader.present().then(() => {              
        this.http.get(MyApp.API_ENDPOINT+'/zone/'+this.zoneInfo.id+'/members', this.httpOptions).map(res => res.json()).subscribe(data => {
          loader.dismiss();
          this.users = data.data;
          this.users_temp = data.data;          
          for(var i=0;i<this.users.length;i++) {            
            this.selectedUsers[this.users[i].user] = false;            
          }          
        }, 
        err => {
          loader.dismiss();        
        }); 
      });
    }
  }

  isAdmin() {
    if(this.users && this.userProfile) {
      for(var i=0; i<this.users.length; i++) {
        if(this.users[i].role == 'FOUNDER') {
          if(this.userProfile.id == this.users[i].user.id) {
            return true;
          }
        }      
      }
      return false;
    }    
  }

  isLeader() {
    if(this.users && this.userProfile) {
      for(var i=0; i<this.users.length; i++) {
        if(this.users[i].role == 'LEADER') {
          if(this.userProfile.id == this.users[i].user.id) {
            return true;
          }
        }      
      }
      return false;
    }    
  }

  initialiseItems() {
    this.users =  this.users_temp;
  }
  
  getItems(ev:any) {   
    let val = ev.target.value;
    this.initialiseItems();
    let value = ev.target.value;
    if (value && value.trim() != '') {
      this.users = this.users.filter((item) => {
        return (item.user.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
      })
    }
    else {       
      return this.users
    }        
  }
  email(email: any): any {
    throw new Error("Method not implemented.");
  }
  open(event, userdata) {
    this.search = userdata.name;
    if(this.selected_item === userdata) {
        this.selected_item = '';
    }
    else {
      this.selected_item = userdata;
    }
  }  

  doInfinite(infiniteScroll) {   
    this.page_people = this.page_people+1;      
    let body = {
      "search_string": this.search,
      "page": this.page_people,
      "page_size": 15,
    }   
    this.http.post(MyApp.API_ENDPOINT+'/zone/'+this.zoneInfo.id+'/search/people', body, this.httpOptions).map(res => res.json()).subscribe(data => {
      let users = data.data.users;          
      for(var i=0;i<users.length;i++) {
        let id = users[i].id;
        let temp1 = id.search("_");
        if(temp1 > 0) {
          id = (users[i].id).split("_")[0];      
        } 
        if(id != this.userProfile.id) {
          this.users.push(users[i]);
        }
      } 
      infiniteScroll.complete();
    }, err => {       
      infiniteScroll.complete();
    });
  }  

  selectUser(userId, idx) {
    if(this.selectedUsers[userId]) {
      this.selectedUsers[userId] = false;
      for(var i=0;i<this.userIds.length;i++) {
        if(this.userIds[i] == userId) {
          this.userIds.splice(i, 1);
        }
      }    
    }
    else {
      this.selectedUsers[userId] = true;
      this.userIds.push(userId);
    }
  }

  selectRole(value, id, idx) {
    value = value.toUpperCase();
    //console.log(value);
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Updating member'      
    });
    loader.present().then(() => {      
      let body = {
        "member": id,
        "role": value
      }
      this.http.post(MyApp.API_ENDPOINT+'/zone/'+this.zoneInfo.id+'/update/member/role',body, this.httpOptions).map(res => res.json()).subscribe(data => {
        loader.dismiss();      
        this.sg['editZoneId'] = this.zoneInfo.id;
        this.users[idx].role = value;
        let toast = this.toastCtrl.create({
          message: 'Successfully updated',
          duration: 1000,
          position : "middle"
        });
        toast.present();         
      }, err => {
          loader.dismiss();
          let error = JSON.parse(err._body);          
          let alert = this.alertCtrl.create({
            enableBackdropDismiss:false,
            title : "Alert",        
            message: error.error.message,
              buttons: [{
                text: 'OK',
                handler: () => {                    
                }
              }]
          });
          alert.present();
      });
    });
  }

  removeMembers() {       
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Removing selected members'      
    });
    loader.present().then(() => {      
      let body = {
        "members": this.userIds
      }
      this.http.post(MyApp.API_ENDPOINT+'/zone/'+this.zoneInfo.id+'/remove/members',body, this.httpOptions).map(res => res.json()).subscribe(data => {
        loader.dismiss();      
        this.sg['editZoneId'] = this.zoneInfo.id;
        let updated_users = [];
        for(var i=0;i<this.users.length;i++) {
          if(!this.selectedUsers[this.users[i].user.id]) {
            updated_users.push(this.users[i]);
          }
        }
        this.users = updated_users;
        let toast = this.toastCtrl.create({
          message: 'Successfully removed members',
          duration: 1000,
          position : "middle"
        });
        toast.present();         
      }, err => {
          loader.dismiss();          
          let alert = this.alertCtrl.create({
            enableBackdropDismiss:false,
            title : "Failure",        
            message: "Sorry! Something went wrong",
              buttons: [{
                text: 'OK',
                handler: () => {                    
                }
              }]
          });
          alert.present();
      });
    });  
  }

  viewProfile(id) {
    let avatarStatus = false;
    this.navCtrl.push(YourProfilePage, {"id":id, avatarStatus});
  }  
}
