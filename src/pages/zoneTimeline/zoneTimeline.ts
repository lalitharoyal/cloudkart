import { Component, ViewChild, NgZone} from '@angular/core';
import { NavController, LoadingController, ToastController,AlertController, NavParams, Content, Platform, ModalController, Keyboard, App} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';
import { UserInterestService } from '../../providers/userInterest.service';
import {SimpleGlobal} from 'ng2-simple-global';
import { Firebase } from '@ionic-native/firebase';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ImagePicker } from '@ionic-native/image-picker';
import { GalleryModal } from 'ionic-gallery-modal';
import { AppMinimize } from '@ionic-native/app-minimize';    

import { CommentPage } from '../comment/comment';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PopoverController } from 'ionic-angular';
import { SharepopupPage } from '../share_popup/share_popup';
import { PopupCrowdReachCountPage } from '../popup-crowdReachCount/popup-crowdReachCount';
import { LoginPage } from '../login/login';
import { PopupDeletePage } from '../popup-delete/popup-delete';
import { YourProfilePage } from '../your_profile/your_profile';
import { PopupOptionsPage } from '../popup-options/popup-options';
import { AddMembersPage }from'../add-members/add-members';
import { PopupCrowdInfoPage } from '../popup-crowdInfo/popup-crowdInfo';
import { EditZonePage } from '../edit_zone/edit_zone';
import { ProfileUserPage } from '../profile_user/profile_user';
import { ZonesPage } from '../zones/zones';
import { InviteMembersPage } from '../invite_members/invite_members';
import { InvitePopupPage } from '../invite-popup/invite-popup';
import{ViewfollowersListPage}from '../viewfollowers-list/viewfollowers-list';
import { TabsPage } from '../tabs/tabs';
import { EmailInvitationsPage } from '../email_invitations/email_invitations';

declare var google;
declare var Pusher:any ;
declare function unescape(s:string): string;

@Component({
  selector: 'page-zoneTimeline',
  templateUrl: 'zoneTimeline.html',
  providers: [UserInterestService] 
})
export class ZoneTimelinePage {
  @ViewChild(Content) content: Content;
  shouldHide:boolean;  amhiding:boolean;  tkn_sb:any;  httpOptions= {};  expanddescription:boolean = false; zone_id: string;  zoneInfo: any; creatingCard :boolean = false; cardTitle:any; allcards:any; addhashtag:boolean=false;interests:any;
  selectedHashTags = [];  hashtagInput: any;  tags: any;  myHashtagStatus: boolean; interestchoice: any; selectedChoice:boolean = false;
  crowdChoice = null; selectedInterest : any; interestId=[]; topUpStatus : boolean = false; give_feedback_description:any; selectedGender:any=null;
  cardType: any = 'discuss'; inputs: Array<{placeholder: any}>; options:Array<any> = []; feedbackStatus : boolean = false; color:any;  rangeValue :any;
  targetValue :any; locationStatus:string = 'current'; specific_location:any; places:any; specificLoc:any=null; categoryName:any=[];
  placeholders: string[]; nearMe:any;current_address={};specific_address={}; filterCard : boolean = true;  minAges:any = [];maxAges:any = [];min_age:any = null;max_age:any=null; specific_age:string='myAge';
  barChartOptions:any;barChartLabels :string[];barChartType:string;barChartLegend:boolean = false; barChartData = [];barChartColors:Array<any>;
  my_index: number; zoneStories = []; pageNumber :number = 1;discoverPageNumber  = [] ;  userProfile: any; crowd_reach_count: any; searchResults: any; user_count: any;
  fireBaseTkn: string; textInputReview = []; textInput = []; validOpinion = []; selected_item : any;recommendText = []; cardDisabled = [];
  diffDays: number; diffMonths: number;  year: number;  diffHours: number;  diffMin: number;  activatePadding : boolean = true; filteredHashTag:any;filterbyHash:boolean = false; rangeDisabled = [];
  hashtagStories: any; filterValue: any; doneBtn = []; description = [];  percentage = []; checked = []; validRecommendation = [];  comment = [];
  attachPic: any;  postData:any;  notification_count: any;  data: any;  str: any;  mentors: any =[];  array: any =[];  full: any =[];  lastName: any;
  firstName: string;  reviewType: string = "get_feedback";  pollCharacterleft : number = 200;characterleft : number = 200;  recCharacterleft : number = 200;postCharacterleft : number =200;maxlength=200;revMaxlength=200;postMaxlength = 200;
  target_values: any;  crowd_count: any;  story_target_method: any;  storySimilarId: any;  showSimilar: boolean = false;  zoneStoriesLength: any;
  showLoader: boolean = false;  page_from: any;  refresher: any;  attachedImages = []; attachmentLoader:boolean = false; viewMembers:boolean = false;
  zoneMembers: any;  muteStatus: any;  userId: any; isSomethingMore:boolean = false; postCardDescription:any = "";postCardDescriptionLength:number =3000; descriptionMaxLength:number = 3000;
  zone_invitee_id: any;  isValid: boolean;  preview: any;  preview_review: any;  myColor: string; ratingCharacterleft: number = 3000;
  myHeight: string; isShowAllHashtags = []; isCreationMode: boolean = false;

  cardStatus_1: boolean = true; cardStatus_2: boolean = false; cardStatus_3 : boolean = false; cardStatus_4 : boolean = false; 
  targetMethod = "category"; descriptionstatus : boolean = true;
  validUrl: any;
  leader_id: any;
  pageToOpen: any;
  message: any;
  isAnimation = [];
  isCancelled = [];
  
  constructor(public navCtrl: NavController, 
    private socialSharing: SocialSharing, 
    public popoverCtrl: PopoverController,
    private http: Http, public toastCtrl: ToastController,
    private storage: Storage, 
    public loadingCtrl: LoadingController,
    public alertCtrl : AlertController,
    public navParams : NavParams,
    public userService: UserInterestService,
    public sg: SimpleGlobal,
    private firebase: Firebase,
    public platform: Platform,
    private iab: InAppBrowser,
    public zone : NgZone,
    private imagePicker: ImagePicker,
    public modalCtrl:ModalController,
    public keyboard : Keyboard,
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
      this.zone_id = this.navParams.get('id');
      this.zone_invitee_id = this.navParams.get('zone_Id');
      this.page_from = this.navParams.get('page');
      this.pageToOpen = this.navParams.get('page1');
      this.message = this.navParams.get('succs_msg');           
      this.initialiseItems();
      this.initialiseVariables();
      
      if(this.page_from == "createZone"){
        this.toaster();
      }
  }

  toaster(){
    let toast = this.toastCtrl.create({
        message: this.message,
        duration: 3000,
        position : "middle"
      });
      toast.present(); 
  }
  ionViewWillLeave() {    
    this.sg['pageName'] = "zoneTimeline";
  }
  ionViewDidEnter() {      
    if(this.sg['editZoneId']) {
      this.http.get(MyApp.API_ENDPOINT+'/zone/'+this.zone_id, this.httpOptions).map(res => res.json()).subscribe(data => {        
        this.zoneInfo = data.data;
        this.storage.set('zone_info',JSON.stringify(this.zoneInfo));
        this.sg['editZoneId'] = null;
        this.http.get(MyApp.API_ENDPOINT+'/zone/'+this.zone_id+'/mentors', this.httpOptions).map(res => res.json()).subscribe(data => {                
          this.mentors = data.data.mentors;
        });  
      });  
    }    
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
  initialiseVariables() {
    if(this.interests && this.interests.length > 0) {
      this.resetInterests();
    }    
    this.allcards = "discuss";
    this.validUrl = ""; 
    this. my_index = 0;
    this.cardType = 'discuss';
    this.isCreationMode = false;
    this.placeholders = ["What say you?"];
    this.nearMe = "";
    this.filterCard = true;    
    this.attachmentLoader = false;
    this.cardStatus_1 = true;
    this.cardStatus_2 = false;
    this.showLoader = false;
    this.attachedImages = [];
    this.selectedInterest = null;
    this.current_address={}; 
    this.specific_address={};
    this.addhashtag = false;
    this.selectedChoice = false;
    this.cardTitle = "";    
    this.selectedHashTags = ['allmembers'];
    this.interestId = [];
    this.categoryName = [];
    this.interestchoice = 'everyone';
    this.sg['cardHidden'] = []; 
    this.hashtagInput = "";
    this.postCardDescription = "";
    this.isSomethingMore = false;
    this.give_feedback_description = "";
    this.rangeValue = null;
    this.tags = [];
    this.isShowAllHashtags = [];     
    this.inputs=[
      {placeholder:'Option 1'},
      {placeholder:'Option 2'}            
    ];
    this.feedbackStatus = false;
    this.cardTitle = "";
    this.reviewType = "get_feedback";    
  }
  doRefresh(refresher) {
    this.sg['pusher'].disconnect();
    setTimeout(() => {
      this.zoneStories = [];
      this.initialiseVariables();         
      this.http.get(MyApp.API_ENDPOINT+'/zone/'+this.zone_id+'/timeline?page=1&page_size=10',this.httpOptions).map(res => res.json()).subscribe(data => {       
        this.showLoader = false;
        this.zoneStoriesLength = data.data.length;          
        Pusher.logToConsole = false;
        this.sg['pusher'] = new Pusher('c02d2b34f9ba5121fbbb',{
          cluster:'mt1',
          encrypted: true
        });
        let stories =  data.data;
        let zoneStorieslength = this.zoneStories.length;
        let channels = [];        
        for(var i=0;i<stories.length;i++) {         
          this.discoverPageNumber.push(1);
          this.zoneStories.push(stories[i]);              
          if(stories[i].feed.type == 'Story.Review'){
            this.barChartOptions = this.barChartOptions;
            this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            this.barChartType = 'bar';
            this.barChartData[(zoneStorieslength)+i] = new Array(1);
            this.barChartData[(zoneStorieslength)+i][0] = {data:stories[i].feed.graph_data};   
            this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];    
          }
          let that = this;
          channels.push(that.sg['pusher'].subscribe(stories[i].feed.websocket_channel));              
          channels[i].bind("story_update", function(data1) {
            console.log("pusher message received from server :"+JSON.stringify(data1));
            let updated_storyid = data1.data.story_id ;            
            that.http.get(MyApp.API_ENDPOINT+'/feed/story/'+updated_storyid,that.httpOptions).map(res => res.json()).subscribe(data2 => {
              for(var i=0;i<stories.length;i++) {
                if(stories[i].feed.id == updated_storyid) {
                  that.zoneStories[i] = data2.data;
                }
              }              
            });
          });
        }        
      }, err => {
        this.showLoader = false;
      });  
      refresher.complete();
    }, 2000);              
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
  goToLink(url){
    if(url == null){
      const browser = this.iab.create('https://www.foreva.app/','_system',{location:'no'});
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
  onScroll($event) {  
    this.zone.run(() => {
      if ($event && $event.scrollTop > 1){
        this.keyboardOpens('nothing');
      }
      else{
        this.topUpStatus = false;
      }
    })
  }
   scrollToTop($event) {
    this.content.scrollToTop();    
    // this.animation =  true;    
  }
  initialiseItems() {
    setInterval(()=>{      
      if( this.placeholders.length-1 == this.my_index){
        this.my_index = 0;
      }
      else{
        this.my_index = this.my_index+1;        
      }
    },2000);
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
      this.httpOptions = {
        headers: new Headers({'Content-Type': 'application/json','Accept':'application/json', 'token': this.tkn_sb})
      };
      if(this.zone_invitee_id){
        this.zone_id = this.navParams.get('zone_Id');
      }      
      this.http.get(MyApp.API_ENDPOINT+'/user/token/validate', this.httpOptions).map(res => res.json()).subscribe(data => {
      if(data.data.user == false){
        //this.navCtrl.setRoot(LoginPage);
        this.appCtrl.getRootNav().setRoot(LoginPage); 
      }
      this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(data => {
        this.userId = data.data.id;
        this.userProfile = data.data;
        let temp1 = data.data.id.search("_");        
        if(temp1 > 0) {
          this.userProfile.id = data.data.id.split("_")[0];
        }        
        this.notification_count = data.data.new_notification_count;
      });                        
      /*this.firebase.getToken().then(token => {
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
        this.http.post(MyApp.API_ENDPOINT+'/me/device/register',body,this.httpOptions).map(res => res.json()).subscribe(data => {}, err => {}); 
      }).catch(error => {});
      this.firebase.onNotificationOpen().subscribe(data => {                                               
        this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(data => {
          this.userProfile = data.data;
          this.notification_count = data.data.new_notification_count;
        }); 
        if(data.tap){
          if(data.show_page == 'notification_stack'){
            this.navCtrl.push(SystemMessagesPage);
          }
          else {
            this.navCtrl.setRoot(ZoneTimelinePage);
          }
        } 
        else {}; 
      });*/
     // this.firebase.onTokenRefresh().subscribe((token: string) => {});
      },err => {                
        let error = JSON.parse(err._body);
        if(error.status == false){
          this.storage.remove('sbtkn');
          this.storage.remove('profileStatus');
          this.storage.remove('userProfile');              
          //this.navCtrl.setRoot(LoginPage); 
          this.appCtrl.getRootNav().setRoot(LoginPage);        
        }               
      });
      this.showLoader = true;      
      this.http.get(MyApp.API_ENDPOINT+'/zone/'+this.zone_id, this.httpOptions).map(res => res.json()).subscribe(res => {
        this.zoneInfo = res.data;        
        let temp1 = res.data.id.search("_");        
        if(temp1 > 0) {
          this.zoneInfo.id = res.data.id.split("_")[0];
        }
        this.storage.set('zone_info',JSON.stringify(this.zoneInfo));
        if(this.page_from == 'createZone') {
          this.addMembers();
        }
        /* Starts Getting Mentors */        
        this.http.get(MyApp.API_ENDPOINT+'/zone/'+this.zoneInfo.id+'/mentors', this.httpOptions).map(res => res.json()).subscribe(data => {                
          this.mentors = data.data.mentors;
          // this.mentors['mentorStatus'] = [];
          // for(var i=0;i < this.mentors.length; i++) {
          //   this.mentors['mentorStatus'].push(false);
          // }
          /* Zone timeline feed api starts*/          
          this.http.get(MyApp.API_ENDPOINT+'/zone/'+this.zone_id+'/timeline?page=1&page_size=10',this.httpOptions).map(res => res.json()).subscribe(data => {
            if(this.zone_invitee_id){
              this.http.get(MyApp.API_ENDPOINT+'/user/pending_actions/first/clear',this.httpOptions).map(res => res.json()).subscribe(data => {
                console.log(data.data);
              },
              err =>{          
              });
            } 
            this.http.get(MyApp.API_ENDPOINT+'/user/preferences/default/get',this.httpOptions).map(res => res.json()).subscribe(data => {
              this.interests = data.data.preferences;
              this.resetInterests();
              this.http.get(MyApp.API_ENDPOINT+'/zone/'+this.zoneInfo.id+'/status',this.httpOptions).map(res => res.json()).subscribe(data => {
                this.muteStatus = data.data.message.mute;              
              });
            });            
            this.refresher = null;
            this.showLoader = false;
            this.zoneStoriesLength = data.data.length;          
            Pusher.logToConsole = false;
            this.sg['pusher'] = new Pusher('c02d2b34f9ba5121fbbb',{
              cluster:'mt1',
              encrypted: true
            });
            let stories =  data.data;
            let zoneStorieslength = this.zoneStories.length;
            let channels = [];        
            for(var i=0;i<stories.length;i++) {         
              this.discoverPageNumber.push(1);
              this.zoneStories.push(stories[i]);              
              if(stories[i].feed.type == 'Story.Review'){
                this.barChartOptions = this.barChartOptions;    
                this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
                this.barChartType = 'bar';
                this.barChartLegend = false;
                this.barChartData[(zoneStorieslength+i)] = new Array(1);
                this.barChartData[(zoneStorieslength+i)][0] = {data:stories[i].feed.graph_data};
                this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];                
                
                
                // this.barChartData[0] = new Array(1);
                // this.barChartData = [{data:stories[i].feed.graph_data}];
              }
              let that = this;
              channels.push(that.sg['pusher'].subscribe(stories[i].feed.websocket_channel));              
              channels[i].bind("story_update", function(data1) {
                console.log("pusher message received from server :"+JSON.stringify(data1));
                let updated_storyid = data1.data.story_id ;            
                that.http.get(MyApp.API_ENDPOINT+'/feed/story/'+updated_storyid,that.httpOptions).map(res => res.json()).subscribe(data2 => {
                  for(var i=0;i<stories.length;i++) {
                    if(stories[i].feed.id == updated_storyid) {
                      that.zoneStories[i] = data2.data;
                    }
                  }              
                });
              });
            }        
          }, err => {
            this.showLoader = false;
            let error = JSON.parse(err._body);           
            if(error.error.message == "Invalid token provided. Please try again") {
              this.appCtrl.getRootNav().setRoot(LoginPage);
            }
          });
          /* Zone timeline feed api ends*/ 
        },
        err => {
          this.showLoader = false;          
        });
        /* Ends getting Mentors */                      
      });
    });
  }
  profileUser(id, userObj){    
    this.navCtrl.push(ProfileUserPage,{id, userObj});
  }
  viewMemberProfile(id) {
    let avatarStatus = false;
    this.navCtrl.push(YourProfilePage,{id, avatarStatus});
  }
  myProfilePage() {
    this.navCtrl.push(YourProfilePage);               
  }
  splittingName(userInfo): string{
    if(userInfo && userInfo.name){
      // let userName = userInfo.name.split(" ");   
      // return userName[0].charAt(0).toUpperCase() + userName[0].slice(1);
      return userInfo.name;
    }    
    else return 'User';    
  }
  ratingCount(msg, value){
    if(value == 'give_feedback') {
      if(this.descriptionMaxLength>=msg.length){
        this.ratingCharacterleft=(this.descriptionMaxLength)-(msg.length);
      }
    }
  }
  displayTime(date): string {
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
  /* ---------- creation of card starts ---------- */
  addMembers(){
    // this.navCtrl.push(InviteMembersPage, {"zone_list" :this.zoneInfo});
    let popover = this.popoverCtrl.create(InvitePopupPage,{"zone_list" :this.zoneInfo}, {cssClass: 'custom-popover4'});
      popover.present({      
    });
    popover.onDidDismiss(data => {
      if(data == "emailInvite") {
        this.navCtrl.push(EmailInvitationsPage, {"zone_list" :this.zoneInfo});
      }
      else if(data == "extngUserInvite") {
        this.navCtrl.push(InviteMembersPage, {"zone_list" :this.zoneInfo});        
      } 
    })
  }
  moreOptions() {
    let popover= this.popoverCtrl.create(PopupOptionsPage, {"zoneStatus" : this.muteStatus, "zone_info" : this.zoneInfo}, {cssClass: 'custom-popover2'});
    popover.present({      
    });
    popover.onDidDismiss(data => {
      if(data == true) {
        this.muteStatus = true;
      }
      else if(data == false){
        this.muteStatus = false;
      }
      else if(data == "mentors") {
        this.navCtrl.push(AddMembersPage);
      }
      else if(data == "exit") {
        this.navCtrl.setRoot(ZonesPage);
        //this.sg['segment'] = "zones";
      } 
      else if(data == "edit") {
        this.navCtrl.push(EditZonePage, {'zoneId' : this.zone_id}); 
      }
      // else if(data == "addAdmin") {
      //   this.navCtrl.push(ViewMembersPage, {'zone_id': this.zone_id, 'user_profile' : this.userProfile}); 
      // }                
    }) 
  }

  goBack(){
    this.navCtrl.setRoot(TabsPage, {selectedTab : 1});
    //this.sg['segment'] = "zones";   
  }
  creationOfCard(cardType){
    //this.content.scrollToTop();
    this.creatingCard = true;
    this.allcards = cardType;
    this.changeCardType(cardType);   
  }
  myTitle() {
    // this.content.scrollToTop();
    this.isCreationMode = true;
    if(this.cardTitle) {
      this.cardTitle = this.cardTitle.replace(/^\s+/g, '');
      //this.cardTitle = this.cardTitle.replace(/[^a-zA-Z0-9, ]/gi,'');
      if(this.cardTitle && this.cardTitle.length > 0) {
        this.creatingCard = true;                   
      }
    }
  } 

  changeCardType(value){
    this.cardType = value;       
    if(value == 'discuss'){
      this.placeholders = ["What say you?"];     
      //this.allcards = 'discuss';
      this.creatingCard = false;
    }
    else if(value == 'review'){
      this.placeholders = ["Share or ask for a review/rating.."];      
    }
    else if(value == 'poll'){
      this.placeholders = ["Run a poll on.."];     
    }
    else if(value == 'recommend'){
      this.placeholders = [ "Get suggestions on.."];      
    }
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
    if(title == "discuss"){
      return "ADD / SAY SOMETHING MORE"
     }
     if(title == "poll"){
       return "ADD AN IMAGE OR A DESRCIPTION (OPTIONAL)"
     }
     if(title == "recommend"){
       return "ADD / SAY SOMETHING MORE"
     }     
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
  
  slidingMethod(rangeValue){
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
    expandDescription(type){
      this.content.scrollToTop();      
      if(type == 'viewmembers') {
        this.expanddescription = true;
        this.viewMembers = true;
      }
      else {
        this.viewMembers = false;
        this.expanddescription=this.expanddescription ? false :true;
      }
  }
  editMembers(){
    //this.navCtrl.push( ViewMembersPage, {'zone_id': this.zone_id, 'user_profile' : this.userProfile});
    this.navCtrl.push( AddMembersPage, {"zone_list" :this.zoneInfo});
  }
  chooseType(value){
    this.content.scrollToTop();        
    this.addhashtag = false;
    this.selectedChoice = true;
    //this.askAll = null;     
    if(value == 'category'){
      this.interestchoice = value;      
      this.crowdChoice = 'Broad Interests';
      this.selectedGender = null;
      this.locationStatus =  "current";
      this.specific_age = "myAge";
      this.selectedHashTags = [];      
    }    
    else if(value == 'age_range'){
      this.interestchoice = value;      
      this.crowdChoice = 'Age';
      this.selectedInterest = null; 
      this.selectedGender = null;
      this.locationStatus =  "current";
      this.selectedHashTags = [];   
    }
    else if(value == 'location'){
      this.interestchoice = value;
      this.getLocation();      
      this.crowdChoice = 'Location';
      this.selectedInterest = null; 
      this.selectedGender = null;    
      this.specific_age = "myAge";
      this.selectedHashTags = [];     
    }
    else if(value == 'everyone'){
      this.selectedChoice = false;
      if(this.interestchoice == "everyone") {
        this.interestchoice = null;
      }
      else {
        this.interestchoice = "everyone";
      }      
      this.locationStatus =  "current";
      this.specific_age = "myAge";
      this.selectedInterest = null;
      this.target_values = [];
      this.addhashtag = true;
      this.selectedHashTags = ['allmembers'];            
    }        
  }
  resetInterests() {
    for(var i=0;i<this.interests.length;i++) {
      this.interests[i].set = false;
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
  genderSelection(value) {
    if(this.selectedGender === value) {
      this.selectedGender = null;
      this.targetValue = null;      
    }
    else {
      this.selectedGender = value;
      this.targetValue = value;
    }  
  }
  specificAge(value){
    if(this.specific_age === value) {
      this.specific_age = value;      
    }
    else {
      this.specific_age = value;
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
  selectLocation(){   
    if(this.locationStatus == 'current'){
      this.locationStatus = 'specific';      
    }
    else {
      this.locationStatus = 'current';
    }
  }
  chooseSomethingMore() {
    this.isSomethingMore = !this.isSomethingMore;
  }
  // postSomethignMore(val) {
  //   this.postCardDescription = val.trim(" ");
  // }
  postSomethignMore(val) {
    this.isCreationMode = true;
    if(this.postCardDescription.length > 0){      
      let n = this.postCardDescription.search("http");
      let a = this.postCardDescription.length;
      let res = this.postCardDescription.substr(n, a);
      let res1 = res.split(" ");
      let re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
       this.isValid  =re.test(res1[0]);
                
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
     
    //  if(components){
    //   this.specific_address['components'] = components;
    //   console.log(this.specific_address);
    //  }  
    //alert(this.specific_address);
    console.log(that.specific_address);
    that.places = null;
  }
  backwardClick(value){
    this.content.scrollToTop();
    if(value == 'cardThree'){      
      this.addhashtag = true;
      this.selectedChoice = false;         
    }
    if(value == 'cardOne'){
      this.placeholders = ["What say you?"];      
      this.creatingCard = false;      
      //this.initialiseVariables();
    }
    else if(value == 'cardTwo'){
      this.creatingCard = true;
      //this.askEveryone = false;     
      this.addhashtag = false;
      this.cardStatus_2 = true;   
    }
    else if(value == 'addhashTag') {
      //this.discplaceholders = ["State of indian economy", "Does God exist?", "Future of work."];
      //this.askEveryone = false;
      this.addhashtag = true;
    }
  }
  addHashTag() {
    this.content.scrollToTop();
    this.addhashtag = true;
    this.creatingCard = false;
    //this.registration = false;
  }

  previous() {
    if(this.cardStatus_2) {
      this.cardStatus_1 = true;
      this.cardStatus_2 = false;
    }    
  }

  chooseTarget(value) {
    this.targetMethod = value;
    this.cardStatus_4 = true;
    this.cardStatus_3 = false;
  }

  publish() {
    if(this.cardStatus_2) {
      this.cardStatus_2 = false;      
      this.addHashTag();
    }
  }
  
  showCrowdReach(){
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Loading'      
    });
    loader.present().then(() => {
      let count;    
      let body = {
        "target_method": this.interestchoice,
        "zone_id":  this.zone_id    
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
      if(this.interestchoice == 'category'){          
        body["target_values"] = this.interestId
        let tempTags = [];
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
      else if(this.interestchoice == 'everyone') {
        let tempTags = [];
        if(this.selectedHashTags.length > 0) {        
          for(var i=0;i<this.selectedHashTags.length;i++) {
            tempTags.push(this.selectedHashTags[i]);
          }
          body['hashtags'] = tempTags;
        }
        body['target_method'] = "everyone";
        body["target_values"] = "";
      }      
      else if(this.interestchoice == 'age_range') {
        if(this.specific_age == 'myAge'){
          let age;
          if(this.userProfile.age_range){
            age = this.userProfile.age_range.split("-");
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
      else if(this.interestchoice == 'gender') {
        body["target_values"] = this.targetValue;
      }
      else if(this.interestchoice == 'location') {
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
                                                                  "targetMethod":this.interestchoice,
                                                                  "value":this.targetValue,
                                                                  "age":this.specific_age,
                                                                  "location":this.locationStatus,
                                                                  "category":this.categoryName,
                                                                  "specificlocation":this.specificLoc,
                                                                  "nearme":this.nearMe,
                                                                  "myage":this.userProfile.age_range,
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
    if(this.interestchoice != 'everyone'){
      this.selectedChoice = false;
    }
    //this.askEveryone = true;
    this.addhashtag = true;    
  }
  
  /* -------- publishing of card --------------- */

  publishCard(){
    //this.firebase.logEvent("card_create", {content_type: "card", user_id: this.userProfile.id, card_type: this.cardType});
    let title_temp, des_temp;
    this.cardTitle = this.cardTitle.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').trim(" ");
    this.postCardDescription = this.postCardDescription.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').trim(" ");    
    title_temp = btoa(unescape(encodeURIComponent(this.cardTitle)));
    des_temp = btoa(unescape(encodeURIComponent(this.postCardDescription)));
    let body = {
      "title" : title_temp,
      "target_method" : this.interestchoice,
      "hashtags" : this.selectedHashTags,
      "zone_id":this.zone_id,
      "attachments":this.attachedImages,
      "description" : des_temp
    };   
    if(this.selectedHashTags.length > 0 && !this.interestchoice) {
      body['target_method'] = "everyone";
    } 
    // if (this.post_attach) {
    //   body['attachments'] = [this.post_attach];
    // }
    // else if(!this.post_attach){
    //   body['attachments'] = [];
    // }
    if(this.interestchoice == 'category'){          
      body["target_values"] = this.interestId
    }
    else if(this.interestchoice == 'everyone') {
      body["target_values"] = "";
    }
    else if(this.interestchoice == 'age_range') {
      if(this.specific_age == 'myAge'){
        let age;
        if(this.userProfile.age_range){
          age = this.userProfile.age_range.split("-");
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
    else if(this.interestchoice == 'gender') {
      body["target_values"] = this.targetValue;
    }
    else if(this.interestchoice == 'location') {
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
          //this.askEveryone = false;         
          this.selectedChoice = false;          
          this.afterPublishing();
        },
        err => {
          loader.dismiss();
          console.log("Error :" + JSON.stringify(err));
          let error = JSON.parse(err._body);        
              let alert = this.alertCtrl.create({        
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
    else if(this.cardType == "poll") {
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
          //this.askEveryone = false;         
          this.selectedChoice = false;          
          this.afterPublishing();          
        },
        err => {
          loader.dismiss();
          console.log("Error :" + JSON.stringify(err));
          let error = JSON.parse(err._body);        
              let alert = this.alertCtrl.create({        
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
    else if(this.cardType == "discuss") {       
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Posting...'
        // spinner: 'hide',
        // content: this.safeSvg,
      });
      loader.present().then(() => {                   
        this.http.post(MyApp.API_ENDPOINT+'/story/post/create',body, this.httpOptions).map(res => res.json()).subscribe(data => {          
          loader.dismiss();
          //this.askEveryone = false;         
          this.selectedChoice = false;          
          this.afterPublishing();
        },
        err => {
          loader.dismiss();
          let error = JSON.parse(err._body);        
              let alert = this.alertCtrl.create({        
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
    else if(this.cardType == 'review'){      
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Posting...'        
      });
      loader.present().then(() => {
        if(this.feedbackStatus == true){
          //body["attachments"] = [];
          body['type'] = 'give_feedback'
          // if(this.post_attach) {
          //   body["attachments"].push(this.post_attach);
          // }
          // if(this.give_attach) {
          //   body["attachments"].push(this.give_attach);
          // } 
          if(this.give_feedback_description && !this.rangeValue){
            this.give_feedback_description = this.give_feedback_description.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
            body["percentage"] =  0,          
            body["review_description"] = this.give_feedback_description
          }
          else if(!this.give_feedback_description && this.rangeValue){
            body["percentage"] = this.rangeValue,          
            body["review_description"] = ""
          }
          else {
            this.give_feedback_description = this.give_feedback_description.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
            body["percentage"] = this.rangeValue,          
            body["review_description"] = this.give_feedback_description
          }
        }
        else {
          body['type'] = "get_feedback";          
        }          
        this.http.post(MyApp.API_ENDPOINT+'/story/review/create',body, this.httpOptions).map(res => res.json()).subscribe(data => {                
          loader.dismiss();
          //this.askEveryone = false;         
          this.selectedChoice = false;         
          this.afterPublishing();
        },
        err => {
          loader.dismiss();
          let error = JSON.parse(err._body);        
              let alert = this.alertCtrl.create({        
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
  }
  /* ---------- creation of card ends ---------- */

  /* ---------- Zone Timeline -------------- */
  afterPublishing() {
    this.close();
    this.sg['pusher'].disconnect();    
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Refreshing feed'      
    });
    loader.present().then(() => {                
      this.http.get(MyApp.API_ENDPOINT+'/zone/'+this.zone_id+'/timeline?page=1&page_size=10',this.httpOptions).map(res => res.json()).subscribe(data => {
        this.zoneStories = [];        
        this.zoneStoriesLength = data.data.length;
        let stories = data.data;
        let zoneStorieslength = this.zoneStories.length;
        loader.dismiss();
        Pusher.logToConsole = false;
        this.sg['pusher'] = new Pusher('c02d2b34f9ba5121fbbb',{
          cluster:'mt1',
          encrypted: true
        });
        let channels = [];
        for(var i=0;i<stories.length;i++) {
          this.discoverPageNumber.push(1);
          this.zoneStories.push(stories[i]);
          if(stories[i].feed.type == 'Story.Review'){
            this.barChartOptions = this.barChartOptions;
            this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            this.barChartType = 'bar';
            this.barChartData[(zoneStorieslength+i)] = new Array(1);
            this.barChartData[(zoneStorieslength+i)][0] = {data:stories[i].feed.graph_data};   
            this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];    
          }
          let that = this;
          channels.push(that.sg['pusher'].subscribe(stories[i].feed.websocket_channel));              
          channels[i].bind("story_update", function(data1) {
            console.log("pusher message received from server :"+JSON.stringify(data1));
            let updated_storyid = data1.data.story_id ;            
            that.http.get(MyApp.API_ENDPOINT+'/feed/story/'+updated_storyid,that.httpOptions).map(res => res.json()).subscribe(data2 => {
              for(var i=0;i<stories.length;i++) {
                if(stories[i].feed.id == updated_storyid) {
                  that.zoneStories[i] = data2.data;
                }
              }              
            });
          });
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

  close() {
    this.initialiseVariables();
  }
  closeFilterCard() {
    this.initialiseVariables();
    this.initialiseItems();
  }

  /* ------------------------------- filter by hashtag starts -------------------------------------------------- */
  filterByHashtag(hashtag, status) {
    this.myHashtagStatus = status;
    this.filterbyHash = true;
    this.filterValue = null;    
    this.close();
    this.zoneStories = [];
    this.filterCard = false;
    this.filteredHashTag = hashtag;    
    this.addhashtag = false;
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Getting Cards'      
    });
    this.content.scrollToTop();
    loader.present().then(() => {    
      this.http.get(MyApp.API_ENDPOINT+'/util/hashtags/feed?hashtag='+hashtag, this.httpOptions).map(resp => resp.json()).subscribe(data => {
        loader.dismiss();
        this.hashtagStories =  data.data.stories;
        this.sg['filterbyhashtag'] = null;
        this.sg['hashtag'] =  null;
        this.sg['isMyHashtagStatus'] = null;           
        for(var i=0;i<data.data.stories.length;i++) {
          this.zoneStories.push(data.data.stories[i]);
          if(data.data.stories[i].feed.type == 'Story.Review'){
            this.barChartOptions = this.barChartOptions;         
            this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            this.barChartType = 'bar';
            this.barChartData[i] = [{data:data.data.stories[i].feed.graph_data}];
            this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];
          }
        }     
      }, err => {
        loader.dismiss();
      });
    });
  }

  /* ---- Review response create --- */

  done(feed,idx, des_temp) {    
    let loader = this.loadingCtrl.create({
      content: 'Saving your rating',
    });
    loader.present().then(() => {      
     if(this.percentage[feed.id] == (undefined || null) && (this.checked[feed.id] != true)) {
        //   let alert = this.alertCtrl.create({
        //       title: "Alert",
        //       message: "Please provide a rating",
        //       buttons: ["OK"]
        //   });
        //  alert.present();
        let toast = this.toastCtrl.create({
          message: "Please provide a rating",
          duration: 1000,
          position : "middle"
        });
        toast.present();
      }

    else if((this.percentage[feed.id] > 0 || this.percentage[feed.id] == 0) && !this.textInput[feed.id]){
        this.data = {
           // "attachment": "http://url.com",
            "description": "",
            "percentage": this.percentage[feed.id],
            "not_sure": this.checked[feed.id],
            "review_id": feed.id 
        }
     }
     else if((this.textInput[feed.id]) && (this.percentage[feed.id] == undefined || 0) && (this.checked[feed.id] != true)){ 
          this.data = {
           // "attachment": "http://url.com",
            "description": des_temp,
            "percentage": "0",
            "not_sure": this.checked[feed.id],
            "review_id": feed.id
          }                
     }
      else if(this.checked[feed.id] == true){       
        this.data = {
           // "attachment": "http://url.com",
            "description": des_temp,
            "not_sure": this.checked[feed.id],
            "review_id": feed.id 
      }
     }
     else {
       this.data = {
           // "attachment": "http://url.com",
            "description": des_temp,
            "not_sure": this.checked[feed.id],
            "percentage": this.percentage[feed.id],
            "review_id": feed.id 
      } 
     }    
     this.firebase.logEvent("review_response", {content_type: "card", user_id: this.userId, item_id: feed.id, item_name:feed.title});
     this.textInput[feed.id] = "" ; 
     this.myHeight = "40px";
       setTimeout(() => { 
         this.myHeight = " ";
       },2000);
      this.http.post(MyApp.API_ENDPOINT+'/story/review/response/create',this.data, this.httpOptions)
           .map(res => res.json())
          .subscribe(data => {
          loader.dismiss();
          this.textInput[feed.id] = "";          
          this.zoneStories[idx] = data.data;

        //   let alert = this.alertCtrl.create({
        //       title: "Success",
        //       message: "Review response successfully saved",
        //       buttons: ["OK"]
        //   });
        //  alert.present();
        let toast = this.toastCtrl.create({
          message: "Review response successfully saved",
          duration: 1000,
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
            //  let alert = this.alertCtrl.create({
            //   title: "Failure",
            //   message: "Sorry, something went wrong!",
            //   buttons: ["OK"]
            // });
            // alert.present();      
            let toast = this.toastCtrl.create({
              message: "Sorry, something went wrong!",
              duration: 1000,
              position : "middle"
            });
            toast.present();      
          }); 
      });      
}

  updateCheckbox(id, feed, idx) {
    if(this.checked[id] == true && this.textInputReview[id]){
      this.rangeDisabled[id] = true;
      this.isCancelled[id] = false;
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
      this.rangeDisabled[id] = true;
      this.isCancelled[id] = false;
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
        if(type == 'unfollow') {
          this.myHashtagStatus = true;
        }
        else {
          this.myHashtagStatus = false;
        } 
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
    if(this.userProfile) {
      for(var i=0;i<this.userProfile.hashtags.length;i++) {
        this.userProfile.hashtags[i] = this.userProfile.hashtags[i].trim(" ");        
        if(this.userProfile.hashtags[i].toLowerCase() == value.toLowerCase()) {
          return true;
        }        
      }
    }
  }
  myHashtag1(value) {
    value = value.trim(" ");   
    if(this.userProfile) {
      for(var i=0;i<this.userProfile.hashtags.length;i++) {
        this.userProfile.hashtags[i] = this.userProfile.hashtags[i].trim(" ");       
        if(this.userProfile.hashtags[i].toLowerCase() == value.toLowerCase()) {
          return true;
        }        
      }
    }
  }
  myHashtag2(value) {
    value = value.trim(" ");    
    if(this.userProfile) {
      for(var i=0;i<this.userProfile.hashtags.length;i++) {
        this.userProfile.hashtags[i] = this.userProfile.hashtags[i].trim(" ");        
        if(this.userProfile.hashtags[i].toLowerCase() == value.toLowerCase()) {
          return true;
        }        
      }
    }
  }
  myHashtag3(value) {
    value = value.trim(" ");    
    if(this.userProfile) {
      for(var i=0;i<this.userProfile.hashtags.length;i++) {
        this.userProfile.hashtags[i] = this.userProfile.hashtags[i].trim(" ");        
        if(this.userProfile.hashtags[i].toLowerCase() == value.toLowerCase()) {
          return true;
        }        
      }
    }
  }
  myHashtag4(value) {
    value = value.trim(" ");    
    if(this.userProfile) {
      for(var i=0;i<this.userProfile.hashtags.length;i++) {
        this.userProfile.hashtags[i] = this.userProfile.hashtags[i].trim(" ");        
        if(this.userProfile.hashtags[i].toLowerCase() == value.toLowerCase()) {
          return true;
        }        
      }
    }
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
   
   recommendChange(id, value) {     
    //clearInterval(this.sg['intervalObj']);
     this.validRecommendation[id] = this.recommendText[id].trim(" ");         
   }
 
   postCommentChange(id, value) {
     this.textInput[id] = this.textInput[id].replace(/^\s+/g, '');        
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

    getClass(optionId,responses) {
      //alert(id);
      for(var i=0;i<responses.length;i++){
        if(optionId == responses[i]){
            return true;
        }
      }
      return false;
    }
    changeZone() {
 
      let element   = document.getElementById('zoneInputBox');
      let textarea  = element.getElementsByTagName('textarea')[0];
      textarea.style.minHeight  = '0';
      textarea.style.height     = '0';
       let scroll_height = textarea.scrollHeight;
       if(scroll_height > 116) {
        scroll_height = 110;
        this.activatePadding = false;
      }
      else if(scroll_height < 116){
       this.activatePadding = true;
      }  
      element.style.height      = scroll_height  + 16 + "px";
      textarea.style.minHeight  = scroll_height  + 16 +"px";
      textarea.style.height     = scroll_height + 16 + "px";
      var width = (element.clientWidth + 1) + "px";
    }

    change(idx) {
      var element   = document.getElementById('messageInputBox'+idx);
      var textarea  = element.getElementsByTagName('textarea')[0];
  
      textarea.style.minHeight  = '0';
      textarea.style.height     = '0';
      // limit size to 96 pixels (6 lines of text)
      var scroll_height = textarea.scrollHeight;
      if(scroll_height > 116){
        scroll_height = 110;
        this.activatePadding = false;
      } else if(scroll_height < 116){
           this.activatePadding = true;
          } 
      // apply new style
      element.style.height      = scroll_height + 16 + "px";
      textarea.style.minHeight  = scroll_height + 16 + "px";
      textarea.style.height     = scroll_height + 16 + "px";
    }

     submitComment(feed,idx, cardType) {
      let des_temp;
      if(this.textInput[feed.id]) {
        this.textInput[feed.id] = this.textInput[feed.id].replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
        des_temp = btoa(unescape(encodeURIComponent(this.textInput[feed.id])));
      }      
      if(cardType == 'Story.Poll' && feed.poll_type == 'recommend') {
        this.addRecommendation(idx, des_temp , feed);
      }       
      else if(cardType == 'Story.Post'){
        this.firebase.logEvent("discuss_response", {content_type: "card", item_id: feed.id, item_name: feed.title, user_id:this.userId});
        let loader = this.loadingCtrl.create({
          spinner: 'dots',
          content: 'Loading'        
        });
        loader.present().then(() => {
          if(this.attachPic == null){
            this.postData = {
              "description": des_temp,
              "post_id": feed.id
            }
          }
          else {
            this.postData = {                  
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
          this.http.post(MyApp.API_ENDPOINT+'/story/post/response/create',this.postData,this.httpOptions).map(res => res.json()).subscribe(data => {
            loader.dismiss();           
            this.textInput[feed.id] = "";
            this.zoneStories[idx] = data.data ;          
            this.attachPic = null;                      
          },
          err=> {
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
        this.firebase.logEvent("discuss_response", {content_type: "card", item_id: feed.id, item_name: feed.title, user_id:this.userId});
        let loader = this.loadingCtrl.create({
          spinner: 'dots',
          content: 'Loading'        
        });
        loader.present().then(() => {
          if(this.attachPic == null){
            this.postData = {
              "description": des_temp             
            }
          }
          else {
            this.postData = {                  
              "attachment": this.attachPic,
              "description": des_temp              
            }
          }
          this.textInput[feed.id] = "" ; 
          this.myHeight = "40px";
            setTimeout(() => { 
              this.myHeight = " ";
            },2000);
          this.http.post(MyApp.API_ENDPOINT+'/story/'+feed.id+'/comment',this.postData,this.httpOptions).map(res => res.json()).subscribe(data => {
            loader.dismiss();           
            this.textInput[feed.id] = "";
            this.zoneStories[idx] = data.data ;          
            this.attachPic = null;                      
          },
          err=> {
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

     addRecommendation(idx,recoption,feed) {
      /* ----- Add Recommendation ----- */
      let temp1 = feed.user.id.search("_");       
        if(temp1 > 0) {
          feed.user.id = feed.user.id.split("_")[0];
        }
      let  option = this.textInput[feed.id] ;      
      if(feed.user.id == this.userProfile.id){
        let alert = this.alertCtrl.create({        
          message: "sorry, you cannot recommend on your own card.",
            buttons: [{
              text: 'OK',
              handler: () => {
                this.selected_item = '';
                this.textInput[feed.id] = "";
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
              this.firebase.logEvent("recommendation_add", {content_type: "card", user_id: this.userId, item_id: feed.id, item_name:feed.title});
              this.zoneStories[idx].user.is_answered = true;
              this.zoneStories[idx].feed.options.push({"name" : this.textInput[feed.id],"response_count" : 1});                      
              this.textInput[feed.id] = "";                      
              let body = {
                "recommendation" : recoption
              }
              // let loader = this.loadingCtrl.create({
              //   spinner: 'dots',
              //   content: 'Loading'                
              // });
              // loader.present().then(() => {  
                this.textInput[feed.id] = "" ; 
                this.myHeight = "40px";
                  setTimeout(() => { 
                    this.myHeight = " ";
                  },2000);            
              this.http.post(MyApp.API_ENDPOINT+'/story/poll/'+feed.id+'/add/recommendation',body, this.httpOptions).map(res => res.json()).subscribe(data => {
                recoption = "";
                this.zoneStories[idx] = data.data;
                //loader.dismiss();
              },
              err => {
                //loader.dismiss();
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
            //});               
            }
          }, 500);
        }
                 
    }

    isUserProfileIdSame(id, userProfileId) {
      let temp1 = id.search("_");       
      if(temp1 > 0) {
        id = id.split("_")[0];
        if(id == userProfileId) {
          return true;
        }
        else {
          return false
        }
      }
      else {
        if(id == userProfileId) {
          return true;
        }
        else {
          false;
        }
      }        
    }
  
    /* ----- poll response create ----- */
  
  response(id,item,idx,index, count, story) {
    let temp1 = story.feed.user.id.search("_");       
      if(temp1 > 0) {
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
      else if(story.feed.user.id == this.userProfile.id){
        if(story.feed.poll_type == 'poll') {
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
      else  {
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
    this.firebase.logEvent("poll_response", {content_type: "card", user_id: this.userId, item_id: story.feed.id, item_name:story.feed.title});
    this.zoneStories[idx].user.is_answered = true;
    this.zoneStories[idx].feed.options[index].response_count = count+1;
    this.zoneStories[idx].user.user_responses.push(id);
    let body = {
      "poll_option_id" : id
    }                                
    this.http.post(MyApp.API_ENDPOINT+'/story/poll/response/create',body, this.httpOptions).map(res => res.json()).subscribe(data => {
      if(data.data.poll_response) {
        this.http.get(MyApp.API_ENDPOINT+'/feed/story/'+story.feed.id,this.httpOptions).map(res => res.json()).subscribe(data => {
          this.zoneStories[idx] = data.data;                
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
      this.http.get(MyApp.API_ENDPOINT+'/story/discover/'+feed.id+'/all?page='+this.discoverPageNumber[idx]+'&page_size=10',this.httpOptions).map(res => res.json()).subscribe(data => {
        loader.dismiss();
        if(data.data.length > 0){
          for(var i=0; i<data.data.length; i++){
            this.zoneStories[idx].feed.results.push(data.data[i]);                  
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
            duration: 1000,
            position : "middle"
          });
          toast.present();   
        }      
      },err => {
        loader.dismiss();
      });
    });  
   }   
   myText(id,text) {    
    if(text[id]){      
      this.description[id] = text[id].trim();
      if(this.description[id].length > 0){
        this.doneBtn[id] = true;
      }

      else if((this.description[id].length > 0) || (this.percentage[id] == 0) || 
      (this.percentage[id] > 0)){
      this.doneBtn[id] = true;
    }
    else {
      this.doneBtn[id] = false;
    }

    }

    else if(!text[id]){
      if(this.percentage[id] == 0 || this.percentage[id] > 0){
        this.doneBtn[id] = true;
      }

      else if(this.checked[id] == true){
        this.doneBtn[id] = true;
      }

      else {
        this.doneBtn[id] = false;
      }
    } 

   }

   morePopup(idx, feedId, childIdx, storyId, userId) {
    //this.stackedDiscoveries[idx] = false;    
    this.sg['popover'] = this.popoverCtrl.create(PopupDeletePage, {
      enableBackdropDismiss : false,
      cssClass: 'alertCustomCss',
      feedId , idx, token : this.tkn_sb, childIdx, storyId, userId
    });
    this.sg['popover'].present();    
  }

  /* ---------------------- like, dislike, undo, comment, share, follow, unfollow starts -------------------------------------------- */
  likeButton(id,parentIdx,count,event,story,childIdx, title){
    if(this.userProfile) {
      this.firebase.logEvent("card_like", {content_type: "card", item_id: id, item_name: title, user_id:this.userId});
    }
    else {
      this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(data => {
        //this.storage.set('userProfile', data.data);
        this.userProfile = data.data;
        //this.notification_count = data.data.new_notification_count;
        this.firebase.logEvent("card_like", {content_type: "card", item_id: id, item_name: title, user_id:this.userId});
      }); 
    }
    if(story === 'discover'){
      this.zoneStories[parentIdx].user.disliked = false;
      this.zoneStories[parentIdx].user.liked = true;
      this.zoneStories[parentIdx].feed.likes = count+1;
    }
    else {
      this.zoneStories[parentIdx].user.disliked = false;
      this.zoneStories[parentIdx].user.liked = true;
      this.zoneStories[parentIdx].feed.likes = count+1;
      if(this.zoneStories[parentIdx].user.dislikes > 0){
        this.zoneStories[parentIdx].user.dislikes = this.zoneStories[parentIdx][0].user.dislikes-1;
      }
      else {
        this.zoneStories[parentIdx].feed.dislikes = 0;
      }
    }
    this.http.post(MyApp.API_ENDPOINT+'/story/'+id+'/like',{},this.httpOptions).map(res => res.json()).subscribe(data => {
      this.zoneStories[parentIdx] = data.data;
      /*this.zoneStories[parentIdx].feed.comments = data.data.feed.comments;
      this.zoneStories[parentIdx].feed.likes = data.data.feed.likes;
      this.zoneStories[parentIdx].feed.dislikes = data.data.feed.dislikes;
      this.zoneStories[parentIdx].feed.follows = data.data.feed.follows;
      this.zoneStories[parentIdx].feed.shares = data.data.feed.shares;
      this.zoneStories[parentIdx].feed.crowd_count = data.data.feed.crowd_count;
      this.zoneStories[parentIdx].user = data.data.user;*/
    });                     
  }
  unlikeButton(id,parentIdx,count,event,story,childIdx, discoveries) {
    if(story === 'discover'){
      this.zoneStories[parentIdx].user.liked = false;        
      this.zoneStories[parentIdx].user.disliked = true;
      if(count > 0){
        this.zoneStories[parentIdx].feed.dislikes = count+1; 
      }
      else {
        this.zoneStories[parentIdx].feed.dislikes = 1;
      }
    }
    else {
      this.zoneStories[parentIdx].user.disliked = true;
      this.zoneStories[parentIdx].user.liked = false;
      this.zoneStories[parentIdx].feed.dislikes = count+1;
      if(this.zoneStories[parentIdx].feed.likes > 0){
        this.zoneStories[parentIdx].feed.likes = this.zoneStories[parentIdx].feed.likes-1;
      }
      else {
        this.zoneStories[parentIdx].feed.likes = 0;
      }      
    }
    this.http.post(MyApp.API_ENDPOINT+'/story/'+id+'/dislike',{},this.httpOptions).map(res => res.json()).subscribe(data => {
      this.zoneStories[parentIdx] = data.data;      
    });    
  }
  follow(id,parentIdx,count,event,story,childIdx, title) {
    this.firebase.logEvent("card_follow", {content_type: "card", item_id: id, item_name: title});    
    this.zoneStories[parentIdx].user.bookmarked = true;
    this.zoneStories[parentIdx].feed.follows = count+1;    
    this.http.post(MyApp.API_ENDPOINT+'/story/'+id+'/follow',{},this.httpOptions).map(res => res.json()).subscribe(data => {      
      this.zoneStories[parentIdx] = data.data;
    });
  }
  unfollow(id,parentIdx,count,event,story,childIdx, discoveries){   
    this.zoneStories[parentIdx].user.bookmarked = false;
    this.zoneStories[parentIdx].feed.follows = count-1;    
    this.http.post(MyApp.API_ENDPOINT+'/story/'+id+'/unfollow',{},this.httpOptions).map(res => res.json()).subscribe(data => {                
      this.zoneStories[parentIdx] = data.data;
    });
  }
  undoAction(id,parentIdx,count,event,story,childIdx, action){
    if(action === 'like'){
      this.zoneStories[parentIdx].user.liked = false;
      if(count > 0){
        this.zoneStories[parentIdx].feed.likes = count-1;
      }
      else {
        this.zoneStories[parentIdx].feed.likes = 0;
      }      
    }
    else if(action === 'discoverDislike'){
      this.zoneStories[parentIdx].user.liked = false;
      if(count > 0){
        this.zoneStories[parentIdx].feed.likes = count-1;
      }
      else {
        this.zoneStories[parentIdx].feed.likes = 0;
      }      
    } 
    else {
      this.zoneStories[parentIdx].user.disliked = false;
      if(count > 0){
        this.zoneStories[parentIdx].feed.dislikes = count-1;
      }
      else {
        this.zoneStories[parentIdx].feed.dislikes = 0;
      }      
    }
    this.http.post(MyApp.API_ENDPOINT+'/story/'+id+'/like/undo',{},this.httpOptions).map(res => res.json()).subscribe(data => {      
      this.zoneStories[parentIdx] = data.data;
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
    if(this.userProfile) {
      this.firebase.logEvent("card_comment", {content_type: "card", item_id: id, item_name: title, user_id:this.userId});
    }
    else {
      this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(data => {
        //this.storage.set('userProfile', data.data);
        this.userProfile = data.data;
       // this.notification_count = data.data.new_notification_count;
        this.firebase.logEvent("card_comment", {content_type: "card", item_id: id, item_name: title, user_id:this.userId});
      }); 
    }          
    // this.Id = id ;
    // this.parentIdx = parentIdx ;
    this.navCtrl.push(CommentPage, {id, comments, title, userObj, tkn:this.tkn_sb, feed, zone_members : this.zoneInfo.members});    
  }

  doInfinite(infinitescroll) {
    this.pageNumber = this.pageNumber+1;
    this.http.get(MyApp.API_ENDPOINT+'/zone/'+this.zone_id+'/timeline?page='+this.pageNumber+'&page_size=10',this.httpOptions).map(res => res.json()).subscribe(data => {
      let zoneStorieslength = this.zoneStories.length;
      let stories = data.data;
      for(var i=0;i<stories.length;i++) {        
        this.discoverPageNumber.push(1);
        if(stories[i].feed.type == 'Story.Review'){
          this.barChartOptions = this.barChartOptions;
          this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
          this.barChartType = 'bar';
          this.barChartData[(zoneStorieslength+i)] = new Array(1);
          this.barChartData[(zoneStorieslength+i)][0] = {data:stories[i].feed.graph_data};            
          this.barChartColors = [{backgroundColor: ['#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F3BFB7','#F6CF7B','#F6CF7B','#C6ED95','#C6ED95']}];    
        }
        this.zoneStories.push(data.data[i]);
      }      
      infinitescroll.complete();
    }, err => {
      infinitescroll.complete();
    });    
  }
  count(msg, value){
    if(value == 'feedback') {
      if(this.maxlength>=msg.length){
        this.characterleft=(this.revMaxlength)-(msg.length);
      }
    }
    else if(value == 'poll') {
      if(this.maxlength>=msg.length){
        this.pollCharacterleft=(this.maxlength)-(msg.length);
      }
    }
    else if(value == 'post') {
      if(this.postMaxlength>=msg.length){
        this.postCharacterleft=(this.postMaxlength)-(msg.length);
      }
    }
    else if(value == 'recommend') {
      if(this.maxlength>=msg.length){
        this.recCharacterleft=(this.maxlength)-(msg.length);
      }
    }    
  }
  tapToSeeMore(index, value) {
    this.zoneStories[index].feed['isSeeMore'] = true;    
  }
  tapToSeeLess(index, value) {
    this.zoneStories[index].feed['isSeeMore'] = false;    
  }
  postDesCount(msg, value){
    if(value == 'post') {
      if(this.descriptionMaxLength>=msg.length){
        this.postCardDescriptionLength=(this.descriptionMaxLength)-(msg.length);
      }
    }
  }
  cancelImage(value, index){    
    if(value == "image"){      
      this.attachedImages.splice(index,1);
    }    
    // else if(value == "giveFeedback"){
    //   this.imagePreview1 = null;
    //   this.give_attach = null;
    // }      
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
        this.attachmentLoader = true;        
        this.http.post(MyApp.API_ENDPOINT+'/util/upload/images',body).map(res => res.json()).subscribe(data => {           
          for(var i=0;i<data.data.uploaded_urls.length;i++) {
            this.attachedImages.push(data.data.uploaded_urls[i]);
          }
          this.attachmentLoader = false;          
        },err => {           
          this.attachmentLoader = false;
        });
      }    
    });
  }
  viewImage(index, photos) {
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: photos,
      initialSlide: index
    }, {cssClass: 'my-modal-class'});
    modal.present();
  }
  changeInput() {
    let element   = document.getElementById('messageInput');
    let textarea  = element.getElementsByTagName('textarea')[0];
     // set default style for textarea :

     textarea.style.minHeight  = '0';
     textarea.style.height     = '0';
 
    // textarea.style.minHeight  = '24px';
    // textarea.style.height     = '24px';
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
   visitedUsers(feed){
    this.storySimilarId = feed.id;
    this.story_target_method = feed.target_method ;    
    if(this.story_target_method == 'category'){      
      for(var i=0;i<this.interests.length;i++){
        if(this.interests[i].category.id == feed.target_values){
          this.target_values = this.interests[i].category.name;
          this.filterValue = this.interests[i].category.name;
          break;
        }
      }
    }
    else if(feed.target_method == 'age_range'){      
      this.target_values = feed.target_values.min+' - '+feed.target_values.max+' years';
      this.filterValue = this.target_values;
    }
    else if(feed.target_method == 'location'){      
      this.target_values = feed.target_values.city+', '+feed.target_values.state+', '+feed.target_values.country;
      this.filterValue = this.target_values;      
    }
    else if(feed.target_method == 'gender'){      
      if(feed.target_values == 'male'){
        this.target_values = 'Men';
        this.filterValue = 'MEN';        
      }
      else if(feed.target_values == 'female'){
        this.target_values = 'Women'
        this.filterValue = 'WOMEN';
      }
      else {
        this.target_values = 'Other'
        this.filterValue = 'OTHER';
      }         
    }
    else {
      this.filterValue = 'EVERYONE';
      this.target_values = feed.target_values;
    }
    this.crowd_count = feed.crowd_count;   
    let popover = this.popoverCtrl.create(PopupCrowdInfoPage, {"count":this.crowd_count, "values":this.target_values, "token":this.tkn_sb, "storyId":this.storySimilarId});
    popover.present({
      
    });
    popover.onDidDismiss(data => {
      if(data == "active") {
        //this.showSimilarCards(this.storySimilarId);
      }
      else {
        
      }      
    })    
  }

  showMoreHashtags(tags, storyIdx) {
    this.isShowAllHashtags[storyIdx] = 'true';
    //this.allTags = tags;    
  }

  hideMoreHashtags(tags, storyIdx) {
    this.isShowAllHashtags[storyIdx] = 'false';       
  }

  myProfileId() {
    if(this.userProfile && this.userProfile.id) {
      let loginUser_Id = this.userProfile.id;   
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
    let temp1 = cardOwnerId.search("_");
    if(temp1 > 0) {
      cardOwner_Id = cardOwnerId.split("_")[0];
      return cardOwner_Id;
    }
    else {
      return cardOwnerId;
    }
  }

  followLeader(leaderId, idx) {
    this.mentors[idx].is_following = true;
    /*let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Loading'      
    });
    loader.present().then(() => {*/
      this.http.post(MyApp.API_ENDPOINT+'/zone/'+this.zone_id+'/'+leaderId+'/follow', {}, this.httpOptions).map(res => res.json()).subscribe(data => {
        //loader.dismiss();           
        this.mentors[idx].is_following = true;
        let toast = this.toastCtrl.create({
          message: data.data.message,
          duration: 3000,
          position : "middle"
        });
        toast.present();
      },err => {           
        //loader.dismiss();
        this.mentors[idx].is_following = false;
        let error = JSON.parse(err._body); 
        let toast = this.toastCtrl.create({
          message: error.error.message,
          duration: 3000,
          position : "middle"
        });
        toast.present();
      });
    //});
  }
  unfollowLeader(leaderId, idx) {
    this.mentors[idx].is_following = false;
    /*let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Loading'      
    });
    loader.present().then(() => {*/
      this.http.post(MyApp.API_ENDPOINT+'/zone/'+this.zone_id+'/'+leaderId+'/unfollow', {}, this.httpOptions).map(res => res.json()).subscribe(data => {
        //loader.dismiss();           
        this.mentors[idx].is_following = false;
        let toast = this.toastCtrl.create({
          message: data.data.message,
          duration: 3000,
          position : "top",
          cssClass: "customToast"
        });
        toast.present(); 
      },err => {           
        //loader.dismiss();
        this.mentors[idx].is_following = true;
        let error = JSON.parse(err._body); 
        let toast = this.toastCtrl.create({
          message: error.error.message,
          duration: 3000,
          position : "top",
          cssClass: "customToast"
        });
        toast.present();
      });
    //});  
  }
  
  isAdmin() {
    if(this.zoneInfo && this.userProfile) {
      for(var i=0; i<this.zoneInfo.admins.length; i++) {
        if(this.zoneInfo.admins[i].role == 'FOUNDER') {
          if(this.userProfile.id == this.zoneInfo.admins[i].user.id) {
            return true;
          }
        }      
      }
      return false;
    }    
  }

  isLeader() {
    if(this.mentors && this.userProfile) {
      for(var i=0; i<this.mentors.length; i++) {
        if(this.mentors[i].mentor.role == 'LEADER') {
          if(this.userProfile.id == this.mentors[i].mentor.user.id) {
            return true;
          }
        }      
      }
      return false;
    }    
  }
  isLeader1() {
    if(this.mentors && this.userProfile) {
      for(var i=0; i<this.mentors.length; i++) {
        if(this.mentors[i].mentor.role == 'LEADER') {
          if(this.userProfile.id == this.mentors[i].mentor.user.id) {
            return false;
          }
        }      
      }
      return true;
    }    
  }


  getIndividualStatus(mentor) {
    if(mentor && this.userProfile) {     
      if(mentor.mentor.role == 'LEADER') {
        if(this.userProfile.id == mentor.mentor.user.id) {
          return true;
        }
      }
      return false;
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
  
  getVotingText(story) {
    let votes = 0;
    if(story.feed.options.length > 0 && story.feed.poll_type == 'poll') {
      for(var i=0;i<story.feed.length;i++) {
        votes = story.feed[i].response_count+votes;
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

  seeMore(){
    this.descriptionstatus = false;
  }
  seeLess(){
    this.descriptionstatus = true;
  }
  spittingMethod(name){
    if(name){
      let userName = name.split(" ");   
      return userName[0].charAt(0).toUpperCase() + userName[0].slice(1);
    } else return 'User'    
  }
  changeDescription() {
    let element   = document.getElementById('zoneDescription');
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
  viewLeaderList(leaderId,idx){
    this.leader_id = leaderId;
    this.navCtrl.push(ViewfollowersListPage ,{'zone_id': this.zone_id, 'leader_id' : this.leader_id})
  }
}
