import { Component,ElementRef,ViewChild, NgZone} from '@angular/core';
import { NavController, Content,ToastController, MenuController,NavParams, AlertController, Nav, Platform, Slides, ModalController, Keyboard, Tabs, App} from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';
//import { Crop } from '@ionic-native/crop';
import { CommentPage } from '../comment/comment';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PopoverController } from 'ionic-angular';
import { SharepopupPage } from '../share_popup/share_popup';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import {Http, Headers, RequestOptions} from '@angular/http';
import { MyApp } from '../../app/app.component';
import { LoadingController } from 'ionic-angular';
import { UserInterestService } from '../../providers/userInterest.service';
import { ZoneTimelinePage } from '../zoneTimeline/zoneTimeline';
import { PopupMorePage } from '../popup-comingsoon/popup-comingsoon';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SimpleGlobal } from 'ng2-simple-global';
import { PopupDeletePage } from '../popup-delete/popup-delete';
import { AppMinimize } from '@ionic-native/app-minimize';
import { NotificationListPage } from '../notificationList/notificationList';
import { Firebase } from '@ionic-native/firebase';
import { PopupCrowdReachCountPage } from '../popup-crowdReachCount/popup-crowdReachCount';
import { LoginPage } from '../login/login';
import { YourProfilePage } from '../your_profile/your_profile';
import { PopupCrowdInfoPage } from '../popup-crowdInfo/popup-crowdInfo';
import { ImagePicker } from '@ionic-native/image-picker';
import { ProfileUserPage } from '../profile_user/profile_user';
import { TabsPage } from '../tabs/tabs';
import { ChatListPage } from '../chatList/chatList';
import { InvitePopupPage } from '../invite-popup/invite-popup';
import { MessagesPage } from '../messages/messages';
//import * as $ from "jquery";

declare var Pusher:any ;
declare var google:any;
declare var window:any;
declare function unescape(s:string): string;
@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
  providers: [UserInterestService]    
})
export class TimelinePage {
  @ViewChild(Content) content: Content;
  @ViewChild('fileInput') el:ElementRef;
  @ViewChild('htmlInsideModal') el1:ElementRef;
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Slides) slides: Slides;
  tab :Tabs;

  topCard :boolean = true; taggedCard : string; discussCard : any; 
  fireBaseTkn : any; createdMode:boolean = false; story_target_method:any; crowd_count:any;target_values:any; errMsg:any=null; places:any;
  interestId = []; crowd_reach_count:any;nearMe:any;current_address={};specific_address={}; storySimilarId:any; showSimilar:boolean = false;
  agechoice : string = null; locationChoice: string = null; crowdChoice : any; choosingType:any; askAll: string = null;specificLoc:null; 
  hashtagStories :any = null; askEveryone:boolean = false; selectedChoice : boolean = false; creatingCard :boolean = false; 
  isValid : boolean;  preview : any; selectedDiscuss:boolean = true; selectedReview:boolean = false; isCreationMode : boolean = false;
  selectedPoll :boolean = false; selectedRecommend :boolean = false; recSelect:boolean; locationStatus:string = 'current'; 
  specific_location:any; selectedHashTags = []; allcards = 'discuss'; registration : boolean = true; addhashtag:boolean=false; hashtagInput:any; 
  tags:any; specific_age:string='myAge'; minAges:any = []; maxAges:any = []; min_age:any = null; max_age:any=null;
  targetValue :any; chooseaction : boolean = false; //categoryscreen  : boolean = false; actionChosen: string = "discover";
  inputs: Array<{placeholder: any}>; options:Array<any> = []; optionsLength : number = 0; interests:any; reviewType : string = "get_feedback"; 
  give_feedback_des :string; post_que : any; get_feedback_des :string; cardType : string = 'discussion'; post_question : string;
  get_feedback_description : string; give_feedback_description : string; imagePreview : any; imagePreview1 : any;  give_attach : any; 
  topUpStatus : boolean = false; feedbackStatus : boolean = false; animation : boolean = false; fadeInRight : boolean ;  activatePadding : boolean = true; 
  filteredHashTag:any; filterbyHash:boolean = false; myHashtagStatus:any; cardDisabled = []; fadeOutLeft = []; bdayWishes : boolean = true; 
  postCharacterleft : number = 200; maxlength=200; postMaxlength = 200; my_index: any = 0; discplaceholders : any;  notification_count : number; 
  filterCard : boolean = true; systemCard : any; stories = [];  color:any;  rangeValue :any; checked = [];  tkn_sb:any; userProfile : any; 
  pageNumber :number = 1; discoverPageNumber  = [] ;  selected_item : any; textInput = []; name : any; textInputReview = []; percentage = []; barChartOptions:any; barChartLabels :string[]; 
  barChartType:string; barChartLegend:boolean = false;  barChartData = []; barChartColors:Array<any>; rangeDisabled = []; doneBtn = [];
  description = []; attachPic : any; searchResults : number; attachedImages = []; isShowAllHashtags = [];  httpOptions= {}; 
  showLoader:boolean = false; postCardDescription:any = ""; postCardDescriptionLength:number = 3000; descriptionMaxLength:number = 3000;
  end_url: string;  preview_review: any; userList = []; people = []; message_users = []; ratingCharacterleft: number = 3000;
  myColor: string;  myHeight : any;  show_page: any = ""; isValidExp = []; isAnimation = []; isCancelled = [];

  cardStatus_1: boolean = true; cardStatus_2: boolean = false; cardStatus_3 : boolean = false; cardStatus_4 : boolean = false; 
  targetMethod = "category";
  interestchoice: any;
  selectedInterest: any = [];
  categoryName: any = [];
  validUrl: any;

  constructor(public navCtrl: NavController,
    private socialSharing: SocialSharing,
    public popoverCtrl: PopoverController, 
    private camera: Camera, 
    private storage: Storage, 
    private http: Http, 
    public loadingCtrl: LoadingController,
    private menu: MenuController,
    public userService: UserInterestService,
    public navParams: NavParams, 
    private alertCtrl: AlertController,
    public sg: SimpleGlobal,
    private iab: InAppBrowser,             
    public platform: Platform,
    private appMinimize: AppMinimize, 
    public zone: NgZone,
    public toastCtrl: ToastController, 
    private firebase: Firebase,
    private imagePicker: ImagePicker,
    public modalCtrl:ModalController,
    public keyboard: Keyboard,
    public appCtrl : App ) {
      
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
      this.sg['token'] = val;      
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','Accept':'application/json', 'token': this.tkn_sb })
      };
      if(this.sg['filteredStories']) {      
        this.filterByHashtag(this.sg['isMyHashtagStatus']);      
      }       
      this.http.get(MyApp.API_ENDPOINT+'/user/preferences/default/get',this.httpOptions).map(res => res.json()).subscribe(data => {
        this.interests = data.data.preferences;
        this.resetInterests();        
      });
      setTimeout(() => {
        if(!this.show_page) {
          this.initialiseCards();
        }
      }, 500)
      // let res = {'icon_url': 'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/forEva-icon.png', 'show_page': 'story', 'data': {'story_id': '5c2cae419f07900001da96a5'}, 'notification_type': 'LIKE'}
      // this.sg['storyId'] = res.data.story_id; 
      // this.sg['filterBy'] = "NOTIFICATION ALERT";              
      // this.getStory();            
      this.firebase.getToken().then(token => {
        this.fireBaseTkn = token;                          
        let body = {            
          "platform": "",            
          "device_id": token                    
        }
        if (this.platform.is('android')) {
          body.platform = 'android';
        }
        if (this.platform.is('ios')) {
          body.platform = 'ios';
        }                                                 
        this.http.post(MyApp.API_ENDPOINT+'/me/device/register',body,this.httpOptions).map(res => res.json()).subscribe(data => {          
        }, err => {          
        }); 
      }).catch(error => {        
      });      
      this.firebase.onNotificationOpen().subscribe(data => {                                              
        this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(data => {          
          this.sg['myProfileData'] = data.data;
          this.notification_count = data.data.new_notification_count;
        }); 
        if(data.tap){ 
          this.show_page =  data.show_page;       
          if(data.show_page == 'notification_stack') {
            this.navCtrl.push(NotificationListPage);            
          }
          else if(data.show_page == 'story') {
            this.sg['filterBy'] = "NOTIFICATION ALERT";            
            // alert("data"+JSON.stringify(data));
            // alert("data1"+data.data_story_id);
            let id = data.data_story_id; 
            this.sg['storyId'] = id;
            // alert("id"+this.sg['storyId']);
            // alert("filterby"+this.sg['filterBy']);           
            this.getStory();            
          }
          else {
            //alert("data"+JSON.stringify(data));          
          }
        } 
        else {}; 
      });      
    });
  }

  resetInterests() {
    if(this.interests && this.interests.length > 0) {
      for(var i=0;i<this.interests.length;i++) {
        this.interests[i].set = false;
      }
    }    
  }

  getVotingText(story) {
    let votes = 0;
    if(story.feed.options.length > 0 && story.feed.poll_type == 'poll') {
      for(var i=0;i<story.feed.options.length;i++) {
        votes = story.feed.options[i].response_count+votes;
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
    else {
      return "";
    }
  }

  getReviewText(story) {
    if(story.feed.votes > 0 && !story.user.is_answered) {
      if(this.myProfileId() != this.cardOwner(story.feed.user.id)) {
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
      if(this.myProfileId() != this.cardOwner(story.feed.user.id)) {
        return "Be the 1st to rate!";
      }      
    }
    else {
      return "";
    }
  }

  ionViewDidEnter() {    
    this.getWishes();
    this.sg['http'] = this.http;
    //this.wishesPage = true; 
    this.initializeInputs();
    this.tab = this.navCtrl.parent;     
    this.sg['cardHidden'] = []; 
    this.end_url = MyApp.API_ENDPOINT;     
    this.discplaceholders = ["What say you?"];    
    setInterval(()=>{      
      if( this.discplaceholders.length-1 == this.my_index){
        this.my_index = 0;
      }
      else{
        this.my_index = this.my_index+1;        
      }
    },2000);
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

  /* new user orientation pagination starts here */  
  startDiscussion(value){
    let tempPost ;
    tempPost = value.trim(" ");
    if(tempPost){
      if(tempPost.length > 0){
        this.creatingCard = true;
        this.registration = true;
        this.selectedDiscuss = false;
        this.selectedReview = false;
        this.selectedPoll = false;
        this.selectedRecommend = false;        
        this.allcards = 'discuss';
        this.selectedDiscuss = true;        
      }
    }
  }
  addHashTag() {
    if(this.post_question) {
      this.addhashtag = true;
      this.creatingCard = false;
      this.registration = false;
    }    
  }  
  askCrowd(){
    this.askEveryone = true;
    this.creatingCard = false;
    this.registration = false;
    this.addhashtag = false;
  } 
  createCard(value){
    this.content.scrollToTop();    
    this.cardType = value;
    this.creatingCard = true;
    this.registration = true;
    this.selectedDiscuss = false;
    this.selectedReview = false;
    this.selectedPoll = false;
    this.selectedRecommend = false;
    if(value == 'discussion'){
      this.discplaceholders = ["What say you?"];      
      this.allcards = 'discuss';
      this.selectedDiscuss = true;
    }
    else if(value == 'review'){
      this.discplaceholders = ["Share or ask for a review/rating.."];
      this.allcards = 'review';
      this.selectedReview = true;
    }
    else if(value == 'poll'){
      this.discplaceholders = ["Run a poll on.."];
      this.allcards = 'poll';
      this.selectedPoll = true;
    }
    else {
      this.discplaceholders = [ "Get suggestions on.."];
      this.allcards = 'recommend';
      this.selectedRecommend = true;
    }    
  }
  viewImage(index, photos) {
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: photos,
      initialSlide: index
    },
    {cssClass: 'my-modal-class'});
    modal.present();
  }
  switchAvatar(name, toggleStatus){
    let body = {};
    if(this.sg['myProfileData'] && !toggleStatus && (!this.sg['myProfileData'].avatar_name || !this.sg['myProfileData'].avatar_image || !this.sg['myProfileData'].avatar_image.url)) {
      // let alert = this.alertCtrl.create({
      //   title: "Alert",
      //   enableBackdropDismiss:false,
      //   message: "Sorry!! You don’t have an avatar setup. Please go to edit profile and setup an avatar.",
      //   buttons: [{
      //     text: 'OK',
      //     handler: () => {
                 
      //     }
      //   }]
      // });
      // alert.present();
      let toast = this.toastCtrl.create({
        message: "Sorry!! You don’t have an avatar setup. Please go to edit profile and setup an avatar.",
        duration: 3000,
        position : "middle"
      });
      toast.present();
    }
    else {           
      if(toggleStatus == false){
        if(this.sg['myProfileData'].avatar_name){
          this.name = this.sg['myProfileData'].avatar_name.split(" ")[0];
          //this.name = this.sg['myProfileData'].avatar_name;
          this.sg['myProfileData']['avatar_toggle'] = true;
          body['avatar_toggle'] = "true"; 
          //this.getUserName();               
        }
        else {
          this.name = this.sg['myProfileData'].name.split(" ")[0];
        }      
      }
      else if(toggleStatus == true){
        if(this.sg['myProfileData'].name){
          this.name = this.sg['myProfileData'].name.split(" ")[0];
          //this.name = this.sg['myProfileData'].name;
          this.sg['myProfileData']['avatar_toggle'] = false;
          body['avatar_toggle'] = "false";        
        }
        else {
          this.name = 'User';
        }                 
      }       
      this.http.post(MyApp.API_ENDPOINT+'/user/set/avatar',body, this.httpOptions).map(res => res.json()).subscribe(data => {
        this.getMyProfile();
      });
    }   
  }  
  getMyProfile(){
    this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(val => {      
      this.sg['myProfileData'] = val.data;
      this.notification_count = this.sg['myProfileData'].new_notification_count ;
      //this.storage.set('userProfile', val.data);
      if(val.data){
        if(val.data.name  && val.data.avatar_toggle == false){
          let name = (val.data.name).split(" ") ;
          this.name = name[0];
        }
        else if(val.data.avatar_name  && val.data.avatar_toggle == true){
          let name1 = (val.data.avatar_name).split(" ") ;
          this.name = name1[0].charAt(0).toUpperCase() + name1[0].slice(1);
        }
        else {
          this.name = 'User';
        }
      }  
    });      
  }
  changeCardType(value){
    this.cardType = value;
    this.selectedDiscuss = false;
    this.selectedReview = false;
    this.selectedPoll = false;
    this.selectedRecommend = false;    
    if(value == 'discussion'){
      this.discplaceholders = ["What say you?"];      
      this.registration = true;
      this.creatingCard = false;
      this.selectedDiscuss = true;
    }
    else if(value == 'review'){
      this.discplaceholders = ["Share or ask for a review/rating.."];
      this.selectedReview = true;
    }
    else if(value == 'poll'){
      this.discplaceholders = ["Run a poll on.."];
      this.selectedPoll = true;
    }
    else if(value == 'recommend'){
      this.discplaceholders = [ "Get suggestions on.."];
      this.selectedRecommend = true;
    }
  }
  ask_all(target) {    
    if(this.askAll === 'askall') {
      this.askAll = null;      
    }
    else {
      this.askAll = 'askall';
      this.choosingType = 'askall';
      this.targetMethod = 'everyone';
      this.agechoice = null;
      this.locationChoice = null;
      this.targetValue = "";
      this.targetMethod = target;          
    }
  }    
  
  getLocation(){
    let that = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }  
    function showPosition(position) {
      //let that = this;
      var location = [];
     // let that = this;   
      var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var geocoder = geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            var temp = results[0].formatted_address;
            console.log(JSON.stringify(results[0])); 
            that.current_address['components'] = results[0];           
            location = temp.split(",");
            if(location && location.length > 3){
              var count = location.length;
              that.nearMe =  location[count-4];
              console.log(that.nearMe);                            
            }
            if(location && location.length == 1){
              that.current_address['country'] = location[0].trim(" ");
            }
            else if(location && location.length == 2){
              that.current_address['country'] = location[1].trim(" ");
              var tempState = location[0].trim(" ");
              var tempState1 = tempState.split(" ");
              let tempState3:any = "";              
              for(var i=0;i<tempState1.length;i++){
                if(isNaN(tempState1[i])){
                 // tempState2.push(tempState1[i]);
                 tempState3 = tempState3+' '+tempState1[i]
                }
              }                                   
              that.current_address['state'] = tempState3.trim(" ");
            }
            else if(location && location.length == 3){
              that.current_address['country'] = location[2].trim(" ");
              var tempState = location[1].trim(" ");
              var tempState1 = tempState.split(" ");
              let tempState3:any = "";
              for(var i=0;i<tempState1.length;i++){
                if(isNaN(tempState1[i])){
                 // tempState2.push(tempState1[i]);
                 tempState3 = tempState3+' '+tempState1[i]
                }
              } 
              that.current_address['state'] = tempState3.trim(" ");
              that.current_address['city'] = location[0].trim(" ");
            }
            else if(location && location.length > 3){
              var count = location.length;
              that.current_address['country'] = location[count-1].trim(" ");
              var tempState = location[count-2].trim(" ");
              var tempState1 = tempState.split(" ");
              let tempState3:any = " ";              
              for(var i=0;i<tempState1.length;i++){
                if(isNaN(tempState1[i])){
                 // tempState2.push(tempState1[i]);
                 tempState3 = tempState3+' '+tempState1[i]
                }
              }
              //console.log(tempState3); 
              that.current_address['state'] = tempState3.trim(" ");
              that.current_address['city'] = location[count-3].trim(" ");
              that.current_address['sublocality'] = location[count-4].trim(" ");
            }
          }          
        }
      });
    }
    console.log(that.current_address);
  }
  specificAge(value){
    if(this.specific_age === value) {
      this.specific_age = value;      
    }
    else {
      this.specific_age = value;
      this.minAges = [];
      this.maxAges = [];
      for(var i=18;i<100;i++){
        this.minAges.push(i);
      }
      for(var i=19;i<101;i++){
        this.maxAges.push(i);
      }
    }
  }
  minAge(event) {   
    let max = event+1;
    this.maxAges = [];
    for(var i=max;i<101;i++){
      this.maxAges.push(i);
    }
    if(this.min_age >= this.max_age) {
      this.max_age = null;
    }           
  }
  // maxAge(event) {   
  //   let min = event;
  //   this.minAges = [];
  //   for(var i=18;i<event;i++){
  //     this.minAges.push(i);
  //   }        
  // }
  selectLocation(){   
    if(this.locationStatus == 'current'){
      this.locationStatus = 'specific';      
    }
    else {
      this.locationStatus = 'current';
    }
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
    that.specific_location = selectedPlace.description;
    location = selectedPlace.description.split(","); 
    var geocoder = new google.maps.Geocoder;       
    geocoder.geocode({'placeId': selectedPlace.place_id}, function(results, status) {
      //let that = this;
      if (status === 'OK') {
        if (results[0]) { 
          console.log(results[0]);
          that.specific_address['components'] = results[0];
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
        }
      }
    });
    that.places = null;
  }   
  backToAskcrowd(value){
    this.content.scrollToTop();
    if(value == 'askCrowd'){
      //this.askEveryone = true;
      this.addhashtag = true;
      this.selectedChoice = false; 
      this.interestchoice = null;           
      this.agechoice = null;
      this.locationChoice = null;
      if(this.choosingType == 'interest'){
        this.interestchoice = 'interest';
      }           
      else if(this.choosingType == 'age'){
        this.agechoice = 'age';
      }
      else {
        this.locationChoice = 'location';
      }      
    }
    else if(value == 'registration'){
      this.discplaceholders = ["What say you?"];
      this.registration = true;
      this.creatingCard = false;      
      this.closingCard('selectionChoice');
    }
    else if(value == 'createCard'){
      this.creatingCard = true;
      this.askEveryone = false;
      this.registration = true;
      this.addhashtag = false; 
      this.cardStatus_2 = true; 
    }
    else if(value == 'addhashTag') {
      //this.discplaceholders = ["State of indian economy", "Does God exist?", "Future of work."];
      this.askEveryone = false;
      this.addhashtag = true;
    }
  }

  categorySelection(interest, idx){
    this.interestId = [], this.categoryName = [];             
    if(this.interests[idx].set == true) {
      this.interests[idx].set = false;
      //this.count = this.count-1;
      for(var i=0;i<this.interests.length;i++){
        if(this.interests[i].set == true){
          this.categoryName.push(this.interests[i].category.name);
          this.interestId.push(this.interests[i].category.id);
        }
      }    
    }
    else {
      //this.count = this.count+1;   
      this.interests[idx].set = true;     
      for(var i=0;i<this.interests.length;i++){
        if(this.interests[i].set == true){
          this.categoryName.push(this.interests[i].category.name);
          this.interestId.push(this.interests[i].category.id);
        }
      }       
    }
  }

  previous() {
    if(this.cardStatus_2) {
      this.cardStatus_1 = true;
      this.cardStatus_2 = false;
    }
    // else if(this.cardStatus_3) {
    //   this.cardStatus_3 = false;
    //   this.cardStatus_2 = true;
    // }
    // else if(this.cardStatus_4) {
    //   this.cardStatus_4 = false;
    //   this.cardStatus_3 = true;
    // }
  }

  chooseTarget(value) {
    this.targetMethod = value;
    this.cardStatus_4 = true;
    this.cardStatus_3 = false;
    if(value == 'age'){
      this.agechoice = value;
      this.crowdChoice = 'Age';      
      this.locationStatus =  "current";    
    }
    else if(value == 'location'){
      this.getLocation();
      this.locationChoice = value;
      this.crowdChoice = 'Location';          
      this.specific_age = "myAge";     
    }
    else {
      this.selectedChoice = true;
      this.askEveryone = true;
      this.askAll = value;                
    }
  }

  chooseType(value, target){
    this.content.scrollToTop();
    this.interestchoice = null;        
    this.agechoice = null;
    this.locationChoice = null;
    this.crowdChoice = null;   
    this.choosingType = value;
    this.targetMethod = target;
    this.selectedChoice = true;
    this.askEveryone = false;
    this.addhashtag = false;
    this.askAll = null;
    if(value == 'interest'){
      this.interestchoice = value;      
      this.crowdChoice = 'Interest';
      //this.selectedGender = null;
      this.locationStatus =  "current";
      this.specific_age = "myAge";      
    }
    else if(value == 'age'){
      this.agechoice = value;
      this.crowdChoice = 'Age';      
      this.locationStatus =  "current"; 
      this.selectedInterest = null;   
    }
    else if(value == 'location'){
      this.getLocation();
      this.locationChoice = value;
      this.crowdChoice = 'Location';          
      this.specific_age = "myAge";
      this.selectedInterest = null;     
    }
    else {
      this.selectedChoice = true;
      this.askEveryone = true;
      this.askAll = value;                
    }    
  }

  publish() {
    if(this.cardStatus_2) {
      this.cardStatus_2 = false;      
      this.addHashTag();
    }    
    // else if(this.cardStatus_3) {
    //   this.cardStatus_3 = false;
    //   this.cardStatus_4 = true;
    // }        
  }

  showCrowdReach(){
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Loading'      
    });
    loader.present().then(() => {
      let count;    
      let body = {
        "target_method": this.targetMethod      
      }
      // if(value == 'hashtagTarget') {
      //   let tempTags = [];
      //   if(this.selectedHashTags.length > 0) {        
      //     for(var i=0;i<this.selectedHashTags.length;i++) {
      //       tempTags.push(this.selectedHashTags[i]);
      //     }
      //     body['hashtags'] = tempTags;
      //   }
      //   body['target_method'] = "everyone";
      //   body["target_values"] = "";
      // }
      if(this.targetMethod == 'category'){
        let tempTags = [];          
        body["target_values"] = this.interestId;
        if(this.selectedHashTags.length > 0) {        
          for(var i=0;i<this.selectedHashTags.length;i++) {
            tempTags.push(this.selectedHashTags[i]);
          }
          body['hashtags'] = tempTags;
        }
        if(this.interestId.length < 1) {
          body['target_method'] = "everyone";
          body["target_values"] = "";
        }
      }
      else if(this.targetMethod == 'everyone') {
        body["target_values"] = "";
      }      
      else if(this.targetMethod == 'age_range') {
        if(this.specific_age == 'myAge'){
          let age;
          if(this.sg['myProfileData'].age_range){
            age = this.sg['myProfileData'].age_range.split("-");
          }            
          let minage = parseFloat(age[0].replace(/,/g, ''));
          let maxage = parseFloat(age[1].replace(/,/g, ''));
          body["target_values"] = {"min":minage,"max":maxage};
        }
        else {
          let minage = this.min_age;
          let maxage = this.max_age;
          //let maxage = parseFloat(this.max_age.replace(/,/g, ''));
          body["target_values"] = {"min":minage,"max":maxage};
        }          
      }
      else if(this.targetMethod == 'gender') {
        body["target_values"] = this.targetValue;
      }
      else if(this.targetMethod == 'location') {
        if(this.locationStatus == 'specific') {
          body["target_values"] = this.specific_address;
        }
        else {
          body["target_values"] = this.current_address;
        }        
      }   
      this.http.post(MyApp.API_ENDPOINT+'/get/crowd/reach/count',body, this.httpOptions).map(res => res.json()).subscribe(data => {
        loader.dismiss();
        this.crowd_reach_count = data.data; 
        let popover = this.popoverCtrl.create(PopupCrowdReachCountPage, {"count":this.crowd_reach_count, 
                                                                  "tags":this.selectedHashTags, 
                                                                  "targetMethod":this.targetMethod,
                                                                  "value":this.targetValue,
                                                                  "age":this.specific_age,
                                                                  "location":this.locationStatus,
                                                                  "category":this.categoryName,
                                                                  "specificlocation":this.specificLoc,
                                                                  "nearme":this.nearMe,
                                                                  "myage":this.sg['myProfileData'].age_range,
                                                                  "minage":this.min_age,
                                                                  "maxage":this.max_age
                                                              });
        popover.present({});
        popover.onDidDismiss(data => {
          if(data == "choose") {
            this.chooseAgain();
          }
          else if(data == "publish"){
            this.publishCard();
          }
          else {

          }          
        })      
      },err => {loader.dismiss();});
    });    
  } 
  chooseAgain() {    
    if(this.targetMethod != 'everyone'){
      this.selectedChoice = false;
    }
    //this.askEveryone = true;
    this.addhashtag = true;    
  } 
  /* new user orientation pagination ends here */
  closeSysCard(){
    this.systemCard = false;
    let headers = new Headers( );  
      headers.append( 'Content-Type','application/json');
      headers.append( 'Accept', 'application/json');
      headers.append( 'token', this.tkn_sb);    
    let options = new RequestOptions({
              headers: headers                
    });
    this.http.post(MyApp.API_ENDPOINT+'/me/system/card/clear',{}, options).map(res => res.json()).subscribe(data => {
      if(data.status == true){
        this.systemCard = false;
        this.creatingCard = false;
        this.registration = true;
      }        
    }); 
  }
  discoverMore(feed, idx){
    this.discoverPageNumber[idx] = this.discoverPageNumber[idx]+1;
    this.firebase.logEvent("discover_scroll", {content_type: "card", item_name: feed.title, page_no:this.discoverPageNumber[idx]});
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Getting more discoveries'
      // spinner: 'hide',
      //content: this.safeSvg,
    });
    loader.present().then(() => {
    let headers = new Headers( );  
      headers.append( 'Content-Type','application/json');
      headers.append( 'Accept', 'application/json');
      headers.append( 'token', this.tkn_sb);    
    let options = new RequestOptions({
      headers: headers                
    });
    this.http.get(MyApp.API_ENDPOINT+'/story/discover/'+feed.id+'/all?page='+this.discoverPageNumber[idx]+'&page_size=10',options).map(res => res.json()).subscribe(data => {
      loader.dismiss();
      if(data.data.length > 0){
        for(var i=0; i<data.data.length; i++){
          this.stories[idx][0].feed.results.push(data.data[i]);                  
        }          
      }
      else {
        this.cardDisabled[idx] = true;
        // let alert = this.alertCtrl.create({
        //   title: "Alert",
        //   message: "No more discoveries",
        //   buttons: [{
        //     text: 'OK',
        //     handler: () => {}
        //   }]
        // });
        // alert.present();
        let toast = this.toastCtrl.create({
           message: "No more discoveries",
          duration: 3000,
          position : "middle"
        });
        toast.present();
      }      
    },err => {
      loader.dismiss();
    });
  });  
 } 
  getWishes():any {
    //this.storage.get('userProfile').then((val) => {
      if(this.sg['myProfileData'] && this.sg['myProfileData'].dob){
        var res = this.sg['myProfileData'].dob.split("T");
        var temp = res[0].split("-");
        var time = res[1].split(":");
        var sec = time[2].split(".");
        //var yr = parseInt(temp[0]);
        var mon = parseInt(temp[1])-1;
        var day = parseInt(temp[2]);
        var currentDate = new Date(); 
        var currentMon = currentDate.getMonth();
        var currentDay = currentDate.getDate() 
        setTimeout(() => {
          if(mon == currentMon && day == currentDay){
            this.bdayWishes = false ;
          }
          else {
            this.bdayWishes = true ;
          }
        },500);    
      }
    //});
  }
  popuplooking(){
    let popover = this.popoverCtrl.create(PopupCrowdReachCountPage);
      popover.present({        
    }); 
  }  
  count(msg, value){    
    if(value == 'post') {
      if(this.postMaxlength>=msg.length){
        this.postCharacterleft=(this.postMaxlength)-(msg.length);
      }
    }       
  }
  postDesCount(msg, value){
    if(value == 'post') {
      if(this.descriptionMaxLength>=msg.length){
        this.postCardDescriptionLength=(this.descriptionMaxLength)-(msg.length);
      }
    }
  }  
  displayTime(date): string{
    let diffMin, diffHours, diffDays, diffMonths, year;
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
  onScroll($event) {  
    this.zone.run(() => {
      if ($event.scrollTop > 150){        
        this.keyboardOpens('nothing');
      }
      else {
        this.topUpStatus = false;
      }
    })
  }
  commaSeparate(): string {
    let number = 1234567890;
    console.log(number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  morePopup(idx, feedId, childIdx, storyId, userId) {
    //this.stackedDiscoveries[idx] = false;    
    let popover = this.popoverCtrl.create(PopupDeletePage, {
      enableBackdropDismiss : false,
      cssClass: 'alertCustomCss',
      feedId , idx, token : this.tkn_sb, childIdx, storyId, userId
    });
    popover.present();     
  }
  
  closingCard(value){
    this.resetInterests();
    this.validUrl = "";    
    this.topCard = true;
    this.createdMode = false;
    this.cardType = "discussion";      
    this.topUpStatus = false;
    this.isCreationMode = false;
    this.reviewType  = "get_feedback";    
    this.isShowAllHashtags = [];
    this.selectedInterest = null;
    this.categoryName = [];
    this.cardStatus_1 = true;
    this.cardStatus_2 = false;
    this.selectedDiscuss = true;
    this.selectedReview = false;
    this.selectedPoll = false;
    this.selectedRecommend = false;
    this.discussCard = null;    
    this.rangeValue = null;
    this.post_que = "";
    this.postCardDescription = "";   
    this.post_question = "";    
    this.options = [];   
    this.give_feedback_des = "";   
    this.give_feedback_description = "";
    this.imagePreview = null;
    this.attachedImages = [];    
    this.imagePreview1 = null;
    this.give_attach = null;
    this.feedbackStatus = false;
    this.interestchoice = null;
    //this.Tap_Explore = false;    
    this.postCharacterleft  = 200;                
    this.agechoice = null;
    this.locationChoice = null;    
    this.min_age = null;
    this.max_age = null;
    this.specific_age = 'myAge';
    this.locationStatus = 'current';
    this.specific_location = null;
    this.interestId = [];    
    this.askAll = null;
    this.addhashtag = false;
    //this.selectedGender = null;
    this.registration = true;
    this.selectedHashTags = [];
    this.tags = null;
    this.nearMe = null;
    this.targetMethod = ""; 
    this.targetValue = "";
    this.initializeInputs();
    if(value == 'chooseaction'){
      this.chooseaction = false;           
    }
    else if(value == 'selectionChoice') {
      this.selectedChoice = false;
      this.registration = true;
    }
    else if(value == 'askall') {
      this.askEveryone = false;
      this.registration = true;
    }
    // else if(value == 'discusschoice'){
    //   this.discusschoice = false;
    // }
    else if(value == 'discussCard'){
      this.discussCard = "";      
    }       
    else if(value == 'bdayWishes'){
      this.bdayWishes = true; 
      this.fadeInRight = true;             
    }
  }
  
  back_1() {
    this.content.scrollToTop();
    this.fadeInRight = false;    
    this.discussCard = this.taggedCard;
  }
  back_2() {
    this.content.scrollToTop();
    if(this.discussCard) {
      this.fadeInRight = false;   
      this.discussCard = null;
      //this.discusschoice = true;
      this.topCard = true;   
      //this.wishesPage = true;    
    }    
  }
  backToDiscuss() {
   this.content.scrollToTop();
   this.fadeInRight = false;    
   //this.categoryscreen = true;
   //this.discussCard = this.taggedCard ;
  }
  back_3() { 
    this.content.scrollToTop();
    this.fadeInRight = false; 
    //this.categoryscreen  = false;
    this.discussCard = this.taggedCard;    
    if(this.taggedCard == "give_feedback"){   
      this.discussCard = "feedback"; 
    }
    else {  
      this.discussCard = this.taggedCard; 
    }        
  }
   
  splittingName(userInfo): string{
    if(userInfo && (userInfo.name)){
      //let userName = userInfo.name.split(" ");   
      //return userName[0].charAt(0).toUpperCase() + userName[0].slice(1);
      return userInfo.name;
    }
    // else if(userInfo.avatar_toggle == true && userInfo.avatar_name){
    //   let userName = userInfo.avatar_name.split(" ");   
    //   return userName[0].charAt(0).toUpperCase() + userName[0].slice(1);
    // }
    else return 'User'    
  }
  tapToSeeMore(index, value) {
    this.stories[index][0].feed['isSeeMore'] = true;
    //this.stories[0][index].feed.description = value;
  }
  tapToSeeLess(index, value) {
    this.stories[index][0].feed['isSeeMore'] = false;
    //this.stories[0][index].feed.description = value;
  }
 
  myTitle(value) {
    this.post_que = value.replace(/^\s+/g, '');             
    if(this.post_que.length > 0){
      this.topUpStatus = false;
      this.isCreationMode = true;                       
    }
    else {
      this.isCreationMode = false;
    }   
    this.post_question = value.trim(" ");             
  } 
  watchingGiveFeedback(value){
    this.isCreationMode = true;     
    this.give_feedback_description = value.trim(" ");
    if(this.give_feedback_description.length > 0){      
      let n = this.give_feedback_description.search("http");
      let a = this.give_feedback_description.length;
      let res = this.give_feedback_description.substr(n, a);
      let res1 = res.split(" ");
      let re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
       this.isValid  =re.test(res1[0]);           
      let apiKey = "5af190119b03547407c653a0";
      if(this.isValid && apiKey) {
          let urlEncoded = encodeURIComponent(res1[0]);
          let requestUrl = "https://opengraph.io/api/1.0/site/" + urlEncoded + '?app_id=' + apiKey;
        setTimeout(() => {
            let body = {
              "url": res1[0]           
            }            
            this.http.post(MyApp.API_ENDPOINT+'/util/url/preview',body,this.httpOptions).map(res => res.json())
            .subscribe(data => {
                this.preview_review = data.data;                       
            });            
        },1000);            
      }
  }
  this.give_feedback_description = value;
  } 
  publishCard(){
    let title_temp, des_temp;
    this.firebase.logEvent("card_create", {content_type: "card", user_id: this.sg['myProfileData'].id, card_type: this.cardType});
    this.post_que = this.post_que.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').trim(" "); 
    this.postCardDescription = this.postCardDescription.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').trim(" ");
    title_temp = btoa(unescape(encodeURIComponent(this.post_que)));
    des_temp = btoa(unescape(encodeURIComponent(this.postCardDescription)));
    let body = {
      "title" : title_temp,
      "target_method" : this.targetMethod,
      "hashtags" : this.selectedHashTags,
      "attachments":this.attachedImages,
      "description" : des_temp
    };   
    if(this.selectedHashTags.length > 0 && !this.targetMethod) {
      body['target_method'] = "everyone";
    }         
    if(this.targetMethod == 'category'){          
      body["target_values"] = this.interestId
    }
    else if(this.targetMethod == 'everyone') {
      body["target_values"] = "";
    }
    else if(this.targetMethod == 'age_range') {
      if(this.specific_age == 'myAge'){
        let age;
        if(this.sg['myProfileData'].age_range){
          age = this.sg['myProfileData'].age_range.split("-");
        }            
        let minage = parseFloat(age[0].replace(/,/g, ''));
        let maxage = parseFloat(age[1].replace(/,/g, ''));
        body["target_values"] = {"min":minage,"max":maxage};
      }
      else {
        let minage = this.min_age;
        let maxage = this.max_age;
        body["target_values"] = {"min":minage,"max":maxage};
      }          
    }
    else if(this.targetMethod == 'gender') {
      body["target_values"] = this.targetValue;
    }
    else if(this.targetMethod == 'location') {
      if(this.locationStatus == 'specific'){
        body["target_values"] = this.specific_address;
      }
      else {
        body["target_values"] = this.current_address;
      }
    }     
    if(this.cardType == "recommend") {                    
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Posting...'        
      });
      loader.present().then(() => {                
        body['options'] = [];
        body['type'] = 'recommend';
        this.http.post(MyApp.API_ENDPOINT+'/story/poll/create',body, this.httpOptions).map(res => res.json()).subscribe(data => {       
          loader.dismiss();         
          this.askEveryone = false;         
          this.selectedChoice = false;
          this.afterPublishing();          
        },
        err => {
          loader.dismiss();
          console.log("Error :" + JSON.stringify(err));         
          let toast = this.toastCtrl.create({
            message: "Sorry, something went wrong!",
            duration: 3000,
            position : "middle"
          });
          toast.present();          
        });
      });
    }
    else if(this.cardType === "poll") {
      let pollBody = {};
      this.options.push("Can't Decide");
      let newArr = [],
      origLen = this.options.length,
      found, x, y;
      for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < newArr.length; y++) {
          if (this.options[x] === newArr[y]) {
            found = true;
            break;
          }
        }
        if (!found) {
        this.options[x] = btoa(unescape(encodeURIComponent(this.options[x])));            
        newArr.push(this.options[x]);
        }
      }
      this.options = newArr;      
      for (var i = 0; i < this.options.length; i++) {    
        if (this.options[i].trim().length == 0) { 
          this.options.splice(i, 1);
        }
      }     
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Posting...'        
      });
      loader.present().then(() => {
        body['options'] = this.options;
        body['type'] = 'poll';
        this.http.post(MyApp.API_ENDPOINT+'/story/poll/create',body, this.httpOptions).map(res => res.json()).subscribe(data => {       
          loader.dismiss();         
          this.askEveryone = false;         
          this.selectedChoice = false;
          this.afterPublishing();
        },
        err => {
          loader.dismiss();
          console.log("Error :" + JSON.stringify(err));                
          let toast = this.toastCtrl.create({
            message: "Sorry, something went wrong!",
            duration: 3000,
            position : "middle"
          });
          toast.present();          
        }); 
      }); 
    }
    else if(this.cardType === "discussion") {
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Posting...'        
      });
      loader.present().then(() => {                   
        this.http.post(MyApp.API_ENDPOINT+'/story/post/create',body, this.httpOptions).map(res => res.json()).subscribe(data => {          
          loader.dismiss();
          this.askEveryone = false;         
          this.selectedChoice = false;
          this.afterPublishing();
        },
        err => {
          loader.dismiss();           
          let toast = this.toastCtrl.create({
            message: "Sorry, something went wrong!",
            duration: 3000,
            position : "middle"
          });
          toast.present();       
        });
      });
    }
    else if(this.cardType === 'review'){      
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Posting...'        
      });
      loader.present().then(() => {
        body['type'] = this.reviewType;
        if(this.reviewType == "give_feedback"){
          if(this.give_attach) {
            this.attachedImages.push(this.give_attach);
            body['attachments'] = this.attachedImages;
          }          
          if(this.give_feedback_des && !this.rangeValue){
            this.give_feedback_des = this.give_feedback_des.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
            body["percentage"] =  0,          
            body["review_description"] = this.give_feedback_des
          }
          else if(!this.give_feedback_des && this.rangeValue){
            body["percentage"] = this.rangeValue,          
            body["review_description"] = ""
          }
          else {
            this.give_feedback_des = this.give_feedback_des.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
            body["percentage"] = this.rangeValue,          
            body["review_description"] = this.give_feedback_des
          }
        }
        // else {
        //   this.postCardDescription = this.postCardDescription.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
        //   body["description"] = this.postCardDescription;
        // }          
        this.http.post(MyApp.API_ENDPOINT+'/story/review/create',body, this.httpOptions).map(res => res.json()).subscribe(data => {                
          loader.dismiss();
          this.askEveryone = false;         
          this.selectedChoice = false;
          this.afterPublishing();
        },
        err => {
          loader.dismiss();
          // let alert = this.alertCtrl.create({
          //   title: "Failure",
          //   message: "Sorry, something went wrong!",
          //   buttons: ["OK"]
          // });
          // alert.present();    
          let toast = this.toastCtrl.create({
            message: "Sorry, something went wrong!",
            duration: 3000,
            position : "middle"
          });
          toast.present();             
        });  
      });
    }
    //this.createdMode = false;
  }
  ratingCount(msg, value){
    if(value == 'give_feedback') {
      if(this.descriptionMaxLength>=msg.length){
        this.ratingCharacterleft=(this.descriptionMaxLength)-(msg.length);
      }
    }
  } 
  afterPublishing() {    
    this.closingCard('selectionChoice');
    this.sg['pusher'].disconnect();    
    this.registration =  true;   
    let headers = new Headers( ); 
      headers.append( 'Content-Type','application/json');
      headers.append( 'Accept', 'application/json');
      headers.append( 'token', this.tkn_sb);     
    let options = new RequestOptions({
      headers: headers                 
    });
    let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Refreshing feed'      
    });
    loader.present().then(() => {                
      this.http.get(MyApp.API_ENDPOINT+'/me/feed?page=1&page_size=10',options).map(res => res.json()).subscribe(data => {
        let story_id = data.data.stories[0].feed.id ;
        loader.dismiss();      
          this.systemCard = data.data.system_card ;
          this.content.scrollToTop();
          this.stories= [] ;          
          this.fadeOutLeft = [];          
          let feed = data.data.stories;
          this.searchResults = feed.length;
          let stories_length = this.stories.length;             
          Pusher.logToConsole = false;
          this.sg['pusher'] = new Pusher('c02d2b34f9ba5121fbbb',{
            cluster:'mt1',
            encrypted: true
          });
          let channels = [], tempHttp = this.http, stories = this.stories, barchartData = this.barChartData, 
          barchartColors = this.barChartColors, toastCtrl = this.toastCtrl, myProfileData = this.sg['myProfileData'];
          for(var i=0; i < feed.length; i++) {                              
            this.fadeOutLeft.push(false);
            this.stories.push([feed[i]]);              
            this.discoverPageNumber.push(1);
            channels.push(this.sg['pusher'].subscribe(feed[i].feed.websocket_channel)); 
            let http_Options = this.httpOptions; // user_count = this.user_count ;
            if(typeof channels[i] != 'undefined') {
              channels[i].bind("story_update", function(data1) {
                let story_id = data1.data.story_id ;                
                tempHttp.get(MyApp.API_ENDPOINT+'/feed/story/'+story_id,http_Options).map(res => res.json()).subscribe(data2 => {
                  let story = data2.data, userFirstName;                  
                  for(var j=0; j < stories.length; j++){
                    for(var k=0; k < stories[j].length; k++){
                      if(typeof stories[j][k].feed != 'undefined' && stories[j][k].feed.id == data2.data.feed.id){
                        let temp_j = j;                
                        stories[j][k].feed.follows = story.feed.follows;
                        stories[j][k].feed.likes = story.feed.likes;
                        stories[j][k].feed.dislikes = story.feed.dislikes;
                        stories[j][k].feed.shares = story.feed.shares;
                        stories[j][k].feed.comments = story.feed.comments;
                        stories[j][k].feed.crowd_count = story.feed.crowd_count;
                        //user_count = story.feed.crowd_count;
                        stories[j][k].user = story.user;
                        stories[j][k] = story;
                        if(story.feed.type == "Story.Discover"){                  
                          stories[j][k].feed.opinions_count = story.feed.opinions_count;
                        }
                        else if(story.feed.type == "Story.Poll"){
                          //stories[j][k] = data2.data;
                          stories[j][k].feed.options = story.feed.options;                  
                        } 
                        else if(story.feed.type == "Story.Review"){
                          stories[j][k].feed.responses = story.feed.responses;
                          stories[j][k].feed.average = story.feed.average;
                          stories[j][k].feed.votes = story.feed.votes;
                        }
                        setTimeout(() => {
                          if(story.feed.type == 'Story.Review'){
                            this.barChartOptions = this.barChartOptions;
                            this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
                            this.barChartType = 'bar';
                            barchartData[temp_j] = new Array(1);
                            barchartData[temp_j] = [{data:story.feed.graph_data}];   
                            barchartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];    
                          }
                        },2000);
                      }
                      else if(stories[j][k].id == story.feed.id){
                        if(story.feed.type == "Story.Discover"){
                          stories[j][k].follows = story.feed.follows;
                          stories[j][k].likes = story.feed.likes;
                          stories[j][k].dislikes = story.feed.dislikes
                          stories[j][k].shares = story.feed.shares;
                          //stories[j][k].crowd_count = story.feed.crowd_count;
                          stories[j][k].comments = story.feed.comments;
                          stories[j][k].opinions_count = story.feed.opinions_count;
                        }
                      }
                    }
                  }
                  //console.log(stories);            
                }); 
              });
            }
            if(feed[i].feed.type == 'Story.Review'){
              this.barChartOptions = this.barChartOptions;
            this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            this.barChartType = 'bar';
            this.barChartData[(stories_length+i)] = new Array(1);
            this.barChartData[(stories_length+i)][0] = {data:feed[i].feed.graph_data};
            this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];
          } 
        }
        // let toast = this.toastCtrl.create({
        //   message: "Yay!..your post is live!",
        //   duration: 3000,
        //   position : "middle"
        // });
        // toast.present();              

        
      },
      err => {
        loader.dismiss();
      });
    });
  } 
  initializeInputs() {
    this.getMyProfile();
    this.inputs=[
      {placeholder:'Option 1'},
      {placeholder:'Option 2'}            
    ];
  }
  inputWatch(options,idx) {    
    let newOptions = [];
    if((idx+2) > this.inputs.length) {
      this.inputs.push({placeholder:'Option '+(idx+2)});   }
    if((this.inputs.length-3) == (idx) && options[idx] == ""){
      this.inputs.pop();
    }  
    for (var i = 0; i < this.options.length; i++) {
      if(typeof this.options[i] != 'undefined' && (this.options[i].trim(" ") != "") &&  (this.options[i].toLowerCase() != "can't decide") && (this.options[i].toLowerCase() != "cant decide")){

          newOptions.push(this.options[i]);
      }
    }
    this.optionsLength = newOptions.length;
    this.options = newOptions;      
  }
  
  reviewTypeSelect() {
    if(this.feedbackStatus == true){
      this.myColor = 'secondary';
      this.feedbackStatus = false;
      this.reviewType = "get_feedback";
    }
    else {
      this.feedbackStatus = true;
      this.reviewType = "give_feedback";
    }
  }
  getTitle(title){
    if(title == "discussion"){
      return "ADD / SAY SOMETHING MORE"
     }
     if(title == "poll"){
       return "ADD AN IMAGE OR A DESRCIPTION (OPTIONAL)"
     }
     if(title == "recommend"){
       return "ADD / SAY SOMETHING MORE"
     }
     
  }
  
  postSomethignMore(val) {
    this.isCreationMode = true;
    if(this.postCardDescription.length > 0){      
      let n = this.postCardDescription.search("http");
      let a = this.postCardDescription.length;
      let res = this.postCardDescription.substr(n, a);
      let res1 = res.split(" ");
      let re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
      this.isValid  = re.test(res1[0]);           
      //let apiKey = "5af190119b03547407c653a0";      
      if(this.isValid && (this.validUrl != res1[0])) {
          // let urlEncoded = encodeURIComponent(res1[0]);
          // let requestUrl = "https://opengraph.io/api/1.0/site/" + urlEncoded + '?app_id=' + apiKey;
        this.validUrl =  res1[0];        
        let body = {
          "url": res1[0]           
        }            
        this.http.post(MyApp.API_ENDPOINT+'/util/url/preview',body,this.httpOptions).map(res => res.json())
        .subscribe(data => {
            this.preview = data.data;                       
        });     
      }  
     
  }
  this.postCardDescription = val;
}
  
  keyboardOpens(value) {
    //alert('The keyboard is open:'+ this.keyboard.isOpen());
    if(this.keyboard.isOpen()) {
      this.topUpStatus = false;
    }
    else {
      this.topUpStatus = true;
    }
    if(value && value == 'cardtitle') {
      this.topUpStatus = false;
      this.cardStatus_2 = true;
      this.cardStatus_1 = false;
    }
    else{
      if (this.platform.is('ios')) {
        this.topUpStatus = false;
      }  
    }   
  }
  slidingMethod(rangeValue, id){
  // console.log(rangeValue);
  
    if (rangeValue > 0 && rangeValue < 7) {
      this.color="danger" ;
    } 
    if (rangeValue > 6 && rangeValue < 9) {
      this.color="yellow" ;
    } 
    if (rangeValue > 8 && rangeValue < 11) {
      this.color="green" ;
    }
  }  
  getTotalOpinions(opinions){
    return opinions.review + opinions.blog + opinions.forum + opinions.video;
  }  
  // voiceInfograph(title,count,id,negativeWords,positiveWords, opinions, graph_data, type) {
  //   this.sg['voicedata'] = [];
  //   if(type == "Story.Discover"){
  //     this.navCtrl.push(VoiceReviewsPage,{title,count,id,negativeWords,positiveWords, opinions, graph_data});
  //   }    
  // }
  getClass(optionId,responses) {
    //alert(id);
    for(var i=0;i<responses.length;i++){
      if(optionId == responses[i]){
          return true;
      }
    }
    return false;
  } 
  getPollPercentage(value, options) {
    let totalCount = 0, percentage;
    for(var i=0;i<this.options.length;i++) {
      totalCount = totalCount + this.options[i].response_count;
    }    
    percentage = (value*100)/(totalCount);
    return  percentage;   
  } 
  private gallery_run(fileInput:HTMLElement): void {
    fileInput.click();
  }
  close(value, index){    
    if(value == "titleImg"){
      //this.imagePreview = null;
      this.attachedImages.splice(index,1);
    }    
    else if(value == "giveFeedback"){
      this.imagePreview1 = null;
      this.give_attach = null;
    }      
  }

  b64toBlob(dataURI) {
   // alert("am in blob and dataURI is : "+dataURI);
    var byteString = atob(dataURI.split(',')[1]); 
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; 
    var ab = new ArrayBuffer(byteString.length); 
    var dw = new DataView(ab); 
    for(var i = 0; i < byteString.length; i++) { 
    dw.setUint8(i, byteString.charCodeAt(i)); 
    } 
    return new Blob([ab], {type: mimeString});   
  } 

  /* ------------ camera image attachment ------------ */

  /*fileUpload(value) {
    let imageData = "";
    //alert("old imagedata  "+imageData);
    const options1: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options1).then((imageData) => {      
      //alert("new image data " + imageData);
      imageData = 'data:image/jpeg;base64,'+imageData;
      //alert("with mime type " + imageData);
      let blob1 = this.b64toBlob(imageData);
      //alert(blob1);
      $.ajax ({ 
        url: MyApp.API_ENDPOINT+'/util/upload_url/create', 
        type: "POST", 
        data: JSON.stringify({content_type: blob1.type}), 
        contentType:"application/json; charset=utf-8", 
        dataType: "json", 
        success: function(res){        
              alert('Upload url '+res.data.upload_url);  
              $.ajax({ 
                url: res.data.upload_url, 
                type: "put", 
                data: blob1, 
                headers: {"Content-Type": blob1.type}, 
                processData: false, 
                success: function (res1) { 
                  console.log("done", res1); 
                  //alert(res.data.download_url);
                } 
              }); 
        } 
      });
    });    
  }*/

  /* -------------- single image attachment --------------- */

  fileUpload(event, value) {
    let fileObj;
    if(event.target.files && event.target.files[0]) {
      console.log(event.target.files[0]);
      var reader = new FileReader();
      reader.onload = (event:any) => {        
        if(value == "post"){
          this.imagePreview = event.target.result;       
        }       
        else if(value == "giveFeedback"){
          this.imagePreview1 = event.target.result;        
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
      this.http.put(url,fileObj,options).map(res => res.json()).subscribe(data => {          
      },err => {});      
      if(value == "post"){
        this.attachedImages =  [this.attachPic]    
      }     
      else if(value == "giveFeedback"){
        this.give_attach = this.attachPic ;          
      }  
    });
  }

   /* --------------multiple image attachment --------------- */

   multipleImageAttachment() {    
     let imageData = "", images =[];   
     const options3 = {
       quality:20,
       outputType:1,
       maximumImagesCount:10
     };
     this.imagePicker.getPictures(options3).then(results =>{
       if(results && results.length>0 && results != 'OK') {         
         for(var i=0;i<results.length;i++) {          
           images.push({data: results[i], mimetype: "image/jpeg"})
         }         
         let body = {
           "image_data" : images
         }         
         this.showLoader = true;        
         this.http.post(MyApp.API_ENDPOINT+'/util/upload/images',body).map(res => res.json()).subscribe(data => {           
           for(var i=0;i<data.data.uploaded_urls.length;i++) {
             this.attachedImages.push(data.data.uploaded_urls[i]);
           }
           this.showLoader = false;          
         },err => {           
           this.showLoader = false;
         });
       }    
     });
   }

  zonesTimeline(id) {
    this.navCtrl.push(ZoneTimelinePage, {"id":id});
  }
  profileUser(id){
    this.navCtrl.push(ProfileUserPage, {id});
  }
  goToLink(url){
    if(url == null){
      const browser = this.iab.create('https://foreva.app/','_system',{location:'no'});
    }
    else {
      const browser = this.iab.create(url,'_system',{location:'no'});
    }
  }
  goToUrlPreview(url){
    if(url == null){
      const browser = this.iab.create('https://foreva.app/','_system',{location:'no'});
    }
    else {
      const browser = this.iab.create(url,'_system',{location:'no'});
    }
  }
  delete(item,idx,id, discoveries) {    
    let alert = this.alertCtrl.create({            
      message: "This card will be removed",
        buttons: [{
        text: 'Cancel',
        role : 'cancel'                     
      },{
        text: 'REMOVE',
        handler: () => {

        this.fadeOutLeft[idx] = true;
        setTimeout(() => {
          this.sg['cardHidden'][idx] = true;
        },2000);                                    
        this.http.post(MyApp.API_ENDPOINT+'/feed/'+id+'/delete',{},this.httpOptions).map(res => res.json()).subscribe(data => {
          this.sg['cardHidden'][idx] = true;
        });                  
        }
      }]
    });
    alert.present();     
  }  
    
  more(event){        
    this.sg['popover'] = this.popoverCtrl.create(PopupMorePage);
        this.sg['popover'].present({
          ev: event
    });
  }

  doRefresh(refresher) {
    this.sg['pusher'].disconnect();
    this.sg['notificationPusher'].disconnect();       
    setTimeout(() => {        
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
      this.sg['refresher'] = true ;
    }, 2000);        
  }

  /* ---- Review response create --- */

  done(feed, idx, des_temp) {
    let data ;
      if(this.percentage[feed.id] == (undefined || null) && (this.checked[feed.id] != true)) {       
        let toast = this.toastCtrl.create({
          message: "Rate to see results",
          duration: 3000,
          position : "middle"
        });
        toast.present(); 
      }
      else if((this.percentage[feed.id] > 0 || this.percentage[feed.id] == 0) && !this.textInput[feed.id]){
        data = {
           // "attachment": "http://url.com",
            "description": "",
            "percentage": this.percentage[feed.id],
            "not_sure": this.checked[feed.id],
            "review_id": feed.id 
        }
      }
      else if((this.textInput[feed.id]) && (this.percentage[feed.id] == undefined || 0) && (this.checked[feed.id] != true)){ 
        data = {
          // "attachment": "http://url.com",
          "description": des_temp,
          "percentage": "0",
          "not_sure": this.checked[feed.id],
          "review_id": feed.id
        }                
      }
      else if(this.checked[feed.id] == true){       
        data = {
          // "attachment": "http://url.com",
          "description": des_temp,
          "not_sure": this.checked[feed.id],
          "review_id": feed.id 
        }
      }
      else {
        data = {
          // "attachment": "http://url.com",
          "description": des_temp,
          "not_sure": this.checked[feed.id],
          "percentage": this.percentage[feed.id],
          "review_id": feed.id 
        } 
      }    
      this.firebase.logEvent("review_response", {content_type: "card", user_id: this.sg['myProfileData'].id, item_id: feed.id, item_name:feed.title});
      if(data) {
        let loader = this.loadingCtrl.create({
          content: 'Saving your rating',
        });
        loader.present().then(() => {
          this.textInput[feed.id] = "" ; 
          this.myHeight = "40px";
            setTimeout(() => { 
              this.myHeight = " ";
            },2000);
        this.http.post(MyApp.API_ENDPOINT+'/story/review/response/create', data, this.httpOptions).map(res => res.json()).subscribe(data => {
          loader.dismiss();
          this.textInput[feed.id] = "";          
          this.stories[idx][0] = data.data;
        //   let alert = this.alertCtrl.create({
        //     title: "Success",
        //     message: "Review response successfully saved",
        //     buttons: ["OK"]
        //   });
        // alert.present();
        let toast = this.toastCtrl.create({
          message: "Review response successfully saved",
          duration: 3000,
          position : "middle"
        });
        toast.present(); 
        this.barChartOptions = this.barChartOptions;
        this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        this.barChartType = 'bar';
        this.barChartData[idx] = [{data:data.data.feed.graph_data}];
        this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];
        },
        err => {
          loader.dismiss();
          console.log("Error :" + JSON.stringify(err));
          // let alert = this.alertCtrl.create({
          //   title: "Failure",
          //   message: "Sorry, something went wrong!",
          //   buttons: ["OK"]
          // });
          // alert.present();      
          let toast = this.toastCtrl.create({
            message: "Sorry, something went wrong!",
            duration: 3000,
            position : "middle"
          });
          toast.present();       
        }); 
      });      
    }      
  }
  myProfileId() {    
    if(this.sg['myProfileData'] && this.sg['myProfileData'].id) {
      let loginUser_Id = this.sg['myProfileData'].id;
      let temp1 = loginUser_Id.search("_");
      if(temp1 > 0) {
        loginUser_Id = loginUser_Id.split("_")[0];
        return loginUser_Id;
      }
      else {
        return loginUser_Id;
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

  updateCheckbox(id, feed, idx) {
    if(this.checked[id] == true && this.textInputReview[id]){
      this.isCancelled[id] = false;
      this.rangeDisabled[id] = true;
      this.percentage[id] = null; 
      if(this.textInputReview[id]){
        this.description[id] = this.textInputReview[id].trim();
        if(this.description[id].length > 0){
          this.doneBtn[id] = true;
        }
        else {
          this.doneBtn[id] = false;
        }
      }
    }
    else if(this.checked[id] == true && !this.textInputReview[id]) {
      this.isCancelled[id] = false;
      this.rangeDisabled[id] = true;
      this.percentage[id] = null; 
      this.doneBtn[id] = true;
    }
    else {    
      this.rangeDisabled[id] = false;
      if(this.textInputReview[id] || this.percentage[id] > 0) {
        this.description[id] = this.textInputReview[id].trim();
        if(this.description[id].length > 0 || this.percentage[id] > 0){
          this.doneBtn[id] = true;
        } 
        else {
          this.doneBtn[id] = false;
        }
      }
      else{
        this.doneBtn[id] = false;
      }
    }
    if(!this.isCancelled[id]) {
      let alert = this.alertCtrl.create({             
        message: "You rated: not sure",
        cssClass : "custom-alert",
        buttons: [{
          text: 'CANCEL',
          handler: () => {            
            this.cancelRating(id);
          }
        },{
          text: 'CONFIRM',
          handler: () => {
            this.confirmRating(id, feed, idx);
          }
        }]
      });
      alert.present()
    }
  } 

  cancelRating(id) {
    this.rangeDisabled[id] = false;
    this.description[id] = "";
    this.percentage[id] = null;
    this.checked[id] = false;
    this.isCancelled[id] = true; 
    this.textInput[id] = "";    
  }

  confirmRating(id, feed, idx) {
    let des_temp = "";
    if(this.textInput[feed.id]) {
      this.textInput[feed.id] = this.textInput[feed.id].replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
      des_temp = btoa(unescape(encodeURIComponent(this.textInput[feed.id])));
    }    
    this.done(feed, idx, des_temp);     
  }

   change(idx) {
 
    // get elements :

    let element   = document.getElementById('messageInputBox'+idx);
    let textarea  = element.getElementsByTagName('textarea')[0];

    // set default style for textarea :

    textarea.style.minHeight  = '0';
    textarea.style.height     = '0';

    // limit size to 96 pixels (6 lines of text) :

     let scroll_height = textarea.scrollHeight;
    
     if(scroll_height > 116) {
      scroll_height = 110;
      this.activatePadding = false;
    }

    else if(scroll_height < 116){
     this.activatePadding = true;
    }  

    // apply new style :

    element.style.height      = scroll_height  + 20 + "px";
    textarea.style.minHeight  = scroll_height  + 20 +"px";
    textarea.style.height     = scroll_height + 20 + "px";
    var width = (element.clientWidth + 1) + "px";
    //console.log("width :"+width);
   }

   postCommentBox(idx) {
    // get elements
    var element   = document.getElementById('postCommentBox'+idx);
    var textarea  = element.getElementsByTagName('textarea')[0];

    // set default style for textarea
    textarea.style.minHeight  = '0';
    textarea.style.height     = '0';

    // limit size to 96 pixels (6 lines of text)
    var scroll_height = textarea.scrollHeight;

    if(scroll_height > 116) {
      scroll_height = 110;
      this.activatePadding = false;
    }

    else if(scroll_height < 116){
     this.activatePadding = true;
    }

    // apply new style
    element.style.height      = scroll_height + 16 + "px";
    textarea.style.minHeight  = scroll_height + 16 + "px";
    textarea.style.height     = scroll_height + 16 + "px";
   }

  myMethod(percentage, id, feed, idx){ 
    this.isAnimation[id] = true;    
    if (percentage[id] > 0 && percentage[id] < 7) {
      this.color="danger" ;
      this.isCancelled[id] = false;     
    } 
    else if (percentage[id] > 6 && percentage[id] < 9) {
      this.color="yellow" ;
      this.isCancelled[id] = false;      
    } 
    else if (percentage[id] > 8 && percentage[id] < 11) {
      this.color="green" ;
      this.isCancelled[id] = false;      
    }    
    if(!this.isCancelled[id]) {
      let alert = this.alertCtrl.create({             
        message: "You rated: "+percentage[id]+" "+"out of 10",
        cssClass : "custom-alert",
        buttons: [{
          text: 'CANCEL',
          handler: () => {            
            this.cancelRating(id);
          }
        },{
          text: 'CONFIRM',
          handler: () => {
            this.confirmRating(id, feed, idx);
          }
        }]
      });
      alert.present()
    }    
  }                                  

  doInfinite(infiniteScroll) {
    //this.infiniteObj = infiniteScroll;
    setTimeout(() => {     
        if(this.sg['filterBy'] == "NOTIFICATION ALERT" || this.showSimilar == true || this.filterbyHash == true){
          //infiniteScroll.enable(false);          
          infiniteScroll.complete();
        }        
        else {
          //infiniteScroll.enable(true);
          this.pageNumber = this.pageNumber+1;
          let feed :any ;
          let headers = new Headers( );      
            headers.append( 'Content-Type','application/json');
            headers.append( 'Accept', 'application/json');
            headers.append( 'token', this.tkn_sb);    
          let options = new RequestOptions({
            headers: headers                
          });
          this.http.get(MyApp.API_ENDPOINT+'/me/feed?page='+this.pageNumber+'&page_size=10',this.httpOptions).map(res => res.json()).subscribe(data => {
            feed = data.data.stories;            
            let stories_length = this.stories.length;
            Pusher.logToConsole = false;    
            this.sg['pusher'] = new Pusher('c02d2b34f9ba5121fbbb',{
              cluster:'mt1',
              encrypted: true
            });
            let channels = [], tempHttp = this.http, stories = this.stories, barchartData = this.barChartData, barchartColors = this.barChartColors, 
            toastCtrl = this.toastCtrl, myProfileData = this.sg['myProfileData'];
            for(var i=0; i < feed.length; i++) { 
              this.fadeOutLeft.push(false);              
              this.stories.push([feed[i]]);                
              this.discoverPageNumber.push(1);
              channels.push(this.sg['pusher'].subscribe(feed[i].feed.websocket_channel));
              let http_Options = this.httpOptions; // user_count = this.user_count;               
              if(typeof channels[i] != 'undefined') {
                channels[i].bind("story_update", function(data1) {                
                let story_id = data1.data.story_id ;               
                tempHttp.get(MyApp.API_ENDPOINT+'/feed/story/'+story_id,http_Options).map(res => res.json()).subscribe(data2 => {           
                  let story = data2.data, userFirstName;                  
                  for(var j=0; j < stories.length; j++){
                    for(var k=0; k < stories[j].length; k++){
                      if(typeof stories[j][k].feed != 'undefined' && stories[j][k].feed.id == data2.data.feed.id){
                        let temp_j = j ;
                        stories[j][k].feed.follows = story.feed.follows;
                        stories[j][k].feed.likes = story.feed.likes;
                        stories[j][k].feed.dislikes = story.feed.dislikes;
                        stories[j][k].feed.shares = story.feed.shares;
                        stories[j][k].feed.comments = story.feed.comments;
                        stories[j][k].feed.crowd_count = story.feed.crowd_count;
                        //user_count = story.feed.crowd_count;
                        stories[j][k].user = story.user;
                        stories[j][k] = story;
                        if(story.feed.type == "Story.Discover"){                  
                          stories[j][k].feed.opinions_count = story.feed.opinions_count;
                        }               
                        else if(story.feed.type == "Story.Poll"){                  
                          stories[j][k].feed.options = story.feed.options;                  
                        } 
                        else if(story.feed.type == "Story.Review"){
                          stories[j][k].feed.responses = story.feed.responses;
                          stories[j][k].feed.average = story.feed.average;
                          stories[j][k].feed.votes = story.feed.votes;
                        }
                        setTimeout(() => {
                          if(story.feed.type == 'Story.Review'){
                            this.barChartOptions = this.barChartOptions;
                            this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
                            this.barChartType = 'bar';
                            barchartData[temp_j] = new Array(1);
                            barchartData[temp_j] = [{data:story.feed.graph_data}];   
                            barchartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];    
                          }
                        },2000);
                      }
                      else if(stories[j][k].id == story.feed.id){
                        if(story.feed.type == "Story.Discover"){
                          stories[j][k].follows = story.feed.follows;
                          stories[j][k].likes = story.feed.likes;
                          stories[j][k].dislikes = story.feed.dislikes;
                          stories[j][k].shares = story.feed.shares;
                          stories[j][k].comments = story.feed.comments;
                          stories[j][k].opinions_count = story.feed.opinions_count;
                        }
                      }
                    }             
                  }
                });
              }); 
            }
            if(feed[i].feed.type == 'Story.Review'){          
              this.barChartOptions = this.barChartOptions;
              this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
              this.barChartType = 'bar';
              this.barChartData[(stories_length+i)] = new Array(1);
              this.barChartData[(stories_length+i)][0] = {data:feed[i].feed.graph_data};   
              this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];
            }
          } 
          infiniteScroll.complete();    
        },
        err => { 
          infiniteScroll.complete(); 
        });
      }      
    }, 500);   
  }

  addRecommendation(idx,recoption,feed) {
    /* ----- Add Recommendation ----- */
    let  option = this.textInput[feed.id] ;
    let temp1 = this.sg['myProfileData'].id.search("_");        
    if(temp1 > 0) {
      this.sg['myProfileData'].id = this.sg['myProfileData'].id.split("_")[0];
    }
    let temp2 = feed.user.id.search("_");        
    if(temp2 > 0) {
      feed.user.id = feed.user.id.split("_")[0];
    }     
    if(feed.user.id == this.sg['myProfileData'].id){
      let alert = this.alertCtrl.create({        
        message: "sorry, you cannot recommend on your own card.",
          buttons: [{
            text: 'OK',
            handler: () => {
              this.textInput[feed.id] = '';
            }
          }]
      });
      alert.present();
      }
      else {
        let flag = false;
        for(var i = 0; i < feed.options.length; i++){
          if(feed.options[i].name.toLowerCase() == this.textInput[feed.id].toLowerCase()){
            flag = true;
            break;
          }
        }
        setTimeout(() => {
          if(flag) {
            let alert = this.alertCtrl.create({        
              message: "Sorry, the option you entered is already recommended.",
              buttons: [{
                text: 'OK',
                handler: () => {
                  this.textInput[feed.id] = ""; 
                }
              }]
            });
            alert.present();
          }
          else {
            //Changed by:  Amulya Dande
            //Changed Date: 13-June-18
            //Change Made:  Adding recommendation instantly without calling a service
            this.firebase.logEvent("recommendation_add", {content_type: "card", user_id: this.sg['myProfileData'].id, item_id: feed.id, item_name:feed.title});
            this.stories[idx][0].user.is_answered = true;
            this.stories[idx][0].feed.options.push({"name" : this.textInput[feed.id],"response_count" : 1});                      
            this.textInput[feed.id] = "";
            let headers = new Headers( );      
              headers.append( 'Content-Type','application/json');
              headers.append( 'Accept', 'application/json');
              headers.append( 'token', this.tkn_sb);        
            let body = {
              "recommendation" : recoption
            }
            let options = new RequestOptions({
              headers: headers                    
            });
            this.textInput[feed.id] = "" ; 
            this.myHeight = "40px";
              setTimeout(() => { 
                this.myHeight = " ";
              },2000);
            this.http.post(MyApp.API_ENDPOINT+'/story/poll/'+feed.id+'/add/recommendation',body, options).map(res => res.json()).subscribe(data => {
              recoption = "";
              this.stories[idx][0] = data.data;
            },
            err => {
              let error = JSON.parse(err._body);        
              let alert = this.alertCtrl.create({        
                message: error.error.message,
                buttons: [{
                  text: 'OK',
                  handler: () => {
                    this.textInput[feed.id] = "";
                  }
                }]
              });
              alert.present(); 
            });            
          }
        }, 500);
      }
    }

  /* ----- poll response create ----- */

  response(id,item,idx,index, count, story) {
    let temp1 = this.sg['myProfileData'].id.search("_");        
    if(temp1 > 0) {
      this.sg['myProfileData'].id = this.sg['myProfileData'].id.split("_")[0];
    }
    let temp2 = story.feed.user.id.search("_");        
    if(temp2 > 0) {
      story.feed.user.id = story.feed.user.id.split("_")[0];
    }  
    if(this.selected_item === item) {
      this.selected_item = '';
    }
    else { 
      this.selected_item = item;
      if((story.user.is_answered == true) && (story.feed.type == "Story.Poll")){
        if(story.feed.poll_type == "poll") {
          let alert = this.alertCtrl.create({        
            message: "Sorry, your vote is already in.",
              buttons: [{
                text: 'OK',
                handler: () => {
                  this.selected_item = '';
                }
              }]
          });
          alert.present();
        }
        else {
          let title;
          if(this.sg['myProfileData'].id == item.user.id) {
            title = "You wrote:";
            let alert = this.alertCtrl.create({
              title : title,        
              message: item.name,
              cssClass : "custom-alert",
              buttons: [{
                text: 'OK',
                handler: () => {
                  this.selected_item = '';
                }
              }]
            });
            alert.present();
          }
          else {
            let status;
            for(var i=0;i<story.user.user_responses.length;i++){
              if(id == story.user.user_responses[i]){
                status = true;
                break;
              }
              else {
                status = false;
              }
            }            
            title = item.user.name+" "+"wrote:";
            setTimeout(() => {
              if(!status) {
                let alert = this.alertCtrl.create({
                  title : title,        
                  message: item.name,
                  cssClass : "custom-alert",
                  buttons: [{
                    text: 'CANCEL',
                    handler: () => {
                      this.selected_item = '';
                    }
                  },
                  {
                    text: 'VOTE',
                    handler: () => {
                      this.tapToVote(idx, id, index, count, story);
                    }
                  }]              
                });
                alert.present();
              }
              else {
                let alert = this.alertCtrl.create({
                  title : title,        
                  message: item.name,
                  cssClass : "custom-alert",
                  buttons: [{
                    text: 'OK',
                    handler: () => {
                      this.selected_item = '';
                    }
                  }]              
                });
                alert.present();
              }
            }, 1000);                     
          }                   
        }  
      }
      else if(story.feed.user.id == this.sg['myProfileData'].id){
        if(story.feed.poll_type == "poll") {
          let alert = this.alertCtrl.create({        
            message: "Sorry, you cannot vote on your own poll.",
              buttons: [{
                text: 'OK',
                handler: () => {
                  this.selected_item = '';
                }
              }]
          });
          alert.present();
        }
        else {
          let alert = this.alertCtrl.create({
            title : item.user.name+" "+"wrote:",        
            message: item.name,
            cssClass : "custom-alert",
            buttons: [{
              text: 'OK',
              handler: () => {
                this.selected_item = '';
              }
            }]
          });
          alert.present();
        }
      }
      else {
        let title;
        if(story.feed.poll_type == "poll") {
          title = "You're voting for:";
        }
        else {
          title = item.user.name+" "+"wrote:"
        }
        let alert = this.alertCtrl.create({
          title : title,
          message: item.name,
          cssClass : "custom-alert",
          buttons: [{
            text: 'CANCEL',
            handler: () => {
              this.selected_item = '';
            }                     
          },{
              text: 'VOTE',
              handler: () => {      
                this.tapToVote(idx, id, index, count, story);
              }   
            }]     
          });
        alert.present();    
        }
      }  
    }
  
    tapToVote(idx, id, index, count, story) {
      this.firebase.logEvent("poll_response", {content_type: "card", user_id: this.sg['myProfileData'].id, item_id: story.feed.id, item_name:story.feed.title});
        this.stories[idx][0].user.is_answered = true;
        this.stories[idx][0].feed.options[index].response_count = count+1;
        this.stories[idx][0].user.user_responses.push(id);
        let body = {
          "poll_option_id" : id
        }                              
        this.http.post(MyApp.API_ENDPOINT+'/story/poll/response/create',body, this.httpOptions).map(res => res.json()).subscribe(data => {
          if(data.data.poll_response) {
            this.http.get(MyApp.API_ENDPOINT+'/feed/story/'+story.feed.id,this.httpOptions).map(res => res.json()).subscribe(data => {
              this.stories[idx][0] = data.data;                
            },
              err => { 
                this.selected_item = '';        
              });
          }              
        },
        err => {
          // this.selected_item = '';
          let error = JSON.parse(err._body);        
          let alert = this.alertCtrl.create({        
            message: error.error.message,
            buttons: [{
              text: 'OK',
              handler: () => {
                this.selected_item = '';
              }
            }]
          });
          alert.present();
        });
    }

  scrollToTop($event) {
    this.content.scrollToTop();   
    this.animation =  true;  
    this.topUpStatus = false;  
  } 

  closeFilterCard(){     
    this.sg['storyId']  =  '';
    this.sg['story_id'] = null; 
    this.sg['token']  =  '';
    this.sg['filteredStories'] = ''; 
    this.sg['filteredHashTag'] = '';
    this.filterCard = true;
    this.registration = true;
    this.closingCard('selectedChoice');    
    this.stories = [] ;
    this.showSimilar = false;
    this.filterbyHash = false;
    this.hashtagStories = null ;
    this.errMsg = null;
    //this.tab.select(0);
    this.sg['filterBy'] = null;
    //this.sg['filterbyhashtag'] = null;
    //this.sg['collection'] = null;    
    //this.sg['filterbyhashtagZones'] = null;
    this.navCtrl.push(TabsPage, { selectedTab: 0 });    
  }

  initialiseCards() {   
    this.menu.swipeEnable(false, 'menu1');    
    this.storage.get('userProfile').then((val) => {      
      this.sg['myProfileData'] = val;
      this.firebase.logEvent("feed_load", {content_type: "card", user_id:this.sg['myProfileData'].id, page_no:this.pageNumber});     
      if(val.name  && val.avatar_toggle == false){
        let name = (val.name).split(" ") ;
        this.name = name[0].charAt(0).toUpperCase() + name[0].slice(1);
      }
      else if(val.avatar_name  && val.avatar_toggle == true){
        let name1 = (val.avatar_name).split(" ") ;
        this.name = name1[0].charAt(0).toUpperCase() + name1[0].slice(1);
      }
      else {
        this.name = 'User';
      }                      
    });   
      if(this.sg['filterBy'] == "NOTIFICATION ALERT" || this.sg['filterBy'] == 'Collections'){      
        //this.navCtrl.setRoot(this.navCtrl.getActive().component);      
        this.getStory();        
      }
      else if(this.sg['refresher'] == true){
        this.topCard = true;
        //this.registration = true;
        this.pageNumber = 1;        
        let loader = this.loadingCtrl.create({
          spinner: 'dots',
          content: 'Updating feed',
          // spinner: 'hide',
          // content: this.safeSvg+'<p>fkjrnvkjgnrjb</p>',
        });
        loader.present().then(() => {
        setTimeout(() => {
          let tempHttp = this.http;
          this.http.get(MyApp.API_ENDPOINT+'/me/feed?page='+this.pageNumber+'&page_size=10&refresh=true',this.httpOptions).map(res => res.json()).subscribe(data => {
            this.systemCard = data.data.system_card ;
            this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(response => {
              this.storage.set('userProfile', response.data); 
              this.sg['myProfileData'] = response.data;         
              this.sg['refresher'] == false;              
              let tempprofile = this.sg['myProfileData'];
              if(this.sg['myProfileData'].avatar_toggle && response.data.avatar_name) {
                let avtrName = (response.data.avatar_name).split(" ") ;
                this.name = avtrName[0]; 
              }
              else if(response.data.name && !this.sg['myProfileData'].avatar_toggle){
                let name = (response.data.name).split(" ") ;
                this.name = name[0];
              }
              else {
                this.name = 'User';
              }             
              this.notification_count = response.data.new_notification_count ;
              let toastCtrl = this.toastCtrl;
              Pusher.logToConsole = false;
              this.sg['notificationPusher'] = new Pusher('c02d2b34f9ba5121fbbb',{
                cluster:'mt1',
                encrypted: true
              });
              var userChannel = this.sg['notificationPusher'].subscribe(tempprofile.user_websocket_channel); 
              var that =  this ;
              userChannel.bind("auto", function(dt) {
                console.log("pusher message received from server :"+JSON.stringify(dt));
                if(dt.meta.action == "TOAST") {
                  let toast = toastCtrl.create({
                    message: dt.data.message,
                    duration: 3000,
                    position : "top",
                    cssClass: "customToast"
                  });
                  toast.present();
                }                                
                tempHttp.get(MyApp.API_ENDPOINT+'/me/profile', that.httpOptions).map(res => res.json()).subscribe(result => {
                  that.storage.set('userProfile', result.data);
                  that.sg['myProfileData'] = result.data;                      
                  that.notification_count = result.data.new_notification_count ;
                });
              });             
            });
            let feed = data.data.stories;
            this.searchResults = feed.length;
            let stories_length = this.stories.length;
            loader.dismiss();
            let channels = [], tempHttp = this.http, stories = this.stories, barchartData = this.barChartData, barchartColors = this.barChartColors,
            toastCtrl = this.toastCtrl, myProfileData = this.sg['myProfileData'];
            Pusher.logToConsole = false;
            this.sg['pusher'] = new Pusher('c02d2b34f9ba5121fbbb',{
              cluster:'mt1',
              encrypted: true
            });
            for(var i=0; i < feed.length; i++) {                              
              this.fadeOutLeft.push(false);              
              this.stories.push([feed[i]]);
              this.discoverPageNumber.push(1);
              let http_Options =  this.httpOptions ;//user_count = this.user_count;
              this.sg['pusher'].unsubscribe(feed[i].feed.websocket_channel);
              channels.push(this.sg['pusher'].subscribe(feed[i].feed.websocket_channel));
              if(typeof channels[i] != 'undefined') {
                channels[i].bind("story_update", function(data1) {
                  console.log("pusher message received from server :"+JSON.stringify(data1));                                                  
                  let story_id = data1.data.story_id ;                  
                  tempHttp.get(MyApp.API_ENDPOINT+'/feed/story/'+story_id,http_Options).map(res => res.json()).subscribe(data2 => {
                    let story = data2.data, userFirstName;                    
                    for(var j=0; j < stories.length; j++){
                      for(var k=0; k < stories[j].length; k++){
                        if(typeof stories[j][k].feed != 'undefined' && stories[j][k].feed.id == data2.data.feed.id) {
                          let temp_j = j ;
                          stories[j][k].feed.follows = story.feed.follows;
                          stories[j][k].feed.likes = story.feed.likes;
                          stories[j][k].feed.dislikes = story.feed.dislikes;
                          stories[j][k].feed.shares = story.feed.shares;
                          stories[j][k].feed.comments = story.feed.comments;
                          stories[j][k].feed.crowd_count = story.feed.crowd_count;
                          //user_count = story.feed.crowd_count;
                          stories[j][k].user = story.user;
                          stories[j][k] = story;
                          if(story.feed.type == "Story.Discover"){                  
                            stories[j][k].feed.opinions_count = story.feed.opinions_count;
                          }                          
                          else if(story.feed.type == "Story.Poll"){                           
                            stories[j][k].feed.options = story.feed.options;                  
                          } 
                          else if(story.feed.type == "Story.Review"){
                            stories[j][k].feed.responses = story.feed.responses;
                            stories[j][k].feed.average = story.feed.average;
                            stories[j][k].feed.votes = story.feed.votes;
                          }
                          setTimeout(() => {
                            if(story.feed.type == 'Story.Review') {
                              this.barChartOptions = this.barChartOptions;
                              this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
                              this.barChartType = 'bar';
                              barchartData[temp_j] = new Array(1);
                              barchartData[temp_j] = [{data:story.feed.graph_data}];   
                              barchartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];    
                            }
                          },2000);
                        }
                        else if(stories[j][k].id == story.feed.id){
                          if(story.feed.type == "Story.Discover"){
                            stories[j][k].follows = story.feed.follows;
                            stories[j][k].likes = story.feed.likes;
                            stories[j][k].dislikes = story.feed.dislikes;
                            stories[j][k].shares = story.feed.shares;
                            stories[j][k].comments = story.feed.comments;
                            stories[j][k].opinions_count = story.feed.opinions_count;                  
                          }
                        }
                      }              
                    }
                  });
                });
              }              
              if(feed[i].feed.type == 'Story.Review'){              
                  this.barChartOptions = this.barChartOptions;
                  this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
                  this.barChartType = 'bar';
                  this.barChartData[(stories_length+i)] = new Array(1);
                  this.barChartData[(stories_length+i)][0] = {data:feed[i].feed.graph_data};
                  this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];
                }      
              }
              this.animation = true;
            },         
            err => {
              loader.dismiss();                    
            });
          }, 500);
        });
      }
      else if(!this.sg['filteredStories']){        
        this.topCard = true;
        this.pageNumber = 1;
        let loader = this.loadingCtrl.create({
          spinner: 'dots',
          content: 'Updating feed'          
        });
        loader.present().then(() => {
          //setTimeout(() => {
            let tempHttp = this.http;
            this.http.get(MyApp.API_ENDPOINT+'/me/feed?page='+this.pageNumber+'&page_size=10',this.httpOptions).map(res => res.json()).subscribe(data => {             
              this.systemCard = data.data.system_card ;
              this.http.get(MyApp.API_ENDPOINT+'/user/pending_actions/next',this.httpOptions).map(res => res.json()).subscribe(data => {
                let data1 = data.data;                             
                if(data1.action == "LOAD_ZONE") {
                  let zone_id = data1.data.id;
                  this.navCtrl.push(ZoneTimelinePage, {"zone_Id" : zone_id});
                }
              },
              err =>{
                alert("error:"+JSON.stringify(err)); 
              });
              this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(response => {
                //this.usersList();
                this.storage.set('userProfile', response.data);
                this.sg['myProfileData'] = response.data;
                let tempprofile = this.sg['myProfileData'];                
                if(this.sg['myProfileData'].avatar_toggle && response.data.avatar_name) {
                  let avtrName = (response.data.avatar_name).split(" ") ;
                  this.name = avtrName[0]; 
                }
                else if(response.data.name && !this.sg['myProfileData'].avatar_toggle){
                  let name = (response.data.name).split(" ") ;
                  this.name = name[0];
                }
                else {
                  this.name = 'User';
                }          
                this.notification_count = response.data.new_notification_count ;
                let toastCtrl = this.toastCtrl;
                Pusher.logToConsole = false;
                this.sg['notificationPusher'] = new Pusher('c02d2b34f9ba5121fbbb',{
                  cluster:'mt1',
                  encrypted: true
                });
                // if(typeof userChannel != 'undefined') {
                  var userChannel = this.sg['notificationPusher'].subscribe(tempprofile.user_websocket_channel); 
                  var that =  this ;
                  userChannel.bind("auto", function(dt) {
                    console.log("pusher message received from server :"+JSON.stringify(dt));                    
                      if(dt.meta.action == "TOAST") {
                        let toast = toastCtrl.create({
                          message: dt.data.message,
                          duration: 3000,
                          position : "top",
                          cssClass: "customToast"
                        });
                        toast.present();
                      }                    
                    tempHttp.get(MyApp.API_ENDPOINT+'/me/profile', that.httpOptions).map(res => res.json()).subscribe(result => {
                      that.storage.set('userProfile', result.data);
                      that.sg['myProfileData'] = result.data;                      
                      that.notification_count = result.data.new_notification_count ;
                      //alert(count);                        
                    });
                  });
                //}               
              }, err => {
                //this.usersList();
              });
              let feed = data.data.stories;
              this.searchResults = feed.length;
              let stories_length = this.stories.length;
              loader.dismiss();
              let channels = [], stories = this.stories, tempHttp = this.http, barchartData = this.barChartData, barchartColors = this.barChartColors,
              toastCtrl = this.toastCtrl, myProfileData = this.sg['myProfileData'];
              Pusher.logToConsole = false;
              this.sg['pusher'] = new Pusher('c02d2b34f9ba5121fbbb',{
                cluster:'mt1',
                encrypted: true
              });
              for(var i=0; i < feed.length; i++) {                                  
                this.fadeOutLeft.push(false);                
                this.stories.push([feed[i]]);
                this.discoverPageNumber.push(1);                
                channels.push(this.sg['pusher'].subscribe(feed[i].feed.websocket_channel));
                let http_Options = this.httpOptions; //user_count = this.user_count;
                if(typeof channels[i] != 'undefined') {                  
                  channels[i].bind("story_update", function(data1) {
                    console.log("pusher message received from server :"+JSON.stringify(data1));                     
                    let story_id = data1.data.story_id ;                    
                    tempHttp.get(MyApp.API_ENDPOINT+'/feed/story/'+story_id,http_Options).map(res => res.json()).subscribe(data2 => {
                      let story = data2.data, userFirstName;                                                                 
                      for(var j=0; j < stories.length; j++){
                        for(var k=0; k < stories[j].length; k++){
                          if(typeof stories[j][k].feed != 'undefined' && stories[j][k].feed.id == data2.data.feed.id) {
                            let temp_j = j ;                            
                            stories[j][k].feed.follows = story.feed.follows;
                            stories[j][k].feed.likes = story.feed.likes;
                            stories[j][k].feed.dislikes = story.feed.dislikes;
                            stories[j][k].feed.shares = story.feed.shares;
                            stories[j][k].feed.comments = story.feed.comments;
                            stories[j][k].feed.crowd_count = story.feed.crowd_count;
                            //user_count = story.feed.crowd_count;
                            stories[j][k].user = story.user;
                            stories[j][k] = story;
                            if(story.feed.type == "Story.Discover"){                  
                              stories[j][k].feed.opinions_count = story.feed.opinions_count;
                            }                            
                            else if(story.feed.type == "Story.Poll"){                             
                              stories[j][k].feed.options = story.feed.options;                  
                            } 
                            else if(story.feed.type == "Story.Review"){
                              stories[j][k].feed.responses = story.feed.responses;
                              stories[j][k].feed.average = story.feed.average;
                              stories[j][k].feed.votes = story.feed.votes;
                            }
                            setTimeout(() => {
                              if(story.feed.type == 'Story.Review') {
                                this.barChartOptions = this.barChartOptions;
                                this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
                                this.barChartType = 'bar';
                                barchartData[temp_j] = new Array(1);
                                barchartData[temp_j] = [{data:story.feed.graph_data}];   
                                barchartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];    
                            }
                          },2000);
                        }
                        else if(stories[j][k].id == story.feed.id){
                          if(story.feed.type == "Story.Discover"){
                            stories[j][k].follows = story.feed.follows;
                            stories[j][k].likes = story.feed.likes;
                            stories[j][k].dislikes = story.feed.dislikes;
                            stories[j][k].shares = story.feed.shares;
                            stories[j][k].comments = story.feed.comments;
                            stories[j][k].opinions_count = story.feed.opinions_count;                  
                          }
                        }
                      }              
                    }
                    //console.log(stories);
                  });
                });              
              }              
              if(feed[i].feed.type == 'Story.Review'){                
                this.barChartOptions = this.barChartOptions;
                this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
                this.barChartType = 'bar';
                this.barChartData[(stories_length+i)] = new Array(1);
                this.barChartData[(stories_length+i)][0] = {data:feed[i].feed.graph_data};
                this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];
              }
            }
            this.animation = true;
          },         
          err => {
            loader.dismiss(); 
            let error = JSON.parse(err._body);           
            if(error.error.message == "Invalid token provided. Please try again") {
              this.appCtrl.getRootNav().setRoot(LoginPage);
            }                      
          });
        //}, 500);
      });
    }
  }

  /* ----- auto refersh values every 10 seconds ----- */

  pollingCards(stories){
    for(var i=0; i < this.stories.length; i++) {
      for(var j=0; j < stories.length; j++) {
        if(this.stories[i].feed.id == stories[j].feed.id){
          this.stories[i].feed.follows = stories[j].feed.follows;
          this.stories[i].feed.likes = stories[j].feed.likes;
          this.stories[i].feed.shares = stories[j].feed.shares;
          this.stories[i].feed.comments = stories[j].feed.comments;
          this.stories[i].feed.options = stories[j].feed.options;
          this.stories[i].feed.responses = stories[j].feed.responses;
          this.stories[j].feed.crowd_count = stories[j].feed.crowd_count;
          this.stories[i].feed.average = stories[j].feed.average;
          if(typeof  this.stories[i].feed.graph_data != undefined){
            this.stories[i].feed.graph_data = stories[j].feed.graph_data;
          }
          break;          
        }
      }
    }
    setTimeout(() => {   
      for(var i=0; i < this.stories.length; i++) {
         if(this.stories[i].feed.type == 'Story.Review'){
          this.barChartOptions = this.barChartOptions;
          this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
          this.barChartType = 'bar';
          this.barChartData[i] = new Array(1);
          this.barChartData[i][0] = {data:this.stories[i].feed.graph_data};   
          this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];
        }
    
   } 

   },200); 

  }

  initialiseUsers() {
    this.people =  this.userList;
   }
  
  postCommentChange(id, value) {
    value[id] =  value[id].replace(/^\s+/g, '');    
    /*let regExp1 = /^[@]/g;
    this.str = value[id].split(" ");
    let lastWord = this.str[this.str.length-1] ;
    let isAtValid = lastWord.split("@");   
    this.isValidExp[id] = regExp1.test(lastWord);
    if(isAtValid || (this.isValidExp[id] == true)) {      
      let str = this.str[(this.str).length-1].split("@");  
         
      this.initialiseUsers();      
      if(str[1] && str[1].trim() != '') {
        this.people = this.people.filter((item) => {
          return (item.name.toLowerCase().indexOf(str[1].toLowerCase()) > -1);
        })
      }
      else {
        return this.people
      }
    }*/
    //value[id] = value[id].replace(/^\s+/g, '');       
  }

  submitComment(feed,idx) {
    let postData, des_temp;
    if(this.textInput[feed.id]) {
      this.textInput[feed.id] = this.textInput[feed.id].replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
      des_temp = btoa(unescape(encodeURIComponent(this.textInput[feed.id])));
    }        
    if(feed.type == 'Story.Poll' && feed.poll_type == 'recommend') {
      this.addRecommendation(idx, des_temp, feed);
    }     
    else if(feed.type == 'Story.Post') {
      this.firebase.logEvent("discuss_response", {content_type: "card", item_id: feed.id, item_name: feed.title, user_id:this.sg['myProfileData'].id});
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Loading'        
      });
      loader.present().then(() => {
        if(this.attachPic == null){
          postData = {
            "description": des_temp,
            "post_id": feed.id
          }
        }
        else {
          postData = {                  
            "attachment": this.attachPic,
            "description": des_temp,
            "post_id": feed.id
          }
        }
        this.textInput[feed.id] = "" ; 
        this.myHeight = "40px";
          setTimeout(() => { 
            this.myHeight = " ";
          },2000);
        this.http.post(MyApp.API_ENDPOINT+'/story/post/response/create', postData,this.httpOptions).map(res => res.json()).subscribe(data => {
          loader.dismiss();           
          this.textInput[feed.id] = "";
          this.stories[idx][0] = data.data ;          
          this.attachPic = null;                            
        },
        err => {
          loader.dismiss();
          let error = JSON.parse(err._body);        
          let alert = this.alertCtrl.create({        
            message: error.error.message,
            buttons: [{
              text: 'OK',
              handler: () => {
                this.textInput[feed.id] = "";                
              }
            }]
          });
          alert.present();            
        });
      });          
    }
    else {
      this.firebase.logEvent("discuss_response", {content_type: "card", item_id: feed.id, item_name: feed.title, user_id:this.sg['myProfileData'].id});
      if(this.attachPic == null){
        postData = {
          "description": des_temp          
        }
      }
      else {
        postData = {                  
          "attachment": this.attachPic,
          "description": des_temp          
        }
      }
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Loading'        
      });
      loader.present().then(() => {
        this.textInput[feed.id] = "" ; 
        this.myHeight = "40px";
          setTimeout(() => { 
            this.myHeight = " ";
          },2000);
        this.http.post(MyApp.API_ENDPOINT+'/story/'+feed.id+'/comment', postData,this.httpOptions).map(res => res.json()).subscribe(data => {
          loader.dismiss();           
          this.textInput[feed.id] = "";
          this.stories[idx][0] = data.data ;          
          this.attachPic = null;                            
        },
        err=> {
          loader.dismiss();
          let error = JSON.parse(err._body);        
          let alert = this.alertCtrl.create({        
            message: error.error.message,
            buttons: [{
              text: 'OK',
              handler: () => {
                this.textInput[feed.id] = "";                
              }
            }]
          });
          alert.present();            
        });
      });
    } 
  }
  visitedUsers(feed){
    this.storySimilarId = feed.id;
    this.story_target_method = feed.target_method ;    
    if(this.story_target_method == 'category'){      
      for(var i=0;i<this.interests.length;i++){
        if(this.interests[i].category.id == feed.target_values){
          this.target_values = this.interests[i].category.name;
          this.sg['filterBy'] = this.interests[i].category.name;
          break;
        }
      }
    }
    else if(feed.target_method == 'age_range'){      
      this.target_values = feed.target_values.min+' - '+feed.target_values.max+' years';
      this.sg['filterBy'] = this.target_values;
    }
    else if(feed.target_method == 'location'){      
      this.target_values = feed.target_values.city+', '+feed.target_values.state+', '+feed.target_values.country;
      this.sg['filterBy'] = this.target_values;      
    }
    else if(feed.target_method == 'gender'){      
      if(feed.target_values == 'male'){
        this.target_values = 'Men';
        this.sg['filterBy'] = 'MEN';        
      }
      else if(feed.target_values == 'female'){
        this.target_values = 'Women'
        this.sg['filterBy'] = 'WOMEN';
      }
      else {
        this.target_values = 'Other'
        this.sg['filterBy'] = 'OTHER';
      }         
    }
    else {
      this.sg['filterBy'] = 'EVERYONE';
      this.target_values = feed.target_values;
    }
    this.crowd_count = feed.crowd_count;    
    let popover = this.popoverCtrl.create(PopupCrowdInfoPage, {"count":this.crowd_count, "values":this.target_values, "token":this.tkn_sb, "storyId":this.storySimilarId});
    popover.present({
      
    });
    popover.onDidDismiss(data => {
      if(data == "active") {
        this.showSimilarCards(this.storySimilarId);
      }
      else {
        
      }      
    })    
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
  cardMethod(feed) {
    if(feed.type == 'Story.Review'){      
      return 'RATE';
    }
    else if(feed.type == 'Story.Discover'){      
      return 'DISCOVER';
    }
    else if(feed.type == 'Story.Post'){
       return 'DISCUSS';    
    }
    else if(feed.type == 'Story.Poll'){      
      if(feed.poll_type == 'poll'){
        return 'POLL';        
      }
      else {
        return 'ASK' ;
      }              
    }    
  }
  targetValues(feed):any{
    if(feed.target_method == 'category'){
      for(var i=0;i<this.interests.length;i++){
        if(this.interests[i].category.id == feed.target_values){
          let target_values = this.interests[i].category.name;
          return target_values;          
        }
      }
    }
    else if(feed.target_method == 'everyone'){
      return 'Everyone';
    }
    else if(feed.target_method == 'age_range'){
      let target_values = feed.target_values.min+' - '+feed.target_values.max+' y/o';
      return target_values; 
    }
    else if(feed.target_method == 'location'){
      let display_location = "";
      if(feed.target_values.sublocality) {
        display_location = feed.target_values.sublocality;
        if(feed.target_values.city){
          display_location = display_location+', '+feed.target_values.city;
        }
      }
      else if(feed.target_values.city) {
        display_location = feed.target_values.city;
        if(feed.target_values.state) {
          display_location = display_location+', '+feed.target_values.state;
        }
      }
      else if(feed.target_values.state) {
        display_location = feed.target_values.state;
        if(feed.target_values.country) {
          display_location = display_location+', '+feed.target_values.country;
        }
      }
      else if(feed.target_values.country) {
        display_location = display_location+', '+feed.target_values.country;
      }
      //let target_values = feed.target_values.city+', '+feed.target_values.state+', '+feed.target_values.country;
      return display_location;
    }
    else if(feed.target_method == 'gender'){
      if(feed.target_values == 'male'){
        return 'MEN'
      }
      else if(feed.target_values == 'female'){
        return 'WOMEN'
      }
      else {
        return 'OTHER'
      }      
    }
    else {
      return feed.target_values;
    }
  }
  myProfilePage() {
    this.navCtrl.push(YourProfilePage);               
  }
  chatList() {
    this.navCtrl.push(ChatListPage);
  } 
  notifications(count) {   
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
        this.notification_count = data.new_notification_count ;
      }); 
    }
  }
  
  /* ---------------------- like, dislike, undo, comment, share, follow, unfollow starts -------------------------------------------- */
  likeButton(id,parentIdx,count,event,story,childIdx, title){
    if(this.sg['myProfileData']) {
      this.firebase.logEvent("card_like", {content_type: "card", item_id: id, item_name: title, user_id:this.sg['myProfileData'].id});
    }
    else {
      this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(data => {
        this.storage.set('userProfile', data.data);        
        this.sg['myProfileData'] = data.data;
        this.notification_count = data.data.new_notification_count;
        this.firebase.logEvent("card_like", {content_type: "card", item_id: id, item_name: title, user_id:this.sg['myProfileData'].id});
      }); 
    }
    if(story === 'discover'){
      this.stories[parentIdx][0].user.disliked = false;
      this.stories[parentIdx][0].user.liked = true;
      this.stories[parentIdx][0].feed.likes = count+1;
    }
    else {
      this.stories[parentIdx][0].user.disliked = false;
      this.stories[parentIdx][0].user.liked = true;
      this.stories[parentIdx][0].feed.likes = count+1;
      if(this.stories[parentIdx][0].user.dislikes > 0){
        this.stories[parentIdx][0].user.dislikes = this.stories[parentIdx][0].user.dislikes-1;
      }
      else {
        this.stories[parentIdx][0].feed.dislikes = 0;
      }
    }
    this.http.post(MyApp.API_ENDPOINT+'/story/'+id+'/like',{},this.httpOptions).map(res => res.json()).subscribe(data => {
      this.stories[parentIdx][0] = data.data;
      /*let body = {        
          "message": "testing toast message",
          "user_id":  this.stories[parentIdx][0].feed.user.id      
      }
      this.http.post(MyApp.API_ENDPOINT+'/util/toast/messages', body,this.httpOptions).map(res => res.json()).subscribe(data => {
              
      });  */    
    });                     
  }
  unlikeButton(id,parentIdx,count,event,story,childIdx, discoveries) {
    if(story === 'discover'){
      this.stories[parentIdx][0].user.liked = false;        
      this.stories[parentIdx][0].user.disliked = true;
      if(count > 0){
        this.stories[parentIdx][0].feed.dislikes = count+1; 
      }
      else {
        this.stories[parentIdx][0].feed.dislikes = 1;
      }
    }
    else {
      this.stories[parentIdx][0].user.disliked = true;
      this.stories[parentIdx][0].user.liked = false;
      this.stories[parentIdx][0].feed.dislikes = count+1;
      if(this.stories[parentIdx][0].feed.likes > 0){
        this.stories[parentIdx][0].feed.likes = this.stories[parentIdx][0].feed.likes-1;
      }
      else {
        this.stories[parentIdx][0].feed.likes = 0;
      }      
    }
    this.http.post(MyApp.API_ENDPOINT+'/story/'+id+'/dislike',{},this.httpOptions).map(res => res.json()).subscribe(data => {
      this.stories[parentIdx][0] = data.data;      
    });    
  }
  follow(id,parentIdx,count,event,story,childIdx, title) {
    this.firebase.logEvent("card_follow", {content_type: "card", item_id: id, item_name: title});    
    this.stories[parentIdx][0].user.bookmarked = true;
    this.stories[parentIdx][0].feed.follows = count+1;    
    this.http.post(MyApp.API_ENDPOINT+'/story/'+id+'/follow',{},this.httpOptions).map(res => res.json()).subscribe(data => {
      this.stories[parentIdx][0] = data.data;      
    });
  }
  unfollow(id,parentIdx,count,event,story,childIdx, discoveries){   
    this.stories[parentIdx][0].user.bookmarked = false;
    this.stories[parentIdx][0].feed.follows = count-1;    
    this.http.post(MyApp.API_ENDPOINT+'/story/'+id+'/unfollow',{},this.httpOptions).map(res => res.json()).subscribe(data => {
      this.stories[parentIdx][0] = data.data;     
    });
  }
  undoAction(id,parentIdx,count,event,story,childIdx, action){
    if(action === 'like'){
      this.stories[parentIdx][0].user.liked = false;
      if(count > 0){
        this.stories[parentIdx][0].feed.likes = count-1;
      }
      else {
        this.stories[parentIdx][0].feed.likes = 0;
      }      
    }
    else if(action === 'discoverDislike'){
      this.stories[parentIdx][0].user.liked = false;
      if(count > 0){
        this.stories[parentIdx][0].feed.likes = count-1;
      }
      else {
        this.stories[parentIdx][0].feed.likes = 0;
      }      
    } 
    else {
      this.stories[parentIdx][0].user.disliked = false;
      if(count > 0){
        this.stories[parentIdx][0].feed.dislikes = count-1;
      }
      else {
        this.stories[parentIdx][0].feed.dislikes = 0;
      }      
    }
    this.http.post(MyApp.API_ENDPOINT+'/story/'+id+'/like/undo',{},this.httpOptions).map(res => res.json()).subscribe(data => {
      this.stories[parentIdx][0] = data.data;
      /*this.stories[parentIdx][0].feed.comments = data.data.feed.comments;
      this.stories[parentIdx][0].feed.likes = data.data.feed.likes;
      this.stories[parentIdx][0].feed.dislikes = data.data.feed.dislikes;
      this.stories[parentIdx][0].feed.follows = data.data.feed.follows;
      this.stories[parentIdx][0].feed.shares = data.data.feed.shares;
      this.stories[parentIdx][0].feed.crowd_count = data.data.feed.crowd_count;
      this.stories[parentIdx][0].user = data.data.user;
      this.stories[parentIdx][0].feed.zone = data.data.feed.zone;*/
    });
  }
  sharePopover(myEvent,permalink, title, parentIdx, childIdx, storyId, story) {
    this.firebase.logEvent("card_share", {content_type: "card", item_id: storyId, item_name: title});
      this.sg['popover'] = this.popoverCtrl.create(SharepopupPage,{permalink, token : this.tkn_sb, storyId}, {cssClass: 'custom-popover3'});
      this.sg['popover'].present({
        ev: myEvent
      });            
  }
  commenting(id, comments, title, userObj, feed){
    //alert(commentIdx);
    let zone_id;
    if(feed.zone) {
     zone_id = feed.zone.id;
    }
    if(this.sg['myProfileData']) {
      this.firebase.logEvent("card_comment", {content_type: "card", item_id: id, item_name: title, user_id:this.sg['myProfileData'].id});
    }
    else {
      this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(data => {
        this.storage.set('userProfile', data.data);       
        this.sg['myProfileData'] = data.data;
        this.notification_count = data.data.new_notification_count;
        this.firebase.logEvent("card_comment", {content_type: "card", item_id: id, item_name: title, user_id:this.sg['myProfileData'].id});
      }); 
    }
    this.navCtrl.push(CommentPage, {id, comments, title, userObj, tkn:this.tkn_sb, feed, zone_id});    
  }
  /* ---------------------- like, dislike, undo, comment, share, follow, unfollow ends -------------------------------------- */
  /* ------------------------------- showing similar cards starts -------------------------------------------------- */
  showSimilarCards(storyId) {
    this.stories = []; 
    this.sg['story_id'] = storyId;    
    this.filteredHashTag = null;
    this.closingCard('selectedChoice');
    this.filterCard = false;
    this.registration = false;
    this.addhashtag = false;
    this.showSimilar = true;
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Fetching similar cards'      
    });
    this.content.scrollToTop();
    loader.present().then(() => {
      this.http.post(MyApp.API_ENDPOINT+'/get/feed/'+storyId+'/similar',{},this.httpOptions).map(res => res.json()).subscribe(data => {
        loader.dismiss();
        this.hashtagStories = data.data.stories;                    
        for(var i=0;i<data.data.stories.length;i++) {
          this.stories.push([data.data.stories[i]]);
          if(data.data.stories[i].feed.type == 'Story.Review'){
            this.barChartOptions = this.barChartOptions;
            this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            this.barChartType = 'bar';
            this.barChartData[i] = [{data:data.data.stories[i].feed.graph_data}];
            this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];
          }
        }      
      },err => { loader.dismiss(); });
    });
  }
   /* ------------------------------- showing similar cards ends-------------------------------------------------- */

   
  /* ------------------------------- filter by hashtag starts -------------------------------------------------- */
  filterByHashtag(status) {
    this.myHashtagStatus = status;
    this.filterbyHash = true;       
    this.closingCard('selectedChoice');
    this.stories = [];
    this.filterCard = false;    
    this.registration = false;
    this.addhashtag = false;
    //this.content.scrollToTop(); 
    this.hashtagStories =  this.sg['filteredStories'];             
    for(var i=0;i<this.sg['filteredStories'].length;i++) {
      this.stories.push([this.sg['filteredStories'][i]]);
      if(this.sg['filteredStories'][i].feed.type == 'Story.Review'){
        this.barChartOptions = this.barChartOptions;         
        this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        this.barChartType = 'bar';
        this.barChartData[i] = [{data:this.sg['filteredStories'][i].feed.graph_data}];
        this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];
      }
    }
  }

  filterByHashtag_1(hashtag, status) {
    this.myHashtagStatus = status;
    this.filterbyHash = true;        
    this.closingCard('selectedChoice');
    this.stories = [];
    this.filterCard = false;
    this.sg['filterBy'] = hashtag;
    this.registration = false;
    this.addhashtag = false;
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Getting matched cards'      
    });
    this.content.scrollToTop();
    loader.present().then(() => {    
      this.http.get(MyApp.API_ENDPOINT+'/util/hashtags/feed?hashtag='+hashtag, this.httpOptions).map(resp => resp.json()).subscribe(data => {
        loader.dismiss();
        this.sg['filteredStories'] = data.data.stories;           
        for(var i=0;i<this.sg['filteredStories'].length;i++) {
          this.stories.push([this.sg['filteredStories'][i]]);
          if(this.sg['filteredStories'][i].feed.type == 'Story.Review'){
            this.barChartOptions = this.barChartOptions;         
            this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            this.barChartType = 'bar';
            this.barChartData[i] = [{data:this.sg['filteredStories'][i].feed.graph_data}];
            this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];
          }
        }
      }, err => {
        loader.dismiss();
      });
    });
  }    

  /* ------------------------------- filter by hashtag ends -------------------------------------------------- */

  /* ------------------------------- Adding hashtags while card creation starts -------------------------------------------------- */
  changeHashTag(hashtag) {          
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
        this.selectedHashTags.push(hashtag);
        this.removeDuplicates();               
        temp1 = "";
        this.hashtagInput = null;
      }
      if(temp2 > 0) {        
        let tag = hashtag.split(",");
        this.selectedHashTags.push(tag[0]);
        this.removeDuplicates();        
        temp2 = "";
        this.hashtagInput = null;
      }      
    }  
  }
  removeDuplicates() {
    let newArr = [],found,x,y;        
    for (x = 0; x < this.selectedHashTags.length; x++) {
      found = undefined;
      for (y = 0; y < newArr.length; y++) {
        if (this.selectedHashTags[x] === newArr[y]) {
          found = true;
          break;
        }
      }
      if (!found) {
        newArr.push(this.selectedHashTags[x]);
      }
    }
    this.selectedHashTags = newArr;      
    for (var i = 0; i < this.selectedHashTags.length; i++) {    
      if (this.selectedHashTags[i].trim().length == 0) { 
        this.selectedHashTags.splice(i, 1);
      }
    }
  }
  /* ------------------------------- Adding hashtags while card creation ends -------------------------------------------------- */

  /* ------------------------------- Editing hashtags while card creation starts -------------------------------------------------- */
  editHashTag(value, idx) {    
    this.selectedHashTags.splice(idx, 1);
    this.hashtagInput = value.trim(" ");       
  }
  /* ------------------------------- Editing hashtags while card creation ends -------------------------------------------------- */

  selectHashTag(value) {
    value = value.trim(" ");
    this.selectedHashTags.push(value);    
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
    this.selectedHashTags.push(hashtag);
    this.removeDuplicates();   
    this.hashtagInput = null;
  }
  deleteHashTag(value, idx) {
    this.selectedHashTags.splice(idx, 1);    
  }
  followHashtag(value, type) {
    /*let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Updating your #tags'      
    });
    loader.present().then(() => {*/
      if(type == 'unfollow') {
        this.myHashtagStatus = false;
      }
      else {
        this.myHashtagStatus = true;
      }
      let body = {
        "hashtags": [value]        
      }
      if(type == 'unfollow') {
        body['action'] = "REMOVE";
      }
      else {
        body['action'] = "APPEND";
      }      
      this.http.post(MyApp.API_ENDPOINT+'/me/hashtags/update', body,this.httpOptions).map(resp => resp.json()).subscribe(data => {
        //loader.dismiss();
        if(type == 'unfollow') {
          this.myHashtagStatus = false;
          let toast = this.toastCtrl.create({
            message: "Successfully removed.",
            duration: 3000,
            position : "top",
            cssClass: "customToast"
          });
          toast.present();
        }
        else {
          this.myHashtagStatus = true;
          let toast = this.toastCtrl.create({
            message: "Successfully added.",
            duration: 3000,
            position : "top",
            cssClass: "customToast"
          });
          toast.present(); 
        } 
      }, err => {
        //loader.dismiss();
        let toast = this.toastCtrl.create({
          message: "Sorry! Something went wrong.",
          duration: 3000,
          position : "top",
          cssClass: "customToast"
        });
        toast.present();
      });
    //}); 
  }
  myHashtag(value) {
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
  myHashtag1(value) {
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
  myHashtag2(value) {
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
  myHashtag3(value) {
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
  myHashtag4(value) {
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
  showMoreHashtags(tags, storyIdx) {
    this.isShowAllHashtags[storyIdx] = 'true';       
  }
  hideMoreHashtags(tags, storyIdx) {
    this.isShowAllHashtags[storyIdx] = 'false';       
  }
  isMyhashtag(tag) {
    let value = tag.trim(" ");
    if(this.sg['myProfileData']){     
      for(var j=0;j<this.sg['myProfileData'].hashtags.length;j++) {        
        this.sg['myProfileData'].hashtags[j] = this.sg['myProfileData'].hashtags[j].trim(" ");        
        if(this.sg['myProfileData'].hashtags[j].toLowerCase() == value.toLowerCase()) {
          return true;
        }
      }
    }
  }
  changeInput() {
    let element   = document.getElementById('messageInput');
    let textarea  = element.getElementsByTagName('textarea')[0];
    textarea.style.minHeight  = '24px';
    textarea.style.height     = '24px';
     let scroll_height = textarea.scrollHeight;
    if(scroll_height > 116) {
      scroll_height = 110;
      this.activatePadding = false;
    }
    else if(scroll_height < 116){
     this.activatePadding = true;
    }
    element.style.height      = scroll_height + 16 + "px";
    textarea.style.minHeight  = scroll_height + 16 + "px";
    textarea.style.height     = scroll_height + 16 + "px";
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
  desChangeLoop(description, idx, storyIdx, eleId){
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
  
   
  usersList() {
    let body = {
      "page": 1,
      "page_size": 7,
      "search_string": ""           
    }
    this.people = [];
    this.http.post(MyApp.API_ENDPOINT+'/util/search/people/autocomplete',body, this.httpOptions).map(res => res.json()).subscribe(data => {
      this.userList = data.data.users;
      for(var i=0;i<this.userList.length;i++) {
        this.people.push(this.userList[i]);
      }
    });
  }
  
  selectName(person, id) {
    let message_users = this.message_users[id] ;
    message_users.push({"id" : person.id, "name" : person.name}) ;
    var lastIndex = this.textInput[id].lastIndexOf(" ");
    this.textInput[id] = this.textInput[id].substring(0, lastIndex);      
    this.textInput[id] = this.textInput[id] + " " + "@[" + person.name + "]"; 
    //this.isValidExp[id] = false;    
  }

  getStory() {     
    this.sg['filteredStories'] =  ''; 
    this.errMsg = "";       
    this.closingCard('selectedChoice');        
    this.filterCard = false;
    this.registration = false;
    this.addhashtag = false;        
    let headers = new Headers( );
      headers.append( 'Content-Type','application/json');
      headers.append( 'Accept', 'application/json');
      headers.append( 'token', this.sg['token']);
    let options = new RequestOptions({
      headers: headers
    });
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Loading'          
    });
    // alert("token:"+this.sg['token']);
    // alert("id:"+this.sg['storyId']);
    loader.present().then(() => {                
      this.http.get(MyApp.API_ENDPOINT+'/feed/story/'+this.sg['storyId'],options).map(res => res.json()).subscribe(res => {
        loader.dismiss();
        this.stories = [];                  
        this.stories = [[res.data]];          
        if(res.data.feed.type == 'Story.Review'){
          this.barChartOptions = this.barChartOptions;
          this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
          this.barChartType = 'bar';
          this.barChartData[0] = [{data:res.data.feed.graph_data}];
          this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];
        } 
        //alert("story:"+this.stories);            
      }, 
      err => {
        this.stories = [];
        loader.dismiss();
        this.errMsg = "Oops, card not found. Creator may have deleted it."
        //alert("error"+JSON.stringify(err));
      });
    });
    console.log(this.stories);
  }
  changeDescription() {
    let element   = document.getElementById('descriptionInput');
    let textarea  = element.getElementsByTagName('textarea')[0];
    textarea.style.minHeight  = '24px';
    textarea.style.height     = '24px';
     let scroll_height = textarea.scrollHeight;
    if(scroll_height > 116) {
      scroll_height = 110;
      this.activatePadding = false;
    }
    else if(scroll_height < 116){
     this.activatePadding = true;
    }
    element.style.height      = scroll_height + 16 + "px";
    textarea.style.minHeight  = scroll_height + 16 + "px";
    textarea.style.height     = scroll_height + 16 + "px";
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

  invite() {
    let popover= this.popoverCtrl.create(InvitePopupPage,{}, {cssClass: 'custom-popover4'});
      popover.present({      
    });
  }
  searchItems() {
    let popover= this.popoverCtrl.create(PopupMorePage);
      popover.present({      
    });
  }
  addMember() {
    let popover= this.popoverCtrl.create(PopupMorePage);
      popover.present({      
    });
  }
  startChat(id,name){
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
        this.navCtrl.push(MessagesPage, {id,name,chatId,webChatId});
      },
      err => {
        loader.dismiss();
      });              
    }); 
  }
}

 