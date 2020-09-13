import { Component } from '@angular/core';
import { NavController, AlertController, MenuController, Platform, ToastController} from 'ionic-angular';
import { MessagesPage } from '../messages/messages';
import { Storage } from '@ionic/storage';
import {Http, Headers, RequestOptions} from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { AppMinimize } from '@ionic-native/app-minimize';
import { SimpleGlobal } from 'ng2-simple-global';


declare var window:any;

@Component({
  selector: 'page-chatList',
  templateUrl: 'chatList.html',
  //directives : 'long-press'
})
export class ChatListPage {
  items: Array<{name: string,time:string,picture: any,text:string }>;
  searchQuery: string = '';
  profileuser:any;
  users:any;
  tkn_sb:any;
  hour:any;
  min:any;
  selectedChats : any;
  delIds:any;
  selected = [];
  userMsgStatuses = [];
  longPressStatus : boolean = false;
  selectedCount : number = 0;
  chatList_temp: any;
  httpOptions = {};
  showLoader : boolean = false;
  //selectedChatStatus: boolean = false;
  delta: number;
  profileId: any;
  diff : any;
  end: number;
  start: number;
  msgLength : any;

  constructor(private navCtrl: NavController,
              private storage: Storage,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              private http: Http,
              private alertCtrl: AlertController,
              private menu: MenuController,
              private appMinimize: AppMinimize,
              public platform: Platform,
              public sg: SimpleGlobal) {

    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','tenaAcceptnt':'application/json', 'token': this.tkn_sb })
      };
      this.initializeItems();
    });
    this.storage.get('userProfile').then((val) => {
      this.profileId = val.id; 
      let temp = this.profileId.search("_"); 
      if(temp > 0) {
        this.profileId = this.profileId.split("_")[0];
      }            
    });
    this.platform.registerBackButtonAction(() => {
      if(this.navCtrl.canGoBack()){
        this.navCtrl.pop();
      }
      else {
        this.appMinimize.minimize();
      }
    });
  }

  ionViewDidEnter() {
    if(this.sg['updateStatus'] == "update") {
      this.sg['updateStatus'] = null;
      this.http.get(MyApp.API_ENDPOINT+'/chat/list', this.httpOptions).map(res => res.json()).subscribe(data => {        
        this.users = data.data;
        this.msgLength = this.users.length;
        this.chatList_temp = data.data;
        for(var i=0;i<this.users.length;i++){
          this.userMsgStatuses[this.users[i].chat.id] = false;
        }
      },
      err => {        
      });     
    }       
  }
  
  initializeItems() {
    this.menu.swipeEnable(false, 'menu1');
    this.showLoader = true ;         
    this.http.get(MyApp.API_ENDPOINT+'/chat/list', this.httpOptions).map(res => res.json()).subscribe(data => {
      this.showLoader = false;
      this.users = data.data;
      this.msgLength = this.users.length;
      this.chatList_temp = data.data;
      for(var i=0;i<this.users.length;i++){
        this.userMsgStatuses[this.users[i].chat.id] = false;
      }
    },
    err => {
      this.showLoader = false;
    });    
  }
  initialiseChatList() {
    this.users = this.chatList_temp;
  }
  
  getDateFormat(date):string {
    let currentDate = new Date();
    let dt = new Date(date);
    let suffix = "";
    let amorpm = "";
    let temp_month = [];
    let diffDays = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())) /(1000 * 60 * 60 * 24));            
    let hour:any = dt.getHours(); 
    let min:any = dt.getMinutes();
    let dd = dt.getDate();
    let mm = dt.getMonth();
    let year = dt.getFullYear();    
    if(dd == 11 || dd == 12 || dd == 13){
      suffix = "th";
    }
    else if (dd % 10 == 1){
      suffix = "st";
    }
    else if (dd % 10 == 2){
      suffix = "nd";
    }
    else if (dd % 10 == 3){
      suffix = "rd";
    }
    else {
      suffix = "th";
    }
      //temp_month.push("");
      temp_month.push("JAN");
      temp_month.push("FEB");
      temp_month.push("MAR");
      temp_month.push("APR");
      temp_month.push("MAY");
      temp_month.push("JUN");
      temp_month.push("JUL");
      temp_month.push("AUG");
      temp_month.push("SEP");
      temp_month.push("OCT");
      temp_month.push("NOV");
      temp_month.push("DEC");
      let temp = temp_month[mm]+" "+dd+" "+year+" "+hour+":"+min+" "+"GMT";
      let newDt = new Date(temp);
      let newHr:any = newDt.getHours();
      let newMin:any = newDt.getMinutes();
      let date_new:any = newDt.getDate();
      if(newHr > 12) {
        amorpm = "pm"
        newHr = (newHr-12);
      }
      else if(newHr < 12) {
        amorpm = "am";
        if(newHr < 10) {
          newHr = "0"+newHr;
        }
      }
      if(newHr == 12) {
        amorpm = "pm";        
      }
      if(newMin < 10) {
        newMin = "0"+newMin;
      }
      if(date_new < 10) {
        date_new = "0"+date_new;
      }
      if(diffDays == 0){
        if(this.platform.is('ios')) {
          if(hour < 10) {
            hour = '0'+hour;
          }
          if(min < 10) {
            min = '0'+min;
          }
          return hour+':'+min;
        }
        else {
          return newHr+':'+newMin+" "+amorpm;
        }          
      }
      else {        
        return date_new+' '+temp_month[mm];                               
      }
    //}
  }
  
  deleteChat() {
    this.delIds = [];
    let temp_users = [];
    for(var i=0;i<this.users.length;i++){
      if(this.userMsgStatuses[this.users[i].chat.id]){
        this.delIds.push(this.users[i].chat.id);
      }
      else {
        temp_users.push(this.users[i]);
      }
    }          
    let body = {
      "chats": this.delIds
    }    
    let alert = this.alertCtrl.create({ 
      title : "Alert",       
      message: "Are you sure want to delete selected chat(s)?",
      enableBackdropDismiss : false,
      buttons: [{
        text: 'DELETE',
        handler: () => {
          this.users = temp_users;
          this.selectedCount = 0;            
          this.http.post(MyApp.API_ENDPOINT+'/chat/delete', body, this.httpOptions).map(res => res.json()).subscribe(data => {
            this.users = temp_users;
            let toast = this.toastCtrl.create({
              message: 'Successfully deleted chats',
              duration: 1000,
              position : "middle"
            });
            toast.present();
            this.selectedCount = 0;                    
          },err => {
            let toast = this.toastCtrl.create({
              message: 'Sorry! Something went wrong.',
              duration: 3000,
              position : "middle"
            });
            toast.present();      
          });            
        }
      }, {
        text: 'CANCEL',
        handler: () => {  
                      
        }
      }]
    });
    alert.present();    
        
  }   

  getItems(ev: any) {    
    this.initialiseChatList();
    let val = ev.target.value;    
    if (val && val.trim() != '') {
      this.users = this.users.filter((item) => {
        return (item.chat.last_message.message.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  getUserName(users) {
    for(var i=0;i<users.length;i++){
      if(users[i].id != this.profileId) {
        return users[i].name
      }      
    }
    return "";
  }

  getProfileImg(users) {
    for(var i=0;i<users.length;i++){
      if(users[i].id != this.profileId) {
        if(users[i].profile_image && users[i].profile_image.url) {
          return users[i].profile_image.url ;
        }        
      }      
    }
    return "assets/images/placeholder_user1.png";
  }

  onLongPress(user) {
    // this.selectedChatStatus = true;    
    if(this.userMsgStatuses[user.chat.id] == true){
      this.userMsgStatuses[user.chat.id] = false;
      this.selectedCount = this.selectedCount-1;        
    }
    else {
      this.userMsgStatuses[user.chat.id] = true;
      this.selectedCount = this.selectedCount+1;         
    }     
  }

  viewChat(user, idx) {
    if(this.selectedCount < 1) {
      let chatId = user.chat.id;
      let name = this.getUserName(user.chat.users);      
      let webChatId = user.chat.chat_websocket_channel;
      if(user.user.unread) { 
        this.users[idx].user.unread = false;           
        this.navCtrl.push(MessagesPage, {chatId, name, webChatId});                    
        this.http.post(MyApp.API_ENDPOINT+'/chat/'+chatId+'/unread/set', {}, this.httpOptions).map(res => res.json()).subscribe(data => {
        },
        err => {            
        });
      }
      else {
        this.navCtrl.push(MessagesPage, {chatId, name, webChatId});
      }
    } 
    else if(this.selectedCount > 0){
      this.onLongPress(user);
    }       
  }
}