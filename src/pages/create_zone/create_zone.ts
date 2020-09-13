
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController , MenuController, AlertController, NavParams, Platform, App, ToastController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { MyApp } from '../../app/app.component';
import { AppMinimize } from '@ionic-native/app-minimize';
import { SimpleGlobal } from 'ng2-simple-global';
import { InviteMembersPage } from '../invite_members/invite_members';
import { LoadingController } from 'ionic-angular';
import { ZoneTimelinePage } from '../zoneTimeline/zoneTimeline';

declare function unescape(s:string): string;

@Component({
  selector: 'page-create_zone',
  templateUrl: 'create_zone.html'
})
export class CreateZonePage {
  @ViewChild('fileInput') el:ElementRef;  
  tkn_sb:any;
  zoneRes :any[];  
  selectedUserIds = [];  
  coverImagePreview:any = null;
  httpOptions = {};
  isUpdated:boolean = false;
  zoneInfo: any;
  users: any;  
  emailList: any =[];
  email_ids: any;
  selectedMemberAll:boolean=false;
  selectedPersons:boolean = true;
  charcterLeft: number;
  descriptionLength:number = 3000;
  characterLeft :number = 3000;
  downloadUrl: any;
  description: string;
  zoneName: string;
  
  constructor(public navCtrl: NavController, 
    private menu: MenuController, 
    private storage: Storage, 
    private http: Http, 
    public loadingCtrl: LoadingController, 
    private alertCtrl: AlertController,
    public navParams : NavParams,
    private appMinimize: AppMinimize,
    public platform: Platform,
    public sg: SimpleGlobal,
    public appCtrl:App,
    public toastCtrl:ToastController) { 

    this.initialiseItems();
    this.platform.registerBackButtonAction(() => {      
      if(this.navCtrl.canGoBack()){
        this.navCtrl.pop();
      }
      else {
        this.appMinimize.minimize();
      }
    });  
  } 
  
  initialiseItems() {     
    this.menu.swipeEnable(false, 'menu1');
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','Accept':'application/json', 'token': this.tkn_sb})
      };
    });    
  }

  /* ----------- image upload ----------- */

  private gallery_run(fileInput:HTMLElement): void {
    fileInput.click();
  }
  fileUpload(event) {
    let fileObj;
    if(event.target.files && event.target.files[0]) {
      //console.log(event.target.files[0]);
      var reader = new FileReader();
      reader.onload = (event:any) => {        
        this.coverImagePreview =  event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }     
    fileObj = event.target.files[0];
    let headers = new Headers( );  
      headers.append( 'Content-Type','application/json');
    let options = new RequestOptions({
      headers: headers                
    });
    let body = {
      "content_type": fileObj.type             
    }  
    this.http.post(MyApp.API_ENDPOINT+'/util/upload_url/create',body,options).map(res => res.json()).subscribe(data => {
      let url = data.data.upload_url;
      this.downloadUrl = data.data.download_url;        
      let headers = new Headers();
        headers.append( 'Content-Type', fileObj.type);
      let putOptions = new RequestOptions({
        headers: headers                
      });
      this.http.put(url,fileObj,putOptions).map(res => res.json()).subscribe(() => {
      },() => { });      
        
    });
  }
  inviteMembers() {  
    this.navCtrl.push(InviteMembersPage);    
  }
  showMembers(){
    this.selectedMemberAll = true;
    this.selectedPersons = false;
  }  
  createZone() {
    let title, description, image = null;
      
    //this.appCtrl.getRootNav().setRoot(ZoneTimelinePage, {'id' :"5c0297ecc912e80001963a9f", 'page' : "createZone", 'succs_msg' : 'message'});       
    
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Creating your Zone'
    });
    loader.present().then(() => {      
      title = btoa(unescape(encodeURIComponent(this.zoneName)));
      description =  btoa(unescape(encodeURIComponent(this.description)));
      let body = {
        "cover_image": this.downloadUrl,
        "description": description,
        "invite_members": {
          "emails":[],
          "users": []
        },
        "name": title
      }
      this.http.post(MyApp.API_ENDPOINT+'/zone/create',body, this.httpOptions).map(res => res.json()).subscribe(data => {
        loader.dismiss();
        let message = data.data.message;
        let zoneId = data.data.zone.id;
        this.appCtrl.getRootNav().setRoot(ZoneTimelinePage, {'id' :zoneId, 'page' : "createZone", 'succs_msg' : message});
      },
      err => {
        loader.dismiss();
        let error = JSON.parse(err._body); 
        let alert = this.alertCtrl.create({
          title: "Failure",
          message: error.error.message,
          buttons: ["OK"]
        });
        alert.present();
      });
    });
  }  
  count(msg){
    if(this.descriptionLength>=msg.length){
      this.characterLeft=(this.descriptionLength)-(msg.length);
    }  
  }
}

