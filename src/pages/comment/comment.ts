import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams , MenuController,AlertController, Navbar, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { MyApp } from '../../app/app.component';
import { ImagePicker } from '@ionic-native/image-picker';
import { AppMinimize } from '@ionic-native/app-minimize';

import { LoadingController } from 'ionic-angular';
import { UserInterestService } from '../../providers/userInterest.service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { RepliesPage } from '../replies/replies';
import { SimpleGlobal } from 'ng2-simple-global';
//import * as $ from "jquery";

declare var Pusher:any ;
declare var window;
declare function unescape(s:string): string;

@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
   providers: [UserInterestService]
  
})

export class CommentPage {

  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild('fileInput') el:ElementRef;

  people = [];
  images = [];
  public pupil: any;
  public commentedData: any;
  public textInput: any= "";
  story_id : any ;
  tkn_sb : any ;
  story_comments : any[];
  commentId : any;
  commentsLength : any;
  temp1 = [];
  str : any;
  str1 : any;
  personName : any;
  card_title : any;
  attachPic : any;
  preview : any;
  url : any;
  commentBody:any;
  temptrim : any;
  diffDays : any;
  diffMonths : any;
  year : any;
  diffHours : any;
  diffMin : any;
  activatePadding : boolean = true;
  userProfile : any;
  myHeight :any;
  userObj : any;
  commentReaction : any;
  channel : any;
  feed : any;
  isValid : boolean;
  httpOptions = {};
  imagePreview: any;
  showLoader: boolean = false;videoPreview: any;
  searchString = "" ;
  showList: boolean = false;
  userList = [];
  items = [];
  isValidExp: boolean  = false;
  textInput_temp: string;
  tempArr = [];
  message_users = [];
  zone_id: any;

  constructor(private navCtrl: NavController,
              public navParams: NavParams,
              private menu: MenuController,
              private storage: Storage,
              private http: Http,
              private alertCtrl: AlertController,
              private navController: NavController,
              public loadingCtrl: LoadingController,
              public userService: UserInterestService,
              private iab: InAppBrowser,
              private camera: Camera,             
              public sg: SimpleGlobal,
              private imagePicker: ImagePicker,
              private appMinimize: AppMinimize,
              public platform: Platform) { 
              
              let appEl = <HTMLElement>(document.getElementsByTagName('ION-APP')[0]),
              appElHeight = appEl.clientHeight;
              window.addEventListener('native.keyboardshow', (e) => {
                appEl.style.height = (appElHeight - (<any>e).keyboardHeight+10) + 'px';
              });
              window.addEventListener('native.keyboardhide', () => {
                appEl.style.height = '100%';
              });
              this.platform.registerBackButtonAction(() => {      
                if(this.navCtrl.canGoBack()){
                  this.navCtrl.pop();
                }
                else {
                  this.appMinimize.minimize();
                }
              }); 
              this.storage.get('sbtkn').then((val) => {
                  this.tkn_sb = val;
                  this.httpOptions = {
                    headers: new Headers({ 'Content-Type': 'application/json','tenaAcceptnt':'application/json', 'token': this.tkn_sb })                    
                  };
                  this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(data => {
                    this.userProfile = data.data; 
                    this.storage.set('userProfile', data.data);                    
                    let temp = this.userProfile.id.search("_");
                    if(temp > 0) {
                      this.userProfile.id = this.userProfile.id.split("_")[0];
                    }
                    this.getMembers();                   
                      
                  }, err => {
                    this.getMembers();
                  });
                  
                });
               this.story_id = navParams.get("id");
               this.sg['story_comments'] = navParams.get("comments");
               this.commentReaction = navParams.get("userObj");                            
               this.card_title = navParams.get("title"); 
               this.tkn_sb = navParams.get("tkn"); 
               //this.channel = navParams.get("channel"); 
               this.feed = navParams.get("feed"); 
              // this.userProfile = this.feed.user;
               console.log(this.feed.user);
               this.initialiseItems();                
          }

  replies(id, comment, idx) {    
    this.navCtrl.push(RepliesPage, {id, title:this.card_title, tkn:this.tkn_sb, comment, idx, 
      commentReaction :this.commentReaction, story_id: this.story_id, feed:this.feed, "members" :this.userList});
  }

  getMembers() {
    this.zone_id = this.navParams.get("zone_id");
    this.people = this.navParams.get("zone_members");
    if(this.people && this.people.length > 0) {
      this.filterMembers();
    }    
    if(this.zone_id) {
      this.zoneMembers();
    }
    else if(!this.zone_id && !this.people){
      this.usersList(); 
    }
  }

  filterMembers() {
    let people_temp = [];    
    if(this.people && this.people.length > 0) {            
      this.people =  this.people.sort((a,b) => {
        if(a.name && a.name.toLowerCase() == b.name && b.name.toLowerCase()){
          return 0;
        }
        else if(a.name && a.name.toLowerCase() > b.name && b.name.toLowerCase()){
          return 1;
        }
        if(a.name && a.name.toLowerCase() < b.name && b.name.toLowerCase()){
          return -1;
        }
      });      
    }
    for(var i=0;i<this.people.length;i++) {
      if(this.userProfile.id != this.people[i].id) {
        let image;
        if(this.people[i].profile_image && this.people[i].profile_image.url) {
          image = this.people[i].profile_image.url
        }
        people_temp.push({
          "type" : "contact",
          "avatar" : image,
          "id" : this.people[i].id,
          "name" : this.people[i].name
        });
      }
    }
    this.people = people_temp;
    this.userList = this.people;    
  }
  cardOwner(cardOwnerId) { 
    if(cardOwnerId) {
      let temp1 = cardOwnerId.search("_");
      if(temp1 > 0) {
        cardOwnerId = cardOwnerId.split("_")[0];
        return cardOwnerId;
      }
      else {
        return cardOwnerId;
      }
    }  
  }

 /* ionViewWillLeave(){
    this.story_id = "";     
     this.commentReaction = navParams.get("userObj");                            
     this.card_title = ""; 
     this.tkn_sb = ""; 
     this.channel = "";
     this.sg['story_comments'] = "";   
  } */

  initialiseUsers() {
    this.people =  this.userList;
   }

  initialiseItems(){       
    var that = this;
    if(this.sg['pusher']) {
      this.sg['pusher'].bind("story_update", function(dt) {
        console.log("pusher message received from server :"+JSON.stringify(dt));
        let storyId = dt.data.story_id ;
        if( that.story_id == storyId){
          let headers = new Headers();  
            headers.append( 'Content-Type','application/json');
            headers.append( 'Accept', 'application/json');
            headers.append( 'token', that.tkn_sb);
          let options = new RequestOptions({
            headers: headers                  
          });        
          that.http.get(MyApp.API_ENDPOINT+'/feed/story/'+storyId,options).map(res => res.json()).subscribe(data => {
            that.sg['story_comments'] = data.data.feed.comments;
            that.commentReaction = data.data.user;
          });        
        }  
      }); 
    }           
  }

  delete(id, comment, idx){
    //this.sg['story_comments'][idx] = null;     
    let tempComments = [];
    let alert = this.alertCtrl.create({            
      message: "Comment will be removed",
      buttons: [{
        text: 'Cancel',
        role : 'cancel'                     
      },{
          text: 'REMOVE',
          handler: () => {
            let loader = this.loadingCtrl.create({
              content: 'Deleting your comment',
              spinner : 'dots'
            });    
            loader.present().then(() => {   
            let headers = new Headers( );  
              headers.append( 'Content-Type','application/json');
              headers.append( 'Accept', 'application/json');
              headers.append( 'token', this.tkn_sb);           
            let options = new RequestOptions({
                    headers: headers                
                });
            let that = this;
            this.http.post(MyApp.API_ENDPOINT+'/comment/'+id+'/delete',{},options).map(res => res.json()).subscribe(data => {
              loader.dismiss();
              for(var i=0;i<this.sg['story_comments'].length;i++){
                if(idx != i){
                  tempComments.push(this.sg['story_comments'][i]);
                }
              }
              this.sg['story_comments'] = tempComments;                      
              that.http.get(MyApp.API_ENDPOINT+'/feed/story/'+this.story_id, options).map(res => res.json()).subscribe(res => {
                that.sg['story_comments'] = res.data.feed.comments;
                that.commentReaction = res.data.user;
              });
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
      }]  
    });
    alert.present(); 
  } 

  change() {
 
    // get elements :

    let element   = document.getElementById('messageInputBox');
    let textarea  = element.getElementsByTagName('textarea')[0];

    // set default style for textarea :

    textarea.style.minHeight  = '24px';
    textarea.style.height     = '24px';

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

    element.style.height      = scroll_height + 16 + "px";
    textarea.style.minHeight  = scroll_height + 16 + "px";
    textarea.style.height     = scroll_height + 16 + "px";
   }

  getDateFormat(date): string{
    if(date != 'now'){
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
      this.diffDays = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())) /(1000 * 60 * 60 * 24));
      this.diffMonths = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())) /(1000 * 60 * 60 * 24 * 30));
      this.year = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())) /(1000 * 60 * 60 * 24 * 365));
      var timeDiff = (currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000)) - (dt.getTime());    
      this.diffHours = Math.round(timeDiff / (1000*60*60) ) ;    // hours
      this.diffMin = Math.round(timeDiff / (1000*60) ) ;        // mins
      if(this.diffMin < 60 ){
        if(this.diffMin == 1){
          return this.diffMin+' '+'min';
        }
        else if(this.diffMin == 0){
          return 'now';
        }
        else {
        return this.diffMin+' '+'mins';
        }        
      }
      else if(this.diffHours < 24 ){
        return this.diffHours+' '+'h';      
        }
      else if(this.diffHours > 23 ){
        return this.diffDays+' '+'d';      
      }
      else if(this.diffDays > 29){        
        if(this.diffMonths < 2){
          return this.diffMonths+' '+'month';
        }
        else {
        return this.diffMonths+' '+'months';
        }
      }
      else if(this.diffMonths > 11){
        return this.year+' '+'y';    
      }
    }
    else {
      return 'now';
    }
  }

  close(){
    this.imagePreview = null;
    this.attachPic = null;
  }
  ionViewDidEnter() {
    this.menu.swipeEnable(false, 'menu1');
  }  

  cam_run(){       
    const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,  
    saveToPhotoAlbum: true,
    correctOrientation: true
  }
  this.camera.getPicture(options).then((imageData) => { 
    this.imagePreview = 'data:image/jpeg;base64,' + imageData; 
    }, 
    (err) => {
    //alert(JSON.stringify(err));
    });
  }  

  goToLink(url){
    const browser = this.iab.create(url,'_system',{location:'no'});
  }
   
  b64toBlob(dataURI) {
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

  fileUploadCamera() {
    let imagePreview = "";
    const options1: CameraOptions = {
      quality: 50,
      targetWidth: 900,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options1).then((imageData) => {
      this.imagePreview = 'data:image/jpeg;base64,' + imageData;      
      let imageDt = [{data: imageData, mimetype: "image/jpeg"}]
      let body = {
        "image_data" : imageDt
      }      
      let loader = this.loadingCtrl.create({
        content: 'Uploading your image',
      });
      loader.present().then(() => {       
        this.http.post(MyApp.API_ENDPOINT+'/util/upload/images',body).map(res => res.json()).subscribe(data => {
          loader.dismiss();
          this.attachPic = data.data.uploaded_urls[0];                 
        },err => {
          loader.dismiss();         
          alert("Failure : Something went wrong while uploading");        
        });
      });  
    });    
  }

  /* --------------multiple image attachment --------------- 

  multipleImageAttachment() {
    let imageData = "";  
    const options3 = {
      quality:50,
      outputType:1
    };
    this.imagePicker.getPictures(options3).then(results =>{
      $.each(results, function(index, value) {
        imageData = 'data:image/jpeg;base64,'+value;
        let blob1 = this.b64toBlob(imageData);      
        $.ajax ({ 
          url: MyApp.API_ENDPOINT+'/util/upload_url/create', 
          type: "POST", 
          data: JSON.stringify({content_type: blob1.type}), 
          contentType:"application/json; charset=utf-8", 
          dataType: "json", 
          success: function(res){        
            //  alert('Upload url '+res.data.upload_url);  
            $.ajax({ 
              url: res.data.upload_url, 
              type: "put", 
              data: blob1, 
              headers: {"Content-Type": blob1.type}, 
              processData: false, 
              success: function (res1) { 
                // console.log("done", res1); 
                // alert("DownloadUrl : "+res.data.download_url);
                // this.attachPic = res.data.download_url;
                // alert("DownloadUrl 1 : "+this.attachPic);
                this.images.push(res.data.download_url);
              } 
            }); 
          } 
        });
      });
      let that = this;
      setTimeout(function(){
        for(let i=0;i<that.images.length;i++){
          alert(that.images[i]);
        }
        this.attachPic = that.images;
      },5000);
    });
  }
  
  getFileContentAsBase64(path,callback){
    window.resolveLocalFileSystemURL(path, gotFile, fail);            
    function fail(e) {
      alert('Cannot found requested file');
    }
    function gotFile(fileEntry) {
      fileEntry.file(function(file) {
        var reader = new FileReader();
        reader.onloadend = function(e) {
              var content = this.result;
              callback(content);
        };
        // The most important point, use the readAsDatURL Method from the file plugin
        reader.readAsDataURL(file);
      });
    }
  }

  /*---------------- image attachment starts ---------------- */

  private gallery_run(fileInput:HTMLElement): void {
    fileInput.click();
  }

  fileUpload(event) {
    let fileObj, imagepreview, videoPreview;
    let loader = this.loadingCtrl.create({
      content: 'Uploading your image',
    });
    loader.present().then(() => {
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event:any) => {
          imagepreview = event.target.result;          
          /*if(fileObj && (fileObj.type == "video/mp4")) {
            loader.dismiss();
            this.videoPreview = event.target.result;            
          }
          else {
            imagepreview = event.target.result;                     
          } */         
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
          let options1 = new RequestOptions({
            headers: headers                
          });
          loader.dismiss();
          this.http.put(url,fileObj,options1).map(res => res.json()).subscribe(data1 => {                            
          },err => {          
          });
          setTimeout(() => {
            //this.attachPic = imagepreview;
            this.imagePreview = imagepreview;          
          },500);        
        }, err => {
            loader.dismiss();
        });      
    });
  }

  /*---------------- image attachment ends ---------------- */
  
  /*fileUploadAttach() {  
    //alert('attachment');
    let blob1 = this.b64toBlob($("fileInput").get(0).src);
    let contentType = 'image/jpeg';
    //alert(blob1);
    let that = this;
    $.ajax ({ 
      url: MyApp.API_ENDPOINT+'/util/upload_url/create', 
      type: "POST", 
      data: JSON.stringify({content_type: blob1.type}), 
      contentType:"application/json; charset=utf-8", 
      dataType: "json", 
      success: function(res){      
        //alert(res.data.upload_url);
        $.ajax({ 
          url: res.data.upload_url, 
          type: "put", 
          data: blob1, 
          headers: {"Content-Type": blob1.type}, 
          processData: false, 
          success: function (res) { 
          console.log("done", res); 
          //alert(res.data.download_url);
          } 
        }); 
      } 
    });
  }*/
  submitcomment() {      
    let tempInput, imageUrl = null, username, profileImg;    
    this.textInput = this.textInput.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');    
    if(this.imagePreview) {
      imageUrl = this.imagePreview;
      this.imagePreview = null; 
    }
    tempInput = this.textInput ; 
    if(this.userProfile && !this.userProfile.avatar_toggle) {
      username =  this.userProfile.name;
      profileImg =  this.userProfile.profile_image.url
    }
    else {
      username =  this.userProfile.avatar_name
      profileImg =  this.userProfile.avatar_image.url
    } 
    this.sg['story_comments'].push({'attachment': {'url': imageUrl},
                      'created_at' :'now',
                      'description': this.textInput,
                      'dislikes' : 0,
                      'id': null,
                      'likes':0,
                      'replies':[],
                      'link_preview' : null,
                      'user':{
                        'name': username,
                        'avatar_name' : "",
                        'avatar_toggle': this.userProfile.avatar_toggle,
                        'avatar_image': null,
                        'profile_image' : {'url': profileImg}
                      }
                    });          
    if(this.preview){      
      this.sg['story_comments'][this.sg['story_comments'].length-1]['link_preview'] = {'title':this.preview.title,
                                          'image':{
                                                  'url':this.preview.image
                                                  },
                                          'source':this.preview.domain,
                                          'description':this.preview.description,
                                          'url':this.preview.url};
    }
    var message_split = this.textInput.split("@");
    var new_message = "";
    var name = "";
    for(var i=0;i<message_split.length;i++){
    if(message_split[i].indexOf('[') != -1){    
      name = message_split[i].split('[').pop().split(']')[0];    
      for(var j=0;j<this.message_users.length;j++){ 
        if(this.message_users[j].name == name){
          new_message = new_message+"@"+message_split[i].replace(name,this.message_users[j].id);
          break;
        }
      }    
    }
    else{
      new_message = new_message+""+message_split[i];
    }
  }
  //alert(new_message);
  this.textInput = new_message;

  let temp_u:any;
  let temp_url = this.textInput.trim();
  let temp_url1 = temp_url.toLowerCase(); 
  let temp_url2 = temp_url1.split(" ");
  for(var i=0;i<temp_url2.length;i++){
    var url1 = temp_url2[i].search("://");
    if(url1 > -1){
       temp_u = temp_url2[i];
      console.log(temp_u);
    }
   }
  var text = "" ;
  let textInput = this.textInput.trim();
  let textInput1 = textInput.split(" ");
  if(textInput1){
    for(var i=0;i<textInput1.length;i++){
      var url = textInput1[i].search("://");
     if(url > -1){
       let  temp = this.textInput;
       text = temp.replace(textInput1[i] , temp_u );
       this.textInput = text;
     }
     }
  }else{
    this.textInput = new_message;
  }
  let headers = new Headers( );    
      headers.append( 'Content-Type','application/json');
      headers.append( 'Accept', 'application/json');
      headers.append( 'token', this.tkn_sb);
      let options = new RequestOptions({
        headers: headers                
      });
    this.textInput = btoa(unescape(encodeURIComponent(this.textInput)));    
    this.textInput = this.textInput.trim(" ");
    //console.log(this.textInput);
    if(this.attachPic == null){      
      this.commentBody = { 
        "description": this.textInput
      }
    }
    else {
        this.commentBody = {        
          "attachment": this.attachPic,
          "description": this.textInput
      }
    }
    this.textInput = "" ; 
    this.myHeight = "40px";
      setTimeout(() => { 
        this.myHeight = " ";
      },2000);
                 
    this.http.post(MyApp.API_ENDPOINT+'/story/'+ this.story_id +'/comment',this.commentBody,options).map(res => res.json()).subscribe(data => {
      //alert(JSON.stringify(this.commentBody));
      tempInput = "";
      this.message_users = [];
      this.attachPic = null; 
      this.sg['story_comments'] = data.data.feed.comments;
      this.commentReaction = data.data.user;
      this.commentsLength = data.data.feed.comments.length;
      this.storage.set('commentsLength',this.commentsLength);
      this.imagePreview="";
      this.preview = null;            
    },
    err => {
      //tempInput = "";
      //this.attachPic = null;
      console.log("Error :" + JSON.stringify(err));
      let alert = this.alertCtrl.create({
        title: "Failure",
        message: "Sorry, something went wrong!",
        buttons: ["OK"]
      });
      alert.present();            
    });
  }

  likeComment(id, idx, likes, unlikes){    
    if(this.commentReaction.comment_reactions[id] != 'LIKE'){
      this.sg['story_comments'][idx].likes = likes+1 ;
      if(this.commentReaction.comment_reactions[id] == 'DISLIKE'){
        this.sg['story_comments'][idx].dislikes = unlikes-1 ;
        this.commentReaction.comment_reactions[id] = 'LIKE' ; 
      }
      else {
        this.commentReaction.comment_reactions[id] = 'LIKE' ; 
      }   
    let headers = new Headers( );  
     headers.append( 'Content-Type','application/json');
     headers.append( 'Accept', 'application/json');
     headers.append( 'token', this.tkn_sb);
   let body = {
          "reaction": "LIKE"           
    }    
        let options = new RequestOptions({
                headers: headers                
            });
    this.http.post(MyApp.API_ENDPOINT+'/comment/'+id+'/react',body,options)
         .map(res => res.json())
        .subscribe(data => {      
          this.sg['story_comments'] = data.data.feed.comments;
          this.commentReaction = data.data.user;   
        },
        err => {    
        
        });
    }
  /*  else {
      this.sg['story_comments'][idx].likes = likes-1 ;
      this.sg['story_comments'][idx].dislikes = unlikes+1 ;
    }  */
  }

  unlikeComment(id, idx, likes, unlikes){      

     /* if(likes > 0 && this.commentReaction.comment_reactions[id] != 'DISLIKE'){
        this.sg['story_comments'][idx].likes = likes-1 ;
      } */
      if(this.commentReaction.comment_reactions[id] != 'DISLIKE'){
       
        this.sg['story_comments'][idx].dislikes = unlikes+1 ;

        if(this.commentReaction.comment_reactions[id] == 'LIKE'){
          this.sg['story_comments'][idx].likes = likes-1 ;
          this.commentReaction.comment_reactions[id] = 'DISLIKE' ;          
        }
        else {
        this.commentReaction.comment_reactions[id] = 'DISLIKE' ; 
      }

        let headers = new Headers( );  
         headers.append( 'Content-Type','application/json');
         headers.append( 'Accept', 'application/json');
         headers.append( 'token', this.tkn_sb);
        let body = {
              "reaction": "DISLIKE"           
        }    
        let options = new RequestOptions({
                headers: headers                
            });
      this.http.post(MyApp.API_ENDPOINT+'/comment/'+id+'/react',body,options)
           .map(res => res.json())
          .subscribe(data => { 
          this.sg['story_comments'] = data.data.feed.comments;       
           this.commentReaction = data.data.user;        
              },
              err => {            
              });
      }
    /*  else {
        this.sg['story_comments'][idx].likes = likes-1 ;
        this.sg['story_comments'][idx].dislikes = unlikes-1 ;
    } */       
  }

  usersList() {
    let body = {
      "page": 1,
      "page_size": 7,
      "search_string": ""           
    }
    this.people = [];
    this.userList = [];
    this.http.post(MyApp.API_ENDPOINT+'/util/search/people/autocomplete',body, this.httpOptions).map(res => res.json()).subscribe(data => {
      let userList = data.data.users;      
      for(var i=0;i<userList.length;i++) {
        if(userList[i].id != this.userProfile.id) {
          this.people.push(userList[i]);
          this.userList.push(userList[i]);          
        }        
      }            
             
    }); 
  }

  zoneMembers() {    
    this.people = [];
    this.userList = [];
    this.http.get(MyApp.API_ENDPOINT+'/zone/'+this.zone_id, this.httpOptions).map(res => res.json()).subscribe(data => {
      this.people = data.data.members;      
      this.filterMembers();        
    }); 
  }

  myMethod(textInput){   
    let temp1 = textInput.trim(" ");
    let temp_1 = temp1.toLowerCase();     
    let regExp1 = /^[@]/g;
    this.str = temp_1.split(" ");
    let lastWord = this.str[this.str.length-1] ;
    let isAtValid = lastWord.split("@");   
    this.isValidExp = regExp1.test(lastWord);    
    let temp3 = temp_1.search("http");       
    this.temptrim = temp_1;
    let headers = new Headers();
      headers.append( 'Content-Type','application/json');
      headers.append( 'Accept', 'application/json');
      headers.append( 'token', this.tkn_sb);
    let options = new RequestOptions({
      headers: headers
    });     
    if(isAtValid && this.isValidExp) {      
      let str = this.str[(this.str).length-1].split("@");  
      //console.log(str);     
      this.initialiseUsers();      
      if(str[1] && str[1].trim() != '') {
        this.people = this.people.filter((item) => {
          return (item.name && item.name.toLowerCase().indexOf(str[1].toLowerCase()) > -1);
        })
      }
      else {
        return this.people
      } 
      //return this.people
    }                 
    if(temp3 > -1) {
      // let temp1 = textInput.trim(" ");
      //  let temp_1 = temp1.toLowerCase();
      let n = temp_1.search("http");
      let a = temp_1.length;
      let res = temp_1.substr(n, a);
      let res1 = res.split(" ");
      let re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
      //var regexp = /((ftp|http|https):\/\/)?(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
      
      this.isValid  =re.test(res1[0]);         
      let apiKey = "5af190119b03547407c653a0";
      if(this.isValid && apiKey) {
          let urlEncoded = encodeURIComponent(res1[0]);
          let requestUrl = "https://opengraph.io/api/1.0/site/" + urlEncoded + '?app_id=' + apiKey;
        setTimeout(() => {
            let body = {
              "url": res1[0]           
            }
            // this.http.get(requestUrl).map(res => res.json()).subscribe(data => {          
            //   this.preview = data.hybridGraph ;
            // }); 
            this.http.post(MyApp.API_ENDPOINT+'/util/url/preview',body,options).map(res => res.json())
            .subscribe(data => {
                this.preview = data.data;                       
            });            
        },1000);            
      }                    
    }       
  }

  selectName(person, textarea) {    
    this.message_users.push({"id" : person.id, "name" : person.name}) ;
    var lastIndex = this.textInput.lastIndexOf(" ");
    this.textInput = this.textInput.substring(0, lastIndex);      
    this.textInput = this.textInput + " " + "@[" + person.name + "]"; 
    this.isValidExp = false; 
    if(this.platform.is('ios')) {
      textarea.setFocus(); 
    }    
  }

  desChange(description, idx, eleId) {
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
              //this.hyperlinkText(new_message, eleId, idx);
            }
          }         
          //new_message = new_message+' <a onClick="openProfile('+id+')">'+"@"+name+'</a> ';        
        }
        else{
          new_message = new_message+temp1[i];
        }       
      }
      return document.getElementById(eleId+idx).innerHTML = new_message;
    }
    else {
      //this.hyperlinkText(description, eleId, idx);
      return description;
    }
  }
  
  hyperlinkText(description, eleId, idx) {
    let textInput = "";
    if(description.search("http") > -1) {
      let comment = description.split(" ");
      for(var i=0; i<comment.length;i++) {
        //let temp = comment[i].toLowerCase();
        let temp3 = comment[i].search("http");
        if(temp3 > -1) {        
          let a = comment[i].length;
          let res = comment[i].substr(temp3, a);
          let res1 = res.split(" ");
          textInput = textInput+' <span style="color:#65A0E6" (click)="openProfile()">'+res1[0]+'</span> '+" ";
        }
        else {
          textInput = textInput+comment[i]+" ";
        }
      }    
      return document.getElementById(eleId+idx).innerHTML = textInput;
    }
    else {
      return description;
    }
  }

}