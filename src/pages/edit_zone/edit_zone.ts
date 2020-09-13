import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController , MenuController, AlertController, NavParams, LoadingController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { MyApp } from '../../app/app.component';
import {SimpleGlobal} from 'ng2-simple-global';
import { AppMinimize } from '@ionic-native/app-minimize';
import { InviteMembersPage } from '../invite_members/invite_members';

declare function unescape(s:string): string;

@Component({
  selector: 'page-edit_zone',
  templateUrl: 'edit_zone.html'
})
export class EditZonePage {
  @ViewChild('fileInput') el:ElementRef;
  zoneName :any = "";
  tkn_sb:any;  
  description :any = "";
  zoneRes :any[];  
  selectedMembers = []; selectedUserIds = [];
  downloadUrl:any;
  coverImagePreview:any = null;
  httpOptions = {};
  isUpdated:boolean = false;
  zoneInfo: any;
  users: any;
  emailList: any =[];
  email_ids: any;
  selectedMemberAll:boolean=false;
  selectedPersons:boolean = true;
  zoneId: any;
  descriptionLength:number = 3000;
  characterLeft :number = 3000;

  constructor(public navCtrl: NavController, 
    private menu: MenuController, 
    private storage: Storage, 
    private http: Http, 
    public loadingCtrl: LoadingController, 
    private alertCtrl: AlertController,
    public navParams : NavParams,
    public sg: SimpleGlobal,
    private appMinimize: AppMinimize,
    public platform: Platform) { 

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
    this.menu.swipeEnable(false, 'menu1');    
    this.zoneId =  this.navParams.get('zoneId');
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','Accept':'application/json', 'token': this.tkn_sb})
      };
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Fetching zone details'
      });
      loader.present().then(() => {
        this.http.get(MyApp.API_ENDPOINT+'/zone/'+this.zoneId, this.httpOptions).map(res => res.json()).subscribe(data => {
          loader.dismiss();
          this.zoneName = data.data.name;
          this.description = data.data.description;
          this.count(this.description);
          if(data.data.image && data.data.image.url) {
            this.coverImagePreview = data.data.image.url;
          }
          this.selectedMembers = data.data.members;        
        });
      },
      err => {
        loader.dismiss();
      });
    });    
  }

  changeInput(value, type) {
    if(type == "title") {
      this.zoneName = value.trim(" ");
    }
    else {
      this.description = value.trim(" ");
    }
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
    this.navCtrl.push(InviteMembersPage, {'zone_info':{
      "zone_name" :this.zoneName, 
      "zone_description" :this.description,
      "cover_image":this.downloadUrl,
      "selected_members":this.selectedMembers,
      "selected_userIds":this.selectedUserIds,
      "users_all" : this.users,
      "email_ids":this.emailList
      }
    });    
  }

  removeMembers(index) {
    this.selectedUserIds.splice(index, 1);
    this.selectedMembers.splice(index, 1);
  }

  removeMembersAll(idx){
    let array =[];
    for(var i=0;i<this.selectedMembers.length;i++){
          if(i != idx){
            array.push(this.selectedMembers[i]);

          }
    }
    this.selectedMembers =array;
  }

  showMembers(){
    this.selectedMemberAll = true;
    this.selectedPersons = false;
  } 

  updateZone() {    
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Updating your Zone'
    });
    loader.present().then(() => {
      let title, description, image = null;
      
      title = btoa(unescape(encodeURIComponent(this.zoneName)));
      description =  btoa(unescape(encodeURIComponent(this.description)));
      
      let body = {
        "cover_image": this.coverImagePreview,
        "description": description,        
        "name": title
      }
      if(this.downloadUrl) {        
        body['cover_image'] = this.downloadUrl;
      }
      this.http.post(MyApp.API_ENDPOINT+'/zone/'+this.zoneId+'/update',body, this.httpOptions).map(res => res.json()).subscribe(data => {
        loader.dismiss();
        this.zoneName = "";
        this.description = "";
        this.selectedUserIds = [];
        this.selectedMembers = [];
        this.downloadUrl = null;
        this.sg['editZoneId'] = this.zoneId;
        this.navCtrl.pop();
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

