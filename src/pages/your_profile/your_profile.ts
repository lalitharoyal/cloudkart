import { Component } from '@angular/core';
import { NavController, NavParams , MenuController, Platform, PopoverController, AlertController, ViewController, ModalController} from 'ionic-angular';

import { Storage } from '@ionic/storage';
import {Http, Headers, RequestOptions} from '@angular/http';
import { MyApp } from '../../app/app.component';
import { LoadingController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { PopupAvatarPage } from '../popup-avatar/popup-avatar';
import { AppMinimize } from '@ionic-native/app-minimize';
import {SimpleGlobal} from 'ng2-simple-global';
import { TabsPage } from '../tabs/tabs';
import { MessagesPage } from '../messages/messages';
import { GalleryModal } from 'ionic-gallery-modal';

declare var google;
@Component({
  selector: 'page-your_profile',
  templateUrl: 'your_profile.html'
})

export class YourProfilePage {
	items: Array<{picture: string}>;
  base64Image:any;
  profileHide:boolean;  
  editStatus:boolean = false;
  private imageSrc: string;
  tkn_sb : any;
  profile : any;
  selected_image:any;
  interests = [];
  selectedInterests : any[] = [];
  selectedIndex : any;
  avatar_status:any;
  httpOptions = {};
  images = []; percentage = []; checked = []; rangeDisabled = [];
  avatarGrid:any;
  streetName:any = null;
  profile_id:any;
  editMyprofile:boolean =  false;
  user: any;
  places: any;
  specific_address: any;
  specificLoc = null;
  specific_location: any; 
  updatedImage = null;
  avatar: string;
  userObj: any;
  bookmarkedStories = []; barChartOptions:any;barChartLabels :string[];barChartType:string;barChartLegend:boolean = false;barChartData = [];
  barChartColors:Array<any>;
  errMsg: string;collectionType:any;
  profile_name: any;
  isBlocked: boolean = false;
  pageNumber: number = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams, 
              private menu: MenuController, 
              private storage: Storage, 
              private http: Http, 
              public loadingCtrl: LoadingController,
              public platform: Platform, 
              private appMinimize: AppMinimize,
              public popoverCtrl: PopoverController,
              public sg: SimpleGlobal,
              private alertCtrl:AlertController,
              public viewCtrl : ViewController,
              public modalCtrl:ModalController) {
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
      this.sg['token'] = val;
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','tenaAcceptnt':'application/json', 'token': this.tkn_sb })
      };  
    });
    this.images = [
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/2015-11-06benatky-maska-10-radynacestu-pavel-spurek-2015.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/Cheche.JPG',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/EFatima_in_UAE_with_niqab.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/Jackie_Martinez_with_a_mask.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/Nefertiti_30-01-2006.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/RBCM_-_Haida_old_woman_mask.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/Woman_in_rabbit_mask_and_nude.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/art-739658_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/avatar-769056_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/body-2976731_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/butterflies-2346164_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/carneval-3094815_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/carnival-2313234_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/carnival-2999783_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/carnival-3075912_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/carnival-3633589_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/carnival-411494_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/carnival-costume-masquerade-59826.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/child-188655_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/costume-3061807_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/download+(1).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/download+(2).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/download+(3).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/download.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/face-1013518_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/face-486707_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/fashion-3043754_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/fashion-3157027_960_720.jpg',                  
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/gas-mask-2343654_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/girl-689137_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/gothic-2097966_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/gothic-3166762_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/gothic-3396372_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/hair-3697439_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/hat-1540582_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(1).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(10).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(11).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(12).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(13).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(1a).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(2).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(3).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(5).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(6).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(7).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(8).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(9).jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/lick-2378544_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-1269102_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-141740_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-185992_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2028211_960_720.png',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2313237_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2321301_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2378574_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2424137_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2454442_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2483080_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2483082_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2506059_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2872819_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-3035037_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/maska2.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/painted.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/pexels-photo-190589.jpeg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1498954238841-25f28eeeff60.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1510933844587-60d4a40d74dd.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1512870020808-19a2edae0477.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1513774497165-501460a8a88c.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1517242296655-0a451dd85b30.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1518882300677-48cc76cc8463.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1519070813808-1d7a33907487.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1520748799498-9c879574ec7b.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1524499982521-1ffd58dd89ea.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/portrait-2616767_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/portrait-3204955_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/thumb-350-288090.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/venice-2100155_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/venice-3403623_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/venice.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/woman-2060851_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/woman-2086453_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/woman-2126955_960_720.png',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/woman-3422895_960_720.jpg',
                  'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/woman-3600521_960_720.jpg']
    this.profile_id = navParams.get('id');
    this.avatar_status = this.navParams.get('avatarStatus');       
    this.userObj = navParams.get('userObj');    
    this.initialising();
    this.platform.registerBackButtonAction(() => {
      if(this.navCtrl.canGoBack()){
        this.navCtrl.pop();
        this.viewCtrl.dismiss();
      }
      else {
        this.appMinimize.minimize();
      }
    });
    this.barChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      scaleValuePaddingX: 10,
      scaleValuePaddingY: 10,
      scaleShowValues: true,
      tooltips: {
        enabled: false
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true,
            display: false
          },
          gridLines: {
            display:false
          }
        }],
        xAxes: [{
          gridLines: {
              display:false
          }
        }],
      },
      animation: {
        duration:0,
        onComplete: function () {
          var chartInstance = this.chart,
          ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = "White";
          ctx.fontSize = "8";
          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
              var data = dataset.data[index];
              if(data == 0){
                data = "";
              }
              ctx.fillText(data, bar._model.x, bar._model.y + 15);
            });
          });
        }
      }
    };           
  } 
  avatarStatus(){
    let body = {};
    if(this.profile.avatar_name && this.profile.avatar_image && this.profile.avatar_image.url) {       
      if(this.avatar_status == false){
        body['avatar_toggle'] = "false";      
      }
      else {
        body['avatar_toggle'] = "true"
      }         
      this.http.post(MyApp.API_ENDPOINT+'/user/set/avatar',body,this.httpOptions).map(res => res.json()).subscribe(data => { 
        this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(res => {
          this.avatar_status = res.data.avatar_toggle;
          this.profile = res.data;          
          this.sg['myProfileData'] = res.data;          
        });                   
        if(data.data.user.avatar_image && data.data.user.avatar_image.url && this.avatar_status == true){
          //this.selected_image = data.data.user.avatar_image.url;
          //document.getElementById('avatarOverlay').style.display = "none"; 
        }
        else if(!data.data.user.avatar_image && !data.data.user.avatar_image.url && this.avatar_status == true){
          //document.getElementById('avatarOverlay').style.display = "block";
          let popover = this.popoverCtrl.create(PopupAvatarPage, {'image':this.selected_image, 'avatarName':this.streetName}, { cssClass:'custom-popoverAvatar'});
            popover.present({        
          });
          popover.onDidDismiss(data => {                         
            if(data) {
              this.profile.avatar_image.url = data.image;
              this.selected_image = data.image;
              this.profile.avatar_name = data.avatarName;
              this.streetName = data.avatarName;
            }
          });
        }
      });
    }
    else {
      if(this.avatar_status == true) {        
        let alert = this.alertCtrl.create({
          title: "Alert",
          enableBackdropDismiss:false,
          message: "Sorry!! You don’t have an avatar setup. Please go to edit profile and setup an avatar.",
          buttons: [{
            text: 'OK',
            handler: () => {
              this.avatar_status = false;         
            }
          }]
        });
        alert.present();
      }      
    }
  }  
  street_name(value){
    let tempStreetName;
    if(this.streetName){
      tempStreetName = value.trim(" ");      
    }
    if(tempStreetName){
      if(tempStreetName.length > 0){
        this.streetName = tempStreetName;        
      }
    }
  }
  closeCrowdReach(id) {
    document.getElementById(id).style.display = 'none';
  }
  editAvatar(){    
    //document.getElementById('avatarOverlay').style.display = "block";
    let popover = this.popoverCtrl.create(PopupAvatarPage, {'image':this.selected_image, 'avatarName':this.streetName}, { cssClass:'custom-popoverAvatar'});
      popover.present({        
    });
    popover.onDidDismiss(data => {                         
      if(data) {
        this.profile.avatar_image.url = data.image;
        this.selected_image = data.image;
        this.avatar_status = true;
        this.streetName = data.avatarName;
        this.profile.avatar_name = data.avatarName;
      }
    });           
  }
  chooseMask(value, idx){
    this.selected_image = value;         
  }
  next(id){
    let profile = {};
    profile={      
      "avatar_name": this.streetName,      
      "city": this.profile.city,
      "dob": this.profile.dob,
      "gender": this.profile.gender,
      "income": this.profile.income,
      "name": this.profile.name,      
      "zip_code": this.profile.zip_code,
      "profile_image" : this.updatedImage,
      "avatar_image" : this.selected_image
    }    
    if(this.avatar_status == false){
      profile['avatar_toggle'] = "false";      
    }
    else {
      profile['avatar_toggle'] = "true"
    }        
    let loader = this.loadingCtrl.create({
      content: 'Updating your profile',
      spinner : 'dots'
    });
    loader.present().then(() => { 
      this.http.post(MyApp.API_ENDPOINT+'/user/profile/update',profile, this.httpOptions).map(res => res.json()).subscribe(data => { 
        loader.dismiss(); 
        //this.sg['myProfileData'] = data.data.user;  
        this.profile.avatar_name = data.data.user.avatar_name;
        this.navCtrl.setRoot(TabsPage);        
      });
      this.profile.avatar_image.url = this.selected_image;
    }, err => {
      loader.dismiss();
    });    
  }  
  ionViewDidEnter() {
    if(!this.profile_id) {
      let loader = this.loadingCtrl.create({
        content: 'Getting your profile',
        spinner : 'dots'
      });
      loader.present().then(() => {
        this.editMyprofile = true;    
        this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(res => {            
          loader.dismiss();
          this.sg['myProfileData'] = res.data;
          this.collectionType = "YOUR COLLECTION" ;           
          this.profile = res.data;
          // var temp1 = this.profile.name;
          // this.profile_name= temp1.split(" ");
          if(this.profile.profile_image && this.profile.profile_image.url) {
            this.updatedImage = this.profile.profile_image.url;
          }
          if(this.avatar_status == false) {
            this.avatar_status = this.navParams.get('avatarStatus');
          }
          else {
            this.avatar_status = res.data.avatar_toggle;
          }
          if(this.profile.avatar_image){
            this.selected_image = this.profile.avatar_image.url;
          }
          else {
            this.selected_image = 'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/2015-11-06benatky-maska-10-radynacestu-pavel-spurek-2015.jpg';
          }
          if(res.data.avatar_name) {
            this.streetName = res.data.avatar_name;
          }
          this.getBookmarkedCards(res.data.id);        
        },
        err => {
          loader.dismiss();
          let alert = this.alertCtrl.create({
            title: "Failure",
            message: "Sorry, profile not found.",
            buttons: ["OK"]
          });
          alert.present();                   
        });          
      });
    }    
    this.http.get(MyApp.API_ENDPOINT+'/user/preferences/default/get', this.httpOptions).map(res => res.json()).subscribe(data => {
      let list = data.data.preferences;
      this.interests = [];
      for(var i=0;i<list.length;i++) {
        if(list[i].set == true) {
          this.interests.push(list[i]);
        }
      }       
    });
  }
  getItems(event) {    
    let body = {
      "query" : event.target.value
    }
    this.http.post(MyApp.API_ENDPOINT+'/util/google/location/suggestions', body).map(res => res.json()).subscribe(data => {
      this.places = data.data.predictions;
      //alert("Succeeded with google autocomplete service:"+JSON.stringify(data.predictions));
      console.log("Succeeded with google autocomplete service:"+JSON.stringify(data.predictions));
    }, err => {
        //alert("Error with google autocomplete service:"+JSON.stringify(err));
        console.log("Error with google autocomplete service:"+JSON.stringify(err));
    });           
  }
  selectedPlace(selectedPlace){
    console.log(JSON.stringify(selectedPlace));
    let that = this;
    let location, components;
    that.specific_address = {
      'country':null,
      'state': null,
      'city':null,
      'components':{},
      'sublocality':null
    };
    that.profile.display_location = selectedPlace.description;
    that.specific_location = selectedPlace.description;
    location = selectedPlace.description.split(",");
    if(location && location.length == 1){
      that.specific_address['country'] = location[0].trim(" ");
      that.specificLoc = location[0].trim(" ");
    }
    else if(location && location.length == 2){
      that.specific_address['country'] = location[1].trim(" ");            
      var tempState = location[0].trim(" ");
      var tempState1 = tempState.split(" ");
      let tempState3:any = "";
      for(var i=0;i<tempState1.length;i++){
        if(isNaN(tempState1[i])){
          // tempState2.push(tempState1[i]);
          tempState3 = tempState3+' '+tempState1[i]
        }
      } 
      that.specific_address['state'] = tempState3.trim(" ");
      that.specificLoc = tempState3.trim(" ");
    }
    else if(location && location.length == 3){
      that.specific_address['country'] = location[2].trim(" ");
      that.specificLoc = location[0].trim(" ");
      var tempState = location[1].trim(" ");
      var tempState1 = tempState.split(" ");
      let tempState3:any = "";
      for(var i=0;i<tempState1.length;i++){
        if(isNaN(tempState1[i])){
          // tempState2.push(tempState1[i]);
          tempState3 = tempState3+' '+tempState1[i]
        }
      } 
      that.specific_address['state'] = tempState3.trim(" ");
      that.specific_address['city'] = location[0].trim(" ");
    }
    else if(location && location.length > 3){
      let count = location.length;
      that.specific_address['country'] = location[count-1].trim(" ");
      that.specificLoc = location[count-4].trim(" ");
      var tempState = location[count-2].trim(" ");
      var tempState1 = tempState.split(" ");
      let tempState3:any = "";
      for(var i=0;i<tempState1.length;i++){
        if(isNaN(tempState1[i])){
          // tempState2.push(tempState1[i]);
          tempState3 = tempState3+' '+tempState1[i]
        }
      } 
      that.specific_address['state'] = tempState3.trim(" ");
      that.specific_address['city'] = location[count-3].trim(" ");
      that.specific_address['sublocality'] = location[count-4].trim(" ");
    } 
    var geocoder = new google.maps.Geocoder;       
    geocoder.geocode({'placeId': selectedPlace.place_id}, function(results, status) {
      //let that = this;
      if (status === 'OK') {
        if (results[0]) { 
          console.log(results[0]);
          that.specific_address['components'] = results[0];          
          that.http.post(MyApp.API_ENDPOINT+'/user/location/update', that.specific_address, that.httpOptions).map(res => res.json()).subscribe(data => {      
          }, 
          err => {
            let error = JSON.parse(err._body);        
            let alert = this.alertCtrl.create({
              title: "Alert",
              enableBackdropDismiss:false,        
              message: error.error.message,
                buttons: [{
                  text: 'OK',
                  handler: () => {                                
                  }
                }]
            });
            alert.present(); 
          });
        }
      }
    });
    console.log(that.specific_address);
    that.places = null;    
  }
  getMemberSince(date):string{
    let user_date:any = new Date(date);
    let today_date:any = new Date();
    let diff_date = today_date - user_date;
    let num_years = diff_date/31536000000;
    let num_months = (diff_date % 31536000000)/2628000000;
    let years = Math.floor(num_years);
    let month = Math.floor(num_months); 
    if(month > 1 && years > 1){
      return years+' '+'yrs,'+' '+month+' '+'months';
    }
    else if(years < 1 && month < 1) {
      return years+' '+'yr,'+' '+month+' '+'month';
    }
    else if(years < 1 && month > 1) {
      return years+' '+'yr,'+' '+month+' '+'months';
    }
    else if(years > 1 && month < 1) {
      return years+' '+'yrs,'+' '+month+' '+'month';
    }
  }
  getName(username): any{
    if(username){
      //let username = this.profile.name;
      let userName = username.split(" ");
      let fname = userName[0].charAt(0).toUpperCase() + userName[0].slice(1);
      if(userName[1]){
        let lname = userName[1].charAt(0).toUpperCase() + userName[1].slice(1);
        return fname+' '+lname;
      }
      else {
        return fname;
      } 
    }
    // else {
    //   if(this.profile.avatar_name){
    //     let username = this.profile.avatar_name;
    //     let userName = username.split(" ");
    //     let fname = userName[0].charAt(0).toUpperCase() + userName[0].slice(1);
    //     if(userName[1]){
    //       let lname = userName[1].charAt(0).toUpperCase() + userName[1].slice(1);
    //       return fname+' '+lname;
    //     }
    //     else {
    //       return fname;
    //     }
    //   }       
    // }      
  } 
  getGender(gender): string{
    if(gender){
      return gender.charAt(0).toUpperCase() + gender.slice(1);
    }
  } 
  getCity(city): string{
    if(city){
      return city.charAt(0).toUpperCase() + city.slice(1);
    }
  } 
  showing_subcard(id,parentI) {
    if(parentI == this.selectedIndex){
          this.selectedIndex = -1;
      }
      else {
         this.selectedIndex = parentI;
      }
  }
  editInterests() {
    let profile = this.profile;
    let status = "edited";
    let page = "menu";
    let sbtkn = this.tkn_sb;
    let edit = true;
    let edit1 = false;
    this.navCtrl.push(ProfilePage, {profile,status,sbtkn,page,edit,edit1});
  }
  editProfile() {
    // this.profile = false; 
    this.editStatus = true; 
    // let page1 = "profile";
    // this.navCtrl.push(InterestsPage, {page1});
  } 
  initialising() {
    this.menu.swipeEnable(false, 'menu1');
    this.items = [
      { picture: 'assets/images/star.svg'},
      { picture: 'assets/images/star.svg'},
      { picture: 'assets/images/star.svg'} 
    ];    
    this.storage.get('userProfile').then((val) => {
      //console.log(val);
      let temp1 = val.id.search("_");
      let temp;
      if(this.profile_id) {
        temp = this.profile_id.search("_");
      }        
      if(temp1 > 0) {
        val.id = val.id.split("_")[0];
      }
      if(temp > 0) {
        this.profile_id = this.profile_id.split("_")[0];
        this.avatar_status = true;
      }
      if(this.profile_id == val.id) {
        let loader = this.loadingCtrl.create({
          content: 'Getting your profile',
          spinner : 'dots'
        });
        loader.present().then(() => {
          this.editMyprofile = true;    
          this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(data => {            
            loader.dismiss();
            this.sg['myProfileData'] = data.data;
            this.collectionType = "YOUR COLLECTION" ;            
            this.profile = data.data;
            // var temp1 = this.profile.name;
            // this.profile_name= temp1.split(" ");
            if(this.profile.profile_image && this.profile.profile_image.url) {
              this.updatedImage = this.profile.profile_image.url;
            }
            if(this.avatar_status == false) {
              this.avatar_status = this.navParams.get('avatarStatus');
            }
            else {
              this.avatar_status = data.data.avatar_toggle;
            }
            if(this.profile.avatar_image){
              this.selected_image = this.profile.avatar_image.url;
            }
            else {
              this.selected_image = 'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/2015-11-06benatky-maska-10-radynacestu-pavel-spurek-2015.jpg';
            }
            if(data.data.avatar_name) {
              this.streetName = data.data.avatar_name;
            }
            this.getBookmarkedCards(data.data.id);        
          },
          err => {
            loader.dismiss();
            let alert = this.alertCtrl.create({
              title: "Failure",
              message: "Sorry, profile not found.",
              buttons: ["OK"]
            });
            alert.present();                   
          });          
        });
      }
      else if(this.profile_id && this.profile_id != val.id){
        let loader = this.loadingCtrl.create({
          content: "Getting user's profile",
          spinner : 'dots'
        });
        loader.present().then(() => {
          this.http.get(MyApp.API_ENDPOINT+'/user/'+this.profile_id+'/info', this.httpOptions).map(res => res.json()).subscribe(data => {
            loader.dismiss();
            this.profile = data.data.profile;            
            this.editMyprofile = false;
            //this.collectionType = "HER COLLECTION" ; 
            if(this.profile.gender == 'male'){
              this.collectionType = "HIS COLLECTIONS"
            }
            else{
              this.collectionType = "HER COLLECTIONS"
            }
            //this.getBlockedStatus();            
            if(this.avatar_status == false) {
              this.avatar_status = this.navParams.get('avatarStatus');
            }
            else {
              this.avatar_status = data.data.profile.avatar_toggle;
            }
            if(this.profile.avatar_image){
              this.selected_image = this.profile.avatar_image.url;
            }
            else {
              this.selected_image = 'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/2015-11-06benatky-maska-10-radynacestu-pavel-spurek-2015.jpg';
            }
            if(data.data.profile.avatar_name) {
              this.streetName = data.data.profile.avatar_name;
            }
            this.getBookmarkedCards(data.data.profile.id);  
          },err => {
            loader.dismiss();
            let alert = this.alertCtrl.create({
              title: "Failure",
              message: "Sorry, something went wrong!",
              buttons: ["OK"]
            });
            alert.present();                   
          });
        });
      }
    });
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
    console.log(this.avatarGrid);    
  }

  gallery_run(fileInput:HTMLElement){    
    fileInput.click();       
  } 
  fileUpload(event) {
    let fileObj, attachPic;
    let loader = this.loadingCtrl.create({
      content: 'Uploading your image',
    });
    loader.present().then(() => {
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event:any) => {
          this.profile.profile_image = {
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
        this.updatedImage = data.data.download_url;        
        let headers = new Headers();
          headers.append( 'Content-Type', fileObj.type);
        let options = new RequestOptions({
          headers: headers                
        });
        loader.dismiss();
        this.avatar_status = false;
        this.http.put(url,fileObj,options).map(res => res.json()).subscribe(data => {          
        },err => {          
          //console.log(this.profile.profile_image.url);
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
      "profile_image": this.updatedImage
    }
    this.http.post(MyApp.API_ENDPOINT+'/user/profile/image/update', body, this.httpOptions).map(res => res.json()).subscribe(data => {
      //this.sg['myProfileData'] = data.data.user;
    });
  }

  getPlaceholder(feed) {
    if(feed) {
      if(feed.type == "Story.Poll") {
        if(feed.poll_type == "recommend") {
          return "What say you?"
        }
        else {
          return "Say something more..."
        }        
      }
      else if(feed.type == "Story.Post"){
        return "What say you?"
      }
      else if(feed.type == "Story.Review"){
        return "What's your feedback?"
      }
    }
  }
  getCardType(feed) {
    if(feed) {
      if(feed.type == "Story.Poll") {
        if(feed.poll_type == "recommend") {
          return "Ask"
        }
        else {
          return "Poll"
        }        
      }
      else if(feed.type == "Story.Post"){
        return "Discuss"
      }
      else if(feed.type == "Story.Review"){
        return "Rate"
      }
      else if(feed.type == "Story.Discover"){
        return "Discover"
      }
    }
  }
  displayTime(date): string{
    let diffDays, diffMonths, year, diffHours, diffMin;
    var currentDate = new Date();
    var res = date.split("T");
    var temp = res[0].split("-");
    var time = res[1].split(":");
    var sec = time[2].split(".");
    var yr = parseInt(temp[0]);
    var mon = parseInt(temp[1]) -1;
    var day = parseInt(temp[2]); 
    var hr = parseInt(time[0]);
    var min = parseInt(time[1]);
    var sec1 = parseInt(sec[0]);
    var dt = new Date(yr, mon,day, hr, min, sec1);
    diffDays = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())) /(1000 * 60 * 60 * 24));
    diffMonths = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())) /(1000 * 60 * 60 * 24 * 30));
    year = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())) /(1000 * 60 * 60 * 24 * 365));       
    var timeDiff = (currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000)) - (dt.getTime());  
    diffHours = Math.round(timeDiff / (1000*60*60) ) ;    // hours
    diffMin = Math.round(timeDiff / (1000*60) ) ;        // mins 
    
    if(diffDays > 6){ 
      let week =  Math.round(diffDays/7);
      if(week > 51){      
        return year+'Y ago';
      }
      else {
        return week+'W ago';
      }
    }
    else if(diffHours > 23){          
      return diffDays+'D ago';
    }    
    else if(diffMin > 59 ){     
      return diffHours+'h ago';       
    }
    else if(diffMin < 1){
      return 'now';
    }
    else {
      return diffMin+'m ago';
    }
  }

  getClass(optionId,responses) {
    //alert(id);
    for(var i=0;i<responses.length;i++){
      if(optionId == responses[i]){
          return true;
      }
    }
    return false;
  }

  myProfileId(loginUserId) {
    let loginUser_Id;
    if(loginUserId) {
      let temp1 = loginUserId.search("_");
      if(temp1 > 0) {
        loginUser_Id = loginUserId.split("_")[0];
        return loginUser_Id;
      }
      else {
        return loginUserId;
      }
    }
  }

  cardOwner(cardOwnerId) {
    let cardOwner_Id;
    if(cardOwnerId) {
      let temp1 = cardOwnerId.search("_");
      if(temp1 > 0) {
        cardOwner_Id = cardOwnerId.split("_")[0];
        return cardOwner_Id;
      }
      else {
        return cardOwnerId;
      }
    }
  }

  getBookmarkedCards(userId) {
    this.pageNumber = this.pageNumber+1;
    this.http.get(MyApp.API_ENDPOINT+'/user/'+userId+'/collection?page='+this.pageNumber+'&page_size=5', this.httpOptions).map(res => res.json()).subscribe(data => {
      let bookmarkedStories = data.data.stories;
      let bookmarkedStorieslength = this.bookmarkedStories.length;      
      for(var i=0;i<bookmarkedStories.length;i++) {
        this.bookmarkedStories.push(bookmarkedStories[i]);            
        if(bookmarkedStories[i].feed.type == 'Story.Review'){
          this.barChartOptions = this.barChartOptions;    
          this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
          this.barChartType = 'bar';
          this.barChartLegend = false;
          this.barChartData[(bookmarkedStorieslength+i)] = new Array(1);
          this.barChartData[(bookmarkedStorieslength+i)][0] = {data:bookmarkedStories[i].feed.graph_data};
          this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];                
        }
      }
      if(this.bookmarkedStories.length < 1) {
        this.errMsg = "No pinned items"
      }  
    });
  }

  doInfinite(infiniteScroll) {    
    setTimeout(() => {
      this.getBookmarkedCards(this.sg['myProfileData'].id);
      infiniteScroll.complete();
    }, 1000);
  }
  
  viewCard(storyId) {
    this.navCtrl.setRoot(TabsPage);
    this.sg['storyId']  =  storyId; 
    this.sg['token']  =  this.tkn_sb; 
    this.sg['filterBy']  =  'Collections'; 
    this.navCtrl.push(TabsPage, { selectedTab: 0 });   
  }

  myHashtag(value) {
    if(value) {
      value = value.trim(" ");    
      if(this.sg['myProfileData']) {
        for(var i=0;i<this.sg['myProfileData'].hashtags.length;i++) {
          this.sg['myProfileData'].hashtags[i] = this.sg['myProfileData'].hashtags[i].trim(" ");        
          if(this.sg['myProfileData'].hashtags[i].toLowerCase() == value.toLowerCase()) {
            return true;
          }        
        }
      }
    }    
  }

  getBlockedStatus() {
    this.http.get(MyApp.API_ENDPOINT+'/user/'+this.profile.id+'/info', this.httpOptions).map(res => res.json()).subscribe(data => {
      this.isBlocked = data.data.context.blocked;
    }, err => {      
    });
  }

  blockUser() {
    this.isBlocked = true;
    this.http.get(MyApp.API_ENDPOINT+'/user/'+this.profile.id+'/block', this.httpOptions).map(res => res.json()).subscribe(data => {
      this.isBlocked = true;
    }, err => {
      this.isBlocked = false;
    });
  }

  unblockUser() {
    this.isBlocked = false;
    this.http.get(MyApp.API_ENDPOINT+'/user/'+this.profile.id+'/unblock', this.httpOptions).map(res => res.json()).subscribe(data => {
      this.isBlocked = false;
    }, err => {
      this.isBlocked = true;
    });
  }

  startChat(id, name){
    let loader = this.loadingCtrl.create({
      content: 'Loading',
    });
    loader.present().then(() => {
      let body = {
        "to_user": id
      }
      this.http.post(MyApp.API_ENDPOINT+'/get/chat/user',body,this.httpOptions).map(res => res.json()).subscribe(data => {
        let chatId = data.data.id;
        let webChatId = data.data.chat_websocket_channel;
        loader.dismiss();
        this.navCtrl.push(MessagesPage, {id, name, chatId, webChatId});
      },
      err => {
        loader.dismiss();
      });              
    }); 
  } 
  
  viewImage(photos,userid,fileInput:HTMLElement) {    
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: [{ 
        url: photos.url, 
        // type: photos.attachment_type,
      }]
    }, {cssClass: 'my-modal-class'});
    modal.present();
  }

  getCollection(genType){
    if(genType && genType == 'male'){
      return "HIS COLLECTIONS"
    }
    else{
      return "HER COLLECTIONS"
    }
  }

  desChange(description, idx, storyIdx, eleId) { 
    var searchStatus = description.search('{"id"');
    if(searchStatus > -1) {
      var temp1 = description.split('{');
      var temp2 : any = "";
      var id = "", id_temp = "";
      var name = "", name_temp = "";
      var new_message= "";
      for(var i=0;i<temp1.length;i++){
        let comma = "";
        let isValid = temp1[i].indexOf('},');
        let isValid_1 = temp1[i].indexOf('}');
        if(isValid != -1 || isValid_1 != -1){
          temp1[i] = temp1[i].trim(" ");
          if(isValid != -1) {
            temp2 = temp1[i].split('},');
          }
          else {
            temp2 = temp1[i].split('}');
          }          
          for(var j=0;j<temp2.length;j++) {
            var searchStatus1 = temp2[j].search(','); 
            if(searchStatus1 > -1) {
              if(temp2[j].split(',') && temp2[j].split(':')) {
                id_temp = temp2[j].split(',')[0].split(':')[1];
                name_temp = temp2[j].split(',')[1].split(':')[1];
                // id =id.substring(2,id.length-1);
                // name = name.substring(2,name.length-1);
                if(id_temp) {
                  id = temp2[j].split(',')[0].split(':')[1];
                  id =id.substring(2,id.length-1);
                }
                if(name_temp) {
                  name = temp2[j].split(',')[1].split(':')[1];
                  name = name.substring(2,name.length-1);
                  if(isValid != -1) {
                    comma = ","
                  }
                  new_message = new_message+' <span style="color:#65A0E6" (click)="openProfile()">'+"@"+name+'</span> '
                  +' <span>'+comma+'</span> ';
                }
                else if(!id_temp || !name_temp) {
                  new_message = new_message+" "+temp2[j];
                }
                
              }
            }
            else {
              new_message = new_message+" "+temp2[j];
            }
          }         
          //new_message = new_message+' <a onClick="openProfile('+id+')">'+"@"+name+'</a> ';        
        }
        else{
          new_message = new_message+temp1[i];
        }       
      }
      return document.getElementById(eleId+storyIdx+idx).innerHTML = new_message;
    }
    else {
      return description;
    }    
  }

  getVotingText(options) {
    let votes = 0;
    if(options.length > 0) {
      for(var i=0;i<options.length;i++) {
        votes = options[i].response_count+votes;
      }
      if(votes == 1) {
        return votes+' '+"vote. Vote, to see results.";
      }
      else if(votes > 1) {
        return votes+' '+"votes. Vote, to see results.";
      }
      else if(votes == 0) {
        return "Be the 1st to vote!";
      }
      else {
        return "";
      }
    }
  }

  getReviewText(story) {
    if(story.feed.votes > 0 && !story.user.is_answered) {
      if(this.myProfileId(this.profile.id) != this.cardOwner(story.feed.user.id)) {
        let text;
        if(story.feed.votes == 1) {
          text = "rating.";
        }
        else if((story.feed.votes > 1)) {
          text = "ratings.";
        }
        return story.feed.votes+' '+text+" Rate, to see results.";
      }      
    }
    else if(story.feed.votes == 0) {
      if(this.myProfileId(this.profile.id) != this.cardOwner(story.feed.user.id)) {
        return "Be the 1st to rate!";
      }      
    }
    else {
      return "";
    }
  }

  getText(story) {
    if(story.feed.type == 'Story.Review'){      
      return 'feedback..';
    }    
    else if(story.feed.type == 'Story.Post'){
       return 'attention..';    
    }
    else if(story.feed.type == 'Story.Poll'){      
      if(story.feed.poll_type == 'poll'){
        return 'vote..';        
      }
      else {
        return 'suggestions..' ;
      }              
    }
  } 
  displayTitle(title){
    let temp = title.trim(" ");
    let temp1 = temp.toLowerCase();  
    let temp2 = temp1.search("http");  
    let temp_u:any;
      if(temp2 > -1) {
        let n = temp1.search("http");
        let a = temp1.length;
        let res = temp1.substr(n, a);
        let res1 = temp1.split(" ");
          for(var i=0;i<res1.length;i++){
            var url1 = res1[i].search("://");
              if(url1 > -1){
                temp_u = res1[i].substr(0,38)+"..." ;
              }
          }
       var text = "" ;
       let textInput = title.trim(); 
       let textInput1 = textInput.split(" ");
        if(textInput1){
            for(var i=0;i<textInput1.length;i++){
              var url = textInput1[i].search("://");
                if(url > -1){
                  let  temp = title;
                  text = temp.replace(textInput1[i] , temp_u );
                  return title = text;
                }
            }
        }
      }else{
        return title;
      }
  }
  
}