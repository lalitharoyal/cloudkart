import { Component ,ViewChild, ElementRef} from '@angular/core';
import { NavController,ModalController, NavParams , MenuController, Platform, PopoverController, AlertController, ViewController} from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';
import { Storage } from '@ionic/storage';
import {Http, Headers, RequestOptions} from '@angular/http';
import { MyApp } from '../../app/app.component';
import { LoadingController } from 'ionic-angular';
import { AppMinimize } from '@ionic-native/app-minimize';
import {SimpleGlobal} from 'ng2-simple-global';
import { TabsPage } from '../tabs/tabs';
import { MessagesPage } from '../messages/messages';

declare var google;
@Component({
  selector: 'page-profile_user',
  templateUrl: 'profile_user.html'
})

export class ProfileUserPage{
  @ViewChild('fileInput') el:ElementRef;
	items: Array<{picture: string}>;
  base64Image:any;
  profileHide:boolean;  
  editStatus:boolean = false;
  private imageSrc: string;
  tkn_sb : any;
  profile : any;
  selected_image:any;
  interests : any;
  selectedInterests : any[] = [];
  selectedIndex : any;
  avatar_status:any;
  httpOptions = {};
  images = []; percentage = []; checked = []; 
  avatarGrid:any;
  streetName:any;
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
  tags:any;
  bookmarkedStories = []; barChartOptions:any;barChartLabels :string[];barChartType:string;barChartLegend:boolean = false; 
  barChartData = [];barChartColors:Array<any>;errMsg:any;  diffDays: any;  diffMonths: any;  year: any;  diffHours: any;  diffMin: any;
  profile_name: any;
  userProfile: any;
  isBlocked: boolean = false;profile_id_temp: any;
  profile_image: any;
  pageNumber: number = 0;
constructor(public navCtrl: NavController,
              public navParams: NavParams, 
              private menu: MenuController, 
              private storage: Storage, 
              private http: Http, public modalCtrl:ModalController,
              public loadingCtrl: LoadingController,
              public platform: Platform, 
              private appMinimize: AppMinimize,
              public popoverCtrl: PopoverController,
              public sg: SimpleGlobal,
              private alertCtrl:AlertController,
              public viewCtrl : ViewController) {
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
    this.profile_id = this.navParams.get("id");
    let temp = this.profile_id.search("_");
    if(temp > 0) {
      this.profile_id_temp = this.profile_id.split("_")[0];
    }
    else {
      this.profile_id_temp = this.profile_id ;
    }
    this.menu.swipeEnable(false, 'menu1');
    this.items = [
      { picture: 'assets/images/star.svg'},
      { picture: 'assets/images/star.svg'},
      { picture: 'assets/images/star.svg'} 
    ];
    this.storage.get('userProfile').then((val) => {
      this.userProfile = val;
      let temp1 = this.userProfile.id.search("_");
      if(temp1 > 0) {
        this.userProfile.id = this.userProfile.id.split("_")[0];
      }
    });
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
      this.sg['token'] = val;
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','tenaAcceptnt':'application/json', 'token': this.tkn_sb })
      };
      let loader = this.loadingCtrl.create({
        content: "Getting user's profile",
        spinner : 'dots'
      });
      loader.present().then(() => {
        this.http.get(MyApp.API_ENDPOINT+'/user/'+this.profile_id+'/info', this.httpOptions).map(res => res.json()).subscribe(value => {
          loader.dismiss();
          this.profile = value.data.profile;
          this.isBlocked = value.data.context.blocked ;
          this.getBookmarkedCards();                    
        }, err => {
          loader.dismiss();
        });  
      });  
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

  getBookmarkedCards() {
    this.pageNumber = this.pageNumber+1;
    this.http.get(MyApp.API_ENDPOINT+'/user/'+this.profile_id+'/collection?page='+this.pageNumber+'&page_size=5', this.httpOptions).map(res => res.json()).subscribe(data => {
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
    },err => {      
      let alert = this.alertCtrl.create({
        title: "Failure",
        message: "Sorry, something went wrong!",
        buttons: ["OK"]
      });
      alert.present();                   
    });          
  }
  
  doInfinite(infiniteScroll) {    
    setTimeout(() => {
      this.getBookmarkedCards();
      infiniteScroll.complete();
    }, 1000);
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
      return diffHours+'h  ago';       
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
  viewCard(storyId) {
    this.navCtrl.setRoot(TabsPage);
    this.sg['storyId']  =  storyId; 
    this.sg['token']  =  this.tkn_sb; 
    this.sg['filterBy']  =  'Collections';
    this.sg['collection_name'] = this.profile.name+"'s"+' '+'Collection';
    this.navCtrl.push(TabsPage, { selectedTab: 0 });
  }
  blockUser() {
    this.isBlocked = true;
    this.http.get(MyApp.API_ENDPOINT+'/user/'+this.profile_id_temp+'/block', this.httpOptions).map(res => res.json()).subscribe(data => {
      this.isBlocked = true;
    }, err => {
      this.isBlocked = false;
    });
  }
  unblockUser() {
    this.isBlocked = false;
    this.http.get(MyApp.API_ENDPOINT+'/user/'+this.profile_id_temp+'/unblock', this.httpOptions).map(res => res.json()).subscribe(data => {
      this.isBlocked = false;
    }, err => {
      this.isBlocked = true;
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
  viewImage(photos,userid,fileInput:HTMLElement) {
    if(this.userProfile.id == userid){
      this.editStatus = true; 
       fileInput.click();
    }
    else{
     let modal = this.modalCtrl.create(GalleryModal, {
       photos: [{ 
         url: photos.url, 
       }]
       }, {cssClass: 'my-modal-class'});
       modal.present();
    }
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
    let body = {
      "content_type": fileObj.type             
    }  
    this.http.post(MyApp.API_ENDPOINT+'/util/upload_url/create', body, this.httpOptions).map(res => res.json()).subscribe(data => {
      let url = data.data.upload_url;
      this.updatedImage = data.data.download_url;
      loader.dismiss();
      this.avatar_status = false;
      let headers = new Headers();
        headers.append( 'Content-Type', fileObj.type);
      let options = new RequestOptions({
        headers: headers                
      });
      this.http.put(url,fileObj, options).map(res => res.json()).subscribe(data => {          
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
    "profile_image": this.updatedImage
  }
  this.http.post(MyApp.API_ENDPOINT+'/user/profile/image/update', body, this.httpOptions).map(res => res.json()).subscribe(data => {
});
}
next(){
  let profile = {}, status;
  if(this.profile.avatar_toggle) status = "true";
  else status = "false";
  profile={      
           "avatar_name": this.profile.avatar_name,      
           "city": this.profile.city,
           "dob": this.profile.dob,
           "gender": this.profile.gender,
           "income": this.profile.income,
           "name": this.profile.name,      
           "zip_code": this.profile.zip_code,
           "profile_image" : this.updatedImage,
           "avatar_image" : this.profile.avatar_image.url,
           "avatar_toggle": status
}    
let loader = this.loadingCtrl.create({
    content: 'Updating your profile',
    spinner : 'dots'
  });
  loader.present().then(() => { 
    this.http.post(MyApp.API_ENDPOINT+'/user/profile/update',profile, this.httpOptions).map(res => res.json()).subscribe(data => { 
      loader.dismiss();     
    });
  }, err => {
    loader.dismiss();
  });    
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
  
  
