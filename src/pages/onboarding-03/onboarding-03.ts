

import {  NavController, NavParams, PopoverController, AlertController, Platform, LoadingController, Slides, MenuController, App} from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Component, ViewChild} from '@angular/core';
import { PrivacyPage } from '../privacy/privacy';
import { Storage } from '@ionic/storage';
import {SimpleGlobal} from 'ng2-simple-global';
import { AppMinimize } from '@ionic-native/app-minimize';
import {Http, Headers, RequestOptions} from '@angular/http';
import { PopupLocationPage } from '../popup-location/popup-location';
import { UserInterestService } from '../../providers/userInterest.service';
import { MyApp } from '../../app/app.component';

import { LoginPage } from '../login/login';
import { PopupTextPage } from '../popup-text/popup-text';
import { Camera, CameraOptions } from '@ionic-native/camera'
import { Onboarding2Page }from '../onboarding2/onboarding2';
import { PopupAgePage } from '../popup-age/popup-age';

declare var google;


@Component({
  selector: 'page-onboarding-03',
  templateUrl: 'onboarding-03.html',
})
export class Onboarding_03Page {
  userProfile: any;
  userData : any;nearMe:any;
  tkn_sb : any;  
  bdayDate:any; 
  streetName:string = null;
  dataTemp : any;
  min_height:any;
  userReg = {};
  httpOptions = {};
  interests:any;
  specific_location:any;
  selected_image:any = null;
  current_location:any;
  locationStatus:any = 'current';
  selectedInterest = []; selectedHashTags = [];
  myInterests = []; existingGender:any; existingDob:any;
  count=0;
  name :any;
  images:any;
  currentCity:any;
  avatarGrid:any;
  showNow :boolean = true;  
  otherStatus : boolean = false; 
  profile_me :boolean = true; 
  profile_mask:boolean = false;  
  showInterestOption :boolean  = false;
  showDobOption:boolean = false;
  showLocationOption : boolean = false;
  default_avatar:any;
  hashtagInput:any; tags:any;
  pulse_animation: boolean = false;
  attachPic: any;
  imagePreview: any;
  isSelfieUploadSuccess : boolean = false;
  myProfileImage: any;
  downloadUrl: any;
  categories: any;
  datePlaceholder: string;
  selfieImg: any;
  newTag : boolean = false;
  errMsg: any;

  @ViewChild('datePicker') datePicker;
  constructor(public navCtrl: NavController,
    public navParams: NavParams, 
    private storage: Storage, 
    private http: Http,
    public sg: SimpleGlobal,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,           
    public userService: UserInterestService,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    private camera: Camera,
    public menu : MenuController,
    public appCtrl : App,
    private appMinimize: AppMinimize) {
                this.platform.registerBackButtonAction(() => {      
                  if(this.navCtrl.canGoBack()){
                    this.navCtrl.pop();
                  }
                  else {
                    this.appMinimize.minimize();
                  }
                });
                /*this.sg['showLocationOption'] = false;
                this.sg['showInterestOption'] = false;
                this.sg['nearMe'] = ""; 
                this.pulse_animation = false;*/
    }
  
  ionViewDidEnter() {
    this.menu.swipeEnable(false, 'menu1');   
    this.storage.get('sbtkn').then((val) => {      
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','tenaAcceptnt':'application/json', 'token': val })
      };
      if(this.sg['userObj'].profile_image && this.sg['userObj'].profile_image.url) {
        this.attachPic = this.sg['userObj'].profile_image.url ; 
      } 
      /*this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(val => {
        this.sg['userObj'] = val.data;
        if(this.sg['userObj'].profile_image && this.sg['userObj'].profile_image.url) {
          this.attachPic = this.sg['userObj'].profile_image.url ; 
        }    
        this.sg['userObj'].hashtags = val.data.hashtags;
        this.http.get(MyApp.API_ENDPOINT+'/user/preferences/default/get', this.httpOptions).map(res => res.json()).subscribe(data => {
          let list = data.data.preferences;
          this.sg['categories'] = list;
          this.interests = [];
          for(var i=0;i<list.length;i++) {
            if(list[i].set == true) {
              this.interests.push(list[i].category.name);
              this.myInterests.push(list[i].category.name);
            }
          }       
        });
      });*/
    });
  }
  editProfilePic(fileInput:HTMLElement){    
    fileInput.click();       
  }
  
  fileUploadCamera() {
    let imagePreview = "";
    const options1: CameraOptions = {
      quality: 50,
      targetWidth: 900,
      targetHeight: 600,
      cameraDirection : 1,
      correctOrientation:true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options1).then((imageData) => {
      let imageDt = [{data: imageData, mimetype: "image/jpeg"}]
      let body = {
        "image_data" : imageDt
      }
      let loader = this.loadingCtrl.create({
        spinner:'dots',
        content: 'Loading'
      });
      loader.present().then(() => {  
        this.http.post(MyApp.API_ENDPOINT+'/util/upload/images',body).map(res => res.json()).subscribe(data => {
          imagePreview = 'data:image/jpeg;base64,'+imageData;
          this.selfieImg = data.data.uploaded_urls[0];
          this.faceUpload();
          loader.dismiss();
        },err => {
          alert("Failure : Something went wrong while uploading");
        });
      }); 
    })   
  }

  faceUpload(){
    let body = {
      "image_url" : this.selfieImg
    }    
    this.http.post(MyApp.API_ENDPOINT+'/user/face/upload', body, this.httpOptions).map(res => res.json()).subscribe(data => {
      //alert("success : "+JSON.stringify(data.data));      
      this.sg['isSelfieUploadSuccess'] = true;
      this.sg['userObj'].gender = data.data.data[0].gender;  
      //  alert("success data :"+JSON.stringify(data.data)); 
      //  alert("success data1 :"+JSON.stringify(data.data.data[0])); 
      //  alert("success data2 :"+JSON.stringify(data.data.data[0].gender));
      //  alert("success data3 :"+JSON.stringify(this.sg['userObj'].gender));    
      let alert = this.alertCtrl.create({
        title : "Success",        
        message: data.data.message,
        enableBackdropDismiss:false,
        buttons: [{
          text: 'OK',
          handler: () => {
            
          }
        }]
      });
      alert.present();
      },err => {
        //loader.dismiss();
        this.sg['isSelfieUploadSuccess'] = false;      
        let error = JSON.parse(err._body);        
        let alert = this.alertCtrl.create({
          title : "Sorry!",        
          message: error.error.message,
          enableBackdropDismiss:false,
          buttons: [{
            text: 'OK',
            handler: () => {              
            
            }
          }]
        });
        alert.present(); 
      });
    //});
  }
  close(){
    this.imagePreview = null;
    this.attachPic = null;
    this.sg['isSelfieUploadSuccess'] = false;
  } 

  splittingName(username): string{
    if(username){
      let userName = username.split(" ");    
      return userName[0].charAt(0).toUpperCase() + userName[0].slice(1);
    }
    else {
      return 'User';
    }    
  } 

  popupLocation(){
    this.pulse_animation = true;  
    this.sg['city'] = null;                                
    let popover = this.popoverCtrl.create(PopupLocationPage, {}, {cssClass: 'custom-popover'});
      popover.present({        
    });    
   
    popover.onDidDismiss(data => {                     
      if(data) {
        this.sg['userObj'].display_location = data;
      }    
    });
  }

  street_name(value){
    let tempStreetName;
    if(this.streetName){
      tempStreetName = value.trim(" ");      
    }
    if(tempStreetName){
      if(tempStreetName.length > 0){
        this.streetName = tempStreetName;
        this.userReg['avatar_name'] = tempStreetName;
      }
    }
  }
  
  readPolicy(){
    this.navCtrl.push(PrivacyPage);
  } 
  dobStatus(event){   
    this.bdayDate = event;
    this.sg['userObj'].dob = event;   
    this.getYears(event); 
  }
  
  userRegistration(){    
    /*if((this.profile_me == true) && this.sg['userObj'] && this.sg['userObj'].profile_image){
      this.userReg['profile_image'] = this.attachPic;
      this.userReg['name'] = this.sg['userObj'].name;
      this.userReg['avatar_toggle'] = "false";
    }
    if(this.profile_mask == false) {
      if(this.selected_image && this.streetName) {
        this.userReg['avatar_image'] = this.selected_image;
        //this.userReg['avatar_toggle'] = "true";
      }
      else if(!this.selected_image || !this.streetName){
        this.userReg['avatar_image'] = null;
        this.userReg['avatar_toggle'] = "false";        
      }
    }
    if(this.profile_mask == true) {
      if(this.selected_image && this.streetName) {
        this.userReg['avatar_image'] = this.selected_image;
        this.userReg['avatar_toggle'] = "true";
      }
      else {
        this.userReg['avatar_image'] = null;
        this.userReg['avatar_toggle'] = "false";
      }            
    }    
    if(this.sg['locationStatus'] == 'specific') {
      if(this.sg['specificcity']){
        this.userReg['city'] = this.sg['specificcity'];
      }
      else {
        this.userReg['city'] = null;  
      }      
    }
    else if(this.sg['locationStatus'] == 'current'){
      if(this.sg['currentcity']){
        this.userReg['city'] = this.sg['currentcity'];
      }
      else {
        this.userReg['city'] = null;  
      }      
    } 
    else {
      this.userReg['city'] = this.sg['userObj'].city;
    }         
    this.userReg['dob'] = this.sg['userObj'].dob;
    this.userReg['name'] = this.sg['userObj'].name;
    this.userReg['zip_code'] = null;
    this.userReg['income'] = null;
    this.userReg['avatar_name'] = this.streetName;
    this.userReg['gender'] = this.sg['userObj'].gender;  */ 
    let body = {
      "gender": this.sg['userObj'].gender,
      "dob" : this.sg['userObj'].dob
    }
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Saving your profile...'
    });  
    loader.present().then(() => {
      this.http.post(MyApp.API_ENDPOINT+'/user/profile/validate',body, this.httpOptions).map(res => res.json()).subscribe(data => {        
        if(data.data.validation == false) {
          this.errMsg = data.data.message;
          loader.dismiss();
          this.alertCreation1(loader);
        }
        else {
          this.updateProfile(loader);          
        }         
      },err => {
        loader.dismiss();
      });
    });
  }
  alertCreation1(loader) {
    let alert = this.alertCtrl.create({
      title: "Alert",                           
      cssClass:"customalert",
      enableBackdropDismiss:false,        
      message: this.errMsg,
      inputs: [
        {          
          label: "I confirm that the data I’m entering is true.",
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
              this.updateProfile(loader);                      
            }
            else {             
              setTimeout(() => {
                this.alertCreation2(loader);
              }, 800);                                              
              
            }                  
          }                  
        }]
    });
    alert.present();    
  }
  alertCreation2(loader) {
    //this.alert.dismiss(); 
    let alert1 = this.alertCtrl.create({
      title: 'Alert',
      subTitle: 'Please cofirm your opinion to proceed',
      buttons: [{
        text: 'OK',
        handler: () => {          
          this.alertCreation1(loader);                    
        }
      }],
      enableBackdropDismiss:false
    });
    alert1.present();
  }
  updateProfile(loader) {
    let dp = null, avatar_dp = null, avatarToggle : any, avatarName = null, city = null;
    if(this.sg['userObj'].profile_image && this.sg['userObj'].profile_image.url) {
      dp = this.sg['userObj'].profile_image.url;
    }
    if(this.sg['userObj'].avatar_toggle) {
      avatarToggle = "true" ;
      avatarName = this.sg['userObj'].avatar_name;
      if(this.sg['userObj'].avatar_image && this.sg['userObj'].avatar_image.url) {
        avatar_dp = this.sg['userObj'].avatar_image.url;
      }
    }
    else {
      avatarToggle = "false";
    }
    if(this.sg['locationStatus'] == 'specific') {
      if(this.sg['specificcity']){
        city = this.sg['specificcity'];
      }
      else {
        city = null;  
      }      
    }
    else if(this.sg['locationStatus'] == 'current'){
      if(this.sg['currentcity']){
        city = this.sg['currentcity'];
      }
      else {
        city = null;  
      }      
    } 
    else {
      city = this.sg['userObj'].city;
    }
    
    this.userReg = {
      "avatar_image": avatar_dp,
      "avatar_name": avatarName,
      "avatar_toggle": avatarToggle,
      "city": city,
      "dob": this.sg['userObj'].dob,
      "gender": this.sg['userObj'].gender,
      "income": null,
      "name": this.sg['userObj'].name,
      "profile_image": dp,
      "zip_code": null
    }
    this.http.post(MyApp.API_ENDPOINT+'/user/profile/update',this.userReg, this.httpOptions).map(res => res.json()).subscribe(data => {
      loader.dismiss();      
      this.http.post(MyApp.API_ENDPOINT+'/me/system/card/clear',{}, this.httpOptions).map(res => res.json()).subscribe(data => {
        this.navCtrl.setRoot(TabsPage);    
      });             
    },err => {
      loader.dismiss();      
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
  edit(value){ 
    // this.showDobOption = false;
    // this.sg['showInterestOption'] = false;
    // this.sg['showLocationOption'] = false;    
    if(value == 'dob') {
      this.showDobOption = true;            
    }
    else if(value == 'location') {
      this.sg['city'] = null;
      if(typeof this.sg['popover'] == "undefined" || this.sg['popover'] == "" || this.sg['popover'] == "null") {
        this.sg['popover'] = this.popoverCtrl.create(PopupLocationPage, {'interests':this.sg['myInterests']}, {cssClass: 'custom-popover'});
        this.sg['popover'].present({        
        });
      }      
      this.sg['popover'].onDidDismiss(data => {
        this.sg['popover'] = "" ;
      });
    }
    else {
      this.sg['myInterests'] = [];     
      document.getElementById("interestOverlay").style.display = 'block';      
    }       
  }
  getYears(date): any{
    if(typeof date != undefined && date != "" && date != null) {
      var today = new Date();
      var birthDate = new Date(date);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    else {
      return "";
    }   
  }  
  
  getInterests(){
    this.sg['myInterests'] = [];        
    document.getElementById('interestOverlay').style.display = 'block'; 
  }
  closeCrowdReach(id, value) {
    /*if(value == 'interest'){
          
    }
    else if(value == 'avatar') {
      if(this.profile_mask == true) {
        if(!this.streetName || !this.selected_image) {          
          this.profile_mask = false;
          this.profile_me = true;
          this.selected_image = this.default_avatar;
        }
      }
      else {       
        this.profile_mask = false;
        this.profile_me = true;
        this.selected_image = this.default_avatar;
      }      
    } */ 
    this.sg['myInterests']  = [];
    document.getElementById(id).style.display = 'none';
  }
  categorySelection(interest, idx){              
    if(this.sg['categories'][idx].set == true) {
      this.sg['categories'][idx].set = false;      
      //this.count = this.count-1;    
    }
    else {
      this.sg['categories'][idx].set = true;
      //this.count = this.count+1;      
    }
    this.sg['myInterests'] = [];
    for(var i=0;i<this.sg['categories'].length;i++){
      if(this.sg['categories'][i].set == true){          
        this.sg['myInterests'].push(this.sg['categories'][i]);        
      }    
    }    
  }
  hashInput(event) {

  }
  chooseMask(value, idx){
    this.selected_image = value;     
  }
  next(id, value){
    //let that = this;
    let interestObj = {};
    if(value == 'avatar') {
      this.userReg['avatar_image'] = this.selected_image;
      document.getElementById(id).style.display = "none";
    }
    else if(value == 'interest'){
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Updating...'
      });  
      loader.present().then(() => {   
      this.sg['interests'] = [];
      for(var i=0;i<this.sg['myInterests'].length;i++){
        if(this.sg['myInterests'][i].set == true) {          
          this.sg['interests'].push(this.sg['myInterests'][i].category.name);
          interestObj[this.sg['myInterests'][i].category.id] = 100; 
        }    
      }
      //this.sg['showInterestOption'] = false;
      let body = {
        "preferences" :  interestObj,
        "hashtags" : this.sg['userObj'].hashtags
      }           
      this.http.post(MyApp.API_ENDPOINT+'/user/preferences/default/set',body,this.httpOptions).map(res => res.json()).subscribe(data => {
        document.getElementById(id).style.display = "none";
        //this.sg['myInterests'] = [];
        this.newTag = false;
        loader.dismiss();       
      },err => {
        loader.dismiss();
      });
      });            
    }       
   
  }
  selectLocation(value){   
    if(value == 'specific'){
      this.locationStatus = 'specific';      
    }
    else {
      this.locationStatus = 'current';
    }
  }
  detail(event){
    let location = []; 
    let address = {
      'country':"",
      'state': "",
      'city':""
    };    
    this.specific_location = event.description;
    location = this.specific_location.split(",");
    if(location && location.length == 1){
      address['country'] = location[0];
    }
    else if(location && location.length == 2){
      address['country'] = location[1];
      address['state'] = location[0];
    }
    else if(location && location.length == 3){
      address['country'] = location[2];
      address['state'] = location[1];
      address['city'] = location[0];
    }
    else if(location && location.length > 3){
      let count = location.length;
      address['country'] = location[count-1];
      address['state'] = location[count-2];
      address['city'] = location[count-3];
    }
    console.log(address);        
  }
  
  changeHashTag(hashtag) {
    //hashtag = (hashtag).trim(" ");      
    if(hashtag && hashtag.length > 0) {
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
      let temp1 = hashtag.search(" ");
      let temp2 = hashtag.search(",");
      if(temp1 > 0) {
        hashtag = hashtag.trim(" ");
        this.newTag = true;        
        this.sg['userObj'].hashtags.push(hashtag);
        this.removeDuplicates();               
        temp1 = "";
        this.hashtagInput = null;
      }
      if(temp2 > 0) {        
        let tag = hashtag.split(",");
        this.newTag = true;
        this.sg['userObj'].hashtags.push(tag[0]);
        this.removeDuplicates();        
        temp2 = "";
        this.hashtagInput = null;
      }      
    }
  }
  /* ------------------------------- Adding hashtags while card creation ends -------------------------------------------------- */

  /* ------------------------------- Editing hashtags while card creation starts -------------------------------------------------- */
  editHashTag(value, idx) {
    this.newTag = true;    
    this.sg['userObj'].hashtags.splice(idx, 1);
    this.hashtagInput = value.trim(" "); 
    //this.hashtagInput = this.hashtagInput.split("#");
    //this.hashtagInput = this.hashtagInput[1];    
  }

  selectHashTag(value) {
    value = value.trim(" ");
    this.newTag = true;
    this.sg['userObj'].hashtags.push(value);    
    this.removeDuplicates();
    this.tags = [];
    this.hashtagInput = null;
  }
  enterTag(hashtag) {
    hashtag = hashtag.trim(" ");
    let temp3 = hashtag.search("#");
      if(temp3 == 0) {
        hashtag = hashtag.split("#");
        hashtag = hashtag[1];
      }
      this.newTag = true;
    this.sg['userObj'].hashtags.push(hashtag);
    this.removeDuplicates();   
    this.hashtagInput = null;
  }
  /* ------------------------------- Editing hashtags while card creation starts -------------------------------------------------- */ 

  removeDuplicates() {
    let newArr = [],found,x,y;        
    for (x = 0; x < this.sg['userObj'].hashtags.length; x++) {
      found = undefined;
      for (y = 0; y < newArr.length; y++) {
        if (this.sg['userObj'].hashtags[x] === newArr[y]) {
          found = true;
          break;
        }
      }
      if (!found) {
        newArr.push(this.sg['userObj'].hashtags[x]);
      }
    }
    this.sg['userObj'].hashtags = newArr;      
    for (var i = 0; i < this.sg['userObj'].hashtags.length; i++) {    
      if (this.sg['userObj'].hashtags[i].trim().length == 0) { 
        this.sg['userObj'].hashtags.splice(i, 1);
      }
    }
  }
  deleteHashTag(value, idx) {
    this.newTag = true;
    this.sg['userObj'].hashtags.splice(idx, 1);    
  }

  cancelMyProfile() {    
    this.http.post(MyApp.API_ENDPOINT+'/user/reset/account', {},this.httpOptions).map(resp => resp.json()).subscribe(data => {
      //this.navCtrl.setRoot(LoginPage); 
      this.appCtrl.getRootNav().setRoot(LoginPage);      
    }), err => {
      //this.navCtrl.setRoot(LoginPage);
      this.appCtrl.getRootNav().setRoot(LoginPage);
    };   
  }

  attachAnImage(fileInput:HTMLElement){    
    fileInput.click();       
  } 
  fileUpload(event) {
    let fileObj, attachPic;
    let loader = this.loadingCtrl.create({
      content: 'Loading',
    });
    loader.present().then(() => {
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event:any) => {
          this.myProfileImage = event.target.result
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
        let options = new RequestOptions({
          headers: headers                
        });
        loader.dismiss();        
        this.http.put(url,fileObj,options).map(res => res.json()).subscribe(data => {          
        },err => {          
          //console.log(this.profile.profile_image.url);
        });                 
      }, err => {
        loader.dismiss();
      });
    });  
  }
  popupText(){
    let popover = this.popoverCtrl.create(PopupTextPage);
       popover.present({
    });   
    setTimeout(()=>{
      this.fileUploadCamera();
      popover.dismiss()
    },3000);
  } 
  popupAge() {
    let popover = this.popoverCtrl.create(PopupAgePage);
       popover.present({
    });   
    setTimeout(()=>{
      this.datePicker.open();
      popover.dismiss()
    },3000);
  }
  getDatePlaceholder() {
    this.datePlaceholder = '<p style="color:#4a90e2;font-size: 1.1rem;text-align: left;font-weight: 500;">+ add age'+'<span style="color:#d0021b">*</span></p>';
    document.getElementById('placeholder').innerHTML = this.datePlaceholder
  }

 
  imageUpload(event) {
    let fileObj, attachPic;
    let loader = this.loadingCtrl.create({
      content: 'Uploading your image',
    });
    loader.present().then(() => {
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event:any) => {
          this.sg['userObj'].profile_image = {
            'url' : event.target.result
          }             
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
        this.attachPic = data.data.download_url;                       
        let headers = new Headers();
          headers.append( 'Content-Type', fileObj.type);
        let options = new RequestOptions({
          headers: headers                
        });
        loader.dismiss();              
        this.http.put(url,fileObj,options).map(res => res.json()).subscribe(data => {          
        },err => {
        });
        setTimeout(() => {
          this.updateProfleImg();
        }, 1500);                
      }, err => {
        loader.dismiss();
      });
    });  
  }

  updateProfleImg() {
    let body = {
      "profile_image": this.attachPic
    }
    this.http.post(MyApp.API_ENDPOINT+'/user/profile/image/update', body, this.httpOptions).map(res => res.json()).subscribe(data => {

    });
  }

  spittingMethod(name){
    if(name){
      let userName = name.split(" ");   
      return userName[0].charAt(0).toUpperCase() + userName[0].slice(1);
    } else return 'User'    
  }
  goBack(){
    this.navCtrl.setRoot(Onboarding2Page);
  }
  temp() {
    this.navCtrl.setRoot(TabsPage);
  }
}
