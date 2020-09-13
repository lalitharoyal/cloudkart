import { Component,ElementRef,ViewChild} from '@angular/core';
import { NavController, NavParams, AlertController,MenuController,LoadingController, PopoverController, ViewController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';
import { MyApp } from '../../app/app.component';
import { AppMinimize } from '@ionic-native/app-minimize';
import { TabsPage } from '../tabs/tabs';
import {SimpleGlobal} from 'ng2-simple-global';
import { PopupLocationPage } from '../popup-location/popup-location';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'  
})
export class ProfilePage  {
  @ViewChild('fileInput') el:ElementRef;
  @ViewChild('htmlInsideModal') el1:ElementRef;
  tkn_sb:any;
  interests:any; alert:any; alert1:any;
  images:any;
  avatarGrid:any;
  selected_image:any;
  bdayDate:any;
  count = 0; currentDob:any;
  showGenderOption:boolean;
  showDobOption:boolean;
  showNow:boolean = false;
  maleStatus :boolean;
  femaleStatus :boolean;
  otherStatus :boolean;      
  myInterests = [];  selectedHashTags = []; hashtagInput:any; tags:any;
  httpOptions = {};
  userProfile = {}; 
  profile_me :boolean = false;
  profile_mask:boolean = false;
  default_image:any;  existingGender:any; existingDob:any;
    constructor(public navCtrl: NavController,             
      public navParams: NavParams,                    
      private storage: Storage,
      private http: Http, 
      private alertCtrl: AlertController,
      private menu: MenuController,
      public sg: SimpleGlobal,
      public loadingCtrl: LoadingController,
      public viewCtrl: ViewController,
      public popoverCtrl: PopoverController,
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
    //this.userProfile = {};
    this.menu.swipeEnable(false, 'menu1');
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Getting your Interests'
    });

  loader.present().then(() => {   
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
      this.sg['token_profile']=val;
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','tenaAcceptnt':'application/json', 'token': this.tkn_sb })
      };
      this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(data => {
        loader.dismiss();
        let sublocality = "";
        this.selectedHashTags = data.data.hashtags;
        this.existingGender = data.data.gender;
        this.existingDob = data.data.dob.split("T")[0];
        this.currentDob = data.data.dob;                                                                                                                                                                                                                                                        ;
        if(data.data.gender == 'male') {
          this.maleStatus = true;
        } 
        else if(data.data.gender == 'female') {
          this.femaleStatus = true;
        } 
        else {
          this.otherStatus = true;
        }  
        // if(data.data.sublocality){
        //   sublocality = data.data.sublocality;
        // }
        // if(data.data.city) {
        //   sublocality = sublocality+data.data.city;
        // }
        // if(data.data.sublocality && data.data.city){
        //   sublocality = data.data.sublocality+', '+data.data.city;
        // }
        this.sg['selectedCity'] = data.data.display_location;      
        this.userProfile =  {         
          "avatar_name": data.data.avatar_name,
          "avatar_toggle": data.data.avatar_toggle,
          "city": data.data.city,
          "dob": data.data.dob,
          "gender": data.data.gender,     
          "name": data.data.name,
          //"profile_image":data.data.profile_image,
          "avatar_image":  data.data.avatar_image,
          "income":null,
          "zip_code":null,
          "hashtags":data.data.hashtags       
        }
        if(data.data.avatar_image) {
          this.selected_image = data.data.avatar_image.url;
         }
        else {
          this.selected_image = 'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/mask.jpg';
        }   
        if(data.data.avatar_toggle == false) {
          this.profile_me = true;
          this.profile_mask = false;
         }
        else {
          this.profile_me = false;
          this.profile_mask = true;
        } 
        if(data.data.profile_image) {
          if(data.data.profile_image.url) {
            this.default_image = data.data.profile_image.url;
            //this.userProfile['profile_image'] = data.data.profile_image.url;
          }
        }           
        this.http.get(MyApp.API_ENDPOINT+'/user/preferences/default/get', this.httpOptions).map(res => res.json()).subscribe(res => {
          this.interests = res.data.preferences;
          let interestObj = {};
          this.myInterests = [];
          for(var i=0;i<this.interests.length;i++){
            if(this.interests[i].set == true){          
              this.myInterests.push(this.interests[i].category.name);
              interestObj[this.interests[i].category.id] = this.interests[i].category.interest; 
            }    
          }
          if(this.myInterests.length > 0) {
            this.sg['showInterestOption'] = false;
          }
        });
      },
      err => {
        loader.dismiss();
      });     
    });
  });
    this.images = ['https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/mask.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/mask_2.png',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/mask_3.png',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/mask_4.png',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/mask_5.png',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/mask_6.png',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/mask_7.png',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/mask_8.png',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/mask_9.png']
    this.avatarGrid = Array(Math.ceil(this.images.length/3)); //MATHS!
    let rowNum = 0; //counter to iterate over the rows in the grid
    for (let i = 0; i < this.images.length; i+=3) { 
      this.avatarGrid[rowNum] = Array(3); //declare two elements per row
      if (this.images[i]) { //check file URI exists
        this.avatarGrid[rowNum][0] = this.images[i] ; //insert image
      }
      if (this.images[i+1]) { //repeat for the second image
        this.avatarGrid[rowNum][1] = this.images[i+1] ;
      }
      if (this.images[i+2]) { //repeat for the third image
        this.avatarGrid[rowNum][2] = this.images[i+2] ;
      }
      rowNum++; //go on to the next row
    }  
  }
  getYears(date): any{
    var today = new Date();
    var birthDate = new Date(date);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;    
  }
  popupChooseAvatar(){  
    document.getElementById('avatar_Overlay').style.display = 'block';      
  }
  closeCrowdReach(id, value) {
    if(value == 'interest'){
      this.getStatus();
    }
    else if(value == 'avatar') {
      if(this.userProfile['avatar_toggle'] == true) {
        console.log(this.userProfile['avatar_name']);
        if(!this.userProfile['avatar_name'] || !this.selected_image) {
          this.userProfile['avatar_toggle'] = false;
          this.profile_me = true;
          this.profile_mask = false;
        }
      }           
    }            
    document.getElementById(id).style.display = 'none';
  }
  categorySelection(interest, idx){
    this.myInterests = [];              
    if(this.interests[idx].set == true) {
      this.interests[idx].set = false;
      this.count = this.count-1;
      for(var i=0;i<this.interests.length;i++){
        if(this.interests[i].set == true){
          this.myInterests.push(this.interests[i].category.name);
        }
      }    
    }
    else {
      this.count = this.count+1;   
      this.interests[idx].set = true;     
      for(var i=0;i<this.interests.length;i++){
        if(this.interests[i].set == true){
          this.myInterests.push(this.interests[i].category.name);
        }
      }       
    }
  }
  edit(value){
    this.showGenderOption = false;
    this.showDobOption = false;
    this.sg['showInterestOption'] = false;
    this.sg['showLocationOption'] = false;
    if(value == 'gender'){
      this.showGenderOption = true;      
    }
    else if(value == 'dob'){
      this.showDobOption = true;      
    }
    else if(value == 'location'){
      this.sg['city'] = null;
      let popover = this.popoverCtrl.create(PopupLocationPage, {}, {cssClass: 'custom-popover'});
        popover.present({        
      });
      popover.onDidDismiss(data => {               
        this.getStatus();    
      });
    }
    else {
     // this.sg['showInterestOption'] = true;
      document.getElementById("interest_Overlay").style.display = 'block';
    }
    if(this.userProfile['gender'] && this.userProfile['dob'] && this.sg['selectedCity'] && this.myInterests.length > 0){
      this.showNow = false;
    }   
  }
  getStatus() {
    if(this.userProfile['gender']){
      this.showGenderOption = false;
    }                    
    else {
      this.showGenderOption = true;
    }
    if(this.userProfile['dob']){
      this.showDobOption = false;
      if(this.userProfile['gender']) {        
        this.showGenderOption = false;
      }
      else {       
        this.showGenderOption = true;
      }      
    }
    else {
      if(this.userProfile['gender']) {
        this.showDobOption = true;
      }
      else {
        this.showDobOption = false;
        this.showGenderOption = true;
      }                        
    }
    if(this.userProfile['gender'] && this['dob]']){
      if(!this.sg['selectedCity']) {
        this.sg['showLocationOption'] = true;
      }
      else {
        this.sg['showLocationOption'] = false;
      }      
      this.showGenderOption = false;
      this.showDobOption = false; 
    }
    else {
      if(!this.userProfile['gender']){
        this.showGenderOption = true;
        this.showDobOption = false;
      }
      else if(!this.userProfile['dob']) {
        this.showDobOption = true;
        this.showGenderOption = false;
      }
    }
    if(this.myInterests.length > 0) {
      this.sg['showInterestOption'] = false;
    }
    else {
      if(this.userProfile['gender'] || this.userProfile['dob'] || this.sg['selectedCity']) {
        if(this.userProfile['dob']){
          this.showGenderOption = false;
          if(this.userProfile['dob']) {
            this.showDobOption = false;
            if(this.sg['selectedCity']) {
              this.sg['showLocationStatus'] = false;
              this.sg['showInterestOption'] = true;
            }
            else {
              this.sg['showLocationStatus'] = true;
            }
          }
          else {
            this.showDobOption = true;
          }
        }
        else {
          this.showGenderOption = true;
        }
      }
      else {
        if(!this.userProfile['gender']){
          this.showGenderOption = true;          
        }
        else {
          this.showGenderOption = false;
          if(!this.userProfile['dob']) {
            this.showDobOption = true;
            if(!this.sg['selectedCity']) {
              this.sg['showLocationStatus'] = true;
              this.sg['showInterestOption'] = false;
            }
            else {
              this.sg['showLocationStatus'] = false;
              if(this.myInterests.length > 0) {
                this.sg['showInterestOption'] = false;
              }
              else {
                this.sg['showInterestOption'] = true;
              }
            }
          }
          else {
            this.showDobOption = false;
          }
        }
      }      
    }    
  }
  chooseMask(value, idx){
    this.selected_image = value;     
  }
  street_name(value){
    let tempStreetName;
    if(value){
      tempStreetName = value.trim(" ");      
    }
    if(tempStreetName){
      if(tempStreetName.length > 0){       
        this.userProfile['avatar_name'] = tempStreetName;
      }
    }
  }
  genderStatus(value){
    this.maleStatus=false;
    this.femaleStatus=false;
    this.otherStatus=false;
    if(value == 'male') {
      this.maleStatus = true;
      this.userProfile['gender'] = 'male';
    }
    else if(value == 'female') {
      this.femaleStatus = true;
      this.userProfile['gender'] = 'female';
    }
    else {
      this.otherStatus = true;
      this.userProfile['gender'] = 'other';
    }
    this.showGenderOption = false;
    this.getStatus();    
  }
  dobStatus(value){
    this.showDobOption = false;
    this.currentDob = value;
    this.userProfile['dob'] = value;
    this.getStatus();
  }  
  profileStatus(ev, value){
    if(value == 'me') {
      this.userProfile['avatar_toggle'] = false;
      this.profile_me = true;
      this.profile_mask = false;
    }
    else {
      this.userProfile['avatar_toggle'] = true;
      this.profile_me = false;
          this.profile_mask = true;
      document.getElementById('avatar_Overlay').style.display = 'block';
    }    
  }
  next(id, value){
    //let that = this;
    let interestObj = {};
    if(value == 'avatar') {
      this.userProfile['avatar_image'] = this.selected_image;
      let body = {};
      console.log(this.userProfile['avatar_toggle']);
      if(this.userProfile['avatar_toggle'] == true) {
        body['avatar_toggle'] = "true";
        this.http.post(MyApp.API_ENDPOINT+'/user/set/avatar',body,this.httpOptions).map(res => res.json()).subscribe(data => {

        });
      }
      else {
        body['avatar_toggle'] = "false";
      }       
    }
    else if(value == 'interest'){
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Updating...'
      });  
      loader.present().then(() => {   
        this.myInterests = [];
        for(var i=0;i<this.interests.length;i++){
          if(this.interests[i].set == true){          
            this.myInterests.push(this.interests[i].category.name);
            interestObj[this.interests[i].category.id] = 50; 
          }    
        }
        this.sg['showInterestOption'] = false;
        let body = {
          "preferences" :  interestObj,
          "hashtags" : this.selectedHashTags
        }
        this.http.post(MyApp.API_ENDPOINT+'/user/preferences/default/set',body,this.httpOptions).map(res => res.json()).subscribe(data => {
          loader.dismiss();
          this.navCtrl.pop();
        },err => {
          loader.dismiss();
        });
        this.getStatus();
    });       
    }        
    //document.getElementById(id).style.display = "none";
  }
  userRegistration(){    
    if(this.sg['locationStatus'] == 'specific') {
      this.userProfile['city'] = this.sg['specificcity'];
    }
    else if(this.sg['locationStatus'] == 'current'){
      if(this.sg['selectedCity']){
        this.userProfile['city'] = this.sg['currentcity'];
      }
      else {
        this.userProfile['city'] = null;  
      }      
    }
    if(this.userProfile['avatar_toggle'] == true) {
      this.userProfile['avatar_toggle'] = "true";
      this.userProfile['avatar_image'] = this.selected_image;
      if(this.default_image) {
        this.userProfile['profile_image'] = this.default_image;
      }
      else {
        this.userProfile['profile_image'] = null;
      }      
    }
    else {
      this.userProfile['avatar_toggle'] = "false";
      this.userProfile['avatar_image'] = this.selected_image;
      if(this.default_image) {        
        this.userProfile['profile_image'] = this.default_image;
      }
      else {
        this.userProfile['profile_image'] = null;
      }       
    }
    if(this.existingGender == this.userProfile['gender'] && this.existingDob == (this.currentDob.split("T")[0] || this.userProfile['dob'].split("T")[0])){
      this.updateProfile(); 
    }
    else {
      let body = {
        "gender":this.userProfile['gender'],
        "dob" : this.currentDob
      }
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Updating your interests...'
      });  
      loader.present().then(() => {
        this.http.post(MyApp.API_ENDPOINT+'/user/profile/validate',body, this.httpOptions).map(res => res.json()).subscribe(data => {          
          if(data.data.validation == false) {
            loader.dismiss();
            this.alertCreation1();            
          }
          else {
            this.updateProfile();
            loader.dismiss();
          }         
        },err => {
          loader.dismiss();
        });
      });       
    }
  }
  alertCreation1() {
    let alert = this.alertCtrl.create({
      title: "Alert",                           
      cssClass:"customalert",
      enableBackdropDismiss:false,        
      message: "Looks like the data you are entering is different from your social profile.",
      inputs: [
        {          
          label: "I confirm the data I'm entering is true",
          type: "checkbox",
          value: "true",
          checked: false                  
        }
      ],
        buttons: [{
          text: 'Cancel',
          handler: () => {                    
          }
        },
        {
          text: 'Proceed',                                    
          handler: data => {                           
            if(data.length && data.length>0 && data[0] == "true") {
              this.updateProfile();                      
            }
            else {             
              setTimeout(() => {
                this.alertCreation2();
              }, 800);                                              
              
            }                  
          }                  
        }]
    });
    alert.present();    
  }
  alertCreation2() {
    //this.alert.dismiss(); 
    let alert1 = this.alertCtrl.create({
      title: 'Alert',
      subTitle: 'Please cofirm your opinion to proceed',
      buttons: [{
        text: 'OK',
        handler: () => {          
          this.alertCreation1();                    
        }
      }],
      enableBackdropDismiss:false
    });
    alert1.present();
  }
  updateProfile() {
    this.http.post(MyApp.API_ENDPOINT+'/user/profile/update',this.userProfile, this.httpOptions).map(res => res.json()).subscribe(data => {
      this.navCtrl.setRoot(TabsPage);   
    },err => {      
      let error = JSON.parse(err._body);        
      let alert = this.alertCtrl.create({
        title: "Alert",        
        message: error.error.message,
          buttons: [{
            text: 'OK',
            handler: () => {}
          }]
      });
      alert.present(); 
    });
  }
  getInterests() {
    document.getElementById('interest_Overlay').style.display = 'block';
  }
   /* ------------------------------- Adding hashtags while card creation starts -------------------------------------------------- */
   changeHashTag(hashtag) {
    //hashtag = (hashtag).trim(" ");      
    if(hashtag.length > 0) {
      let temp3 = hashtag.search("#");
      if(temp3 == 0) {
        hashtag = hashtag.split("#");
        hashtag = hashtag[1];
      }
      let body = {
        "query": hashtag
      }
      this.http.post(MyApp.API_ENDPOINT+'/util/hashtags/similar', body,this.httpOptions).map(resp => resp.json()).subscribe(data => {
        this.tags = data.data;        
      }); 
    }  
    let temp1 = hashtag.search(" ");
    let temp2 = hashtag.search(",");
    if(temp1 > 0) {
      hashtag.trim(" ");
      this.selectedHashTags.push(hashtag);
      temp1 = "";
      this.hashtagInput = "";
    }
    if(temp2 > 0) {        
      let tag = hashtag.split(",");
      this.selectedHashTags.push(tag[0]);
      temp2 = "";
      this.hashtagInput = "";
    }
  }
  /* ------------------------------- Adding hashtags while card creation ends -------------------------------------------------- */

  /* ------------------------------- Editing hashtags while card creation starts -------------------------------------------------- */
  editHashTag(value, idx) {    
    this.selectedHashTags.splice(idx, 1);
    this.hashtagInput = value.trim(" "); 
    //this.hashtagInput = this.hashtagInput.split("#");
    //this.hashtagInput = this.hashtagInput[1];    
  }
  /* ------------------------------- Editing hashtags while card creation starts -------------------------------------------------- */

  selectHashTag(value) {
    value = value.trim(" ");
    this.selectedHashTags.push(value);
    this.tags = [];
    this.hashtagInput = "";
  }
  deleteHashTag(value, idx) {
    this.selectedHashTags.splice(idx, 1);    
  }
  enterTag(hashtag) {
    hashtag.trim(" ");
    this.selectedHashTags.push(hashtag);   
    this.hashtagInput = "";
  } 
}   

  