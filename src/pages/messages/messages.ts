import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, MenuController, Platform, Content, Button, ToastController, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Http, Headers, RequestOptions} from '@angular/http';
import { LoadingController } from 'ionic-angular';
import {SimpleGlobal} from 'ng2-simple-global';
import { MyApp } from '../../app/app.component';
import { AppMinimize } from '@ionic-native/app-minimize';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { InAppBrowser } from '@ionic-native/in-app-browser';

declare var Pusher:any ;

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {
  @ViewChild(Content) content: Content;
  @ViewChild('sendButton') sendButton:Button;
	tkn_sb:any;
	userId:any;
	users:any;
  messageText : any = "";
  name : any;
  chats : any;
  profileId : any;
  chatId : any;
  toUser : any;
  min:any;
  sentDate : any;
  amHidden : boolean = true;
  showLoader :boolean = false;
  httpOptions = {};
  pusherObj: any;
  webChatId: any;
  activatePadding : boolean = true;
  attachPic = [];
  imagePreview: any;
  myHeight: string;
  isValid: boolean;
  preview: any;
  input_temp: any;
  selectedCount: number = 0;
  messages = [];
  delIds: any[];

  constructor(public navCtrl: NavController, 
  			  public navParams: NavParams,
          private storage: Storage,
          public loadingCtrl: LoadingController,
          private http: Http,             
          private menu: MenuController,
          public sg: SimpleGlobal,
          private camera: Camera,
          private appMinimize: AppMinimize,
          public platform: Platform,
          private iab: InAppBrowser,
          public toastCtrl : ToastController,
          public alertCtrl : AlertController) {
 
 	  this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
    });
    this.storage.get('userProfile').then((val) => {
      this.profileId = val.id; 
      let temp = this.profileId.search("_"); 
      if(temp > 0) {
        this.profileId = this.profileId.split("_")[0];
      }            
    });
    this.name = this.navParams.get("name");
    this.chatId = this.navParams.get("chatId");
    //this.chatId = "5c0f61e2827b940001a1d5cb";
    this.webChatId = this.navParams.get("webChatId");
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
  }  

  ionViewDidEnter() {
    this.menu.swipeEnable(false, 'menu1');
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','Accept':'application/json', 'token': this.tkn_sb})
      };
      this.initialiseItems();      
    }); 	  
  } 

  initialiseItems() {
    if(this.chatId){
      this.showLoader = true;
      //this.userId = this.navParams.get("id");
      let pagination = {
        "page": 1,
        "page_size": 30
      }
      this.http.post(MyApp.API_ENDPOINT+'/chat/'+this.chatId+'/messages',pagination, this.httpOptions).map(res => res.json()).subscribe(data => {        
        this.showLoader = false;
        this.chats = data.data;
        let count = this.chats.length-1;        
        if(this.chats.length > 0) {
          this.sentDate = this.chats[0].sent_at;
        }
        setTimeout(() => {            
          this.content.scrollToBottom(0);          
        },500);
        for(var i=0;i<this.chats.length;i++){
          this.messages[i] = false;
        }
        Pusher.logToConsole = false;
        this.sg['pusherObj'] = new Pusher('c02d2b34f9ba5121fbbb',{
          cluster:'mt1',
          encrypted: true
        });
        let channels = [], that = this; 
        channels.push(that.sg['pusherObj'].subscribe(that.webChatId));              
        channels[0].bind("chat_update", function(data1) {
          console.log("pusher message received from server :"+JSON.stringify(data1));
          let updated_chatid = data1.data.chat_id ;
          that.updateChat(updated_chatid);
        });
                
      },
      err => {
        this.showLoader = false;
      });
    }
  } 

  myMethod(ev,textInput) {
    this.messageText = textInput.trim(" "); 
    textInput = textInput.toLowerCase();  
    let temp3 = textInput.search("http");
    if(temp3 > -1) {
      let temp1 = textInput.trim(" ");
      //let n = temp1.search("http");
      let a = temp1.length;
      let res = temp1.substr(temp3, a);
      let res1 = res.split(" ");      
      let re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
      this.isValid  =re.test(res1[0]);         
      //let apiKey = "5af190119b03547407c653a0";
      if(this.isValid) {
          //  let urlEncoded = encodeURIComponent(res1[0]);
          //  let requestUrl = "https://opengraph.io/api/1.0/site/" + urlEncoded + '?app_id=' + apiKey;
        setTimeout(() => {
          let body = {
            "url": res1[0].toLowerCase()           
          }
          // this.http.get(requestUrl).map(res => res.json()).subscribe(data => {          
          //   this.preview = data.hybridGraph ;
          // }); 
          this.http.post(MyApp.API_ENDPOINT+'/util/url/preview',body,this.httpOptions).map(res => res.json()).subscribe(data => {
            this.preview = data.data;                       
          });       
        },1000);                    
      }        
    }
  }

  goToLink(url){
    const browser = this.iab.create(url,'_system',{location:'no'});
  }
  
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
          this.attachPic = [];     
          let url = data.data.upload_url;       
          this.attachPic.push(data.data.download_url);               
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
            this.imagePreview = imagepreview;          
          },500);        
        }, err => {
            loader.dismiss();
        });
      
    });
  }

  close(){
    this.imagePreview = null;
    this.attachPic = [];
  }
 
  submitMessage(sendButton) { 
    sendButton.setFocus();   
    let tempMsgs = [], message = "";
    let messageText = this.messageText.split(" ");
    for(var i=0; i<messageText.length;i++) {
      let temp = messageText[i].toLowerCase();
      let temp3 = temp.search("http");
      if(temp3 > -1) {        
        let a = temp.length;
        let res = temp.substr(temp3, a);
        let res1 = res.split(" ");
        message = message+res1[0]+" ";
      }
      else {
        message = message+messageText[i]+" ";
      }
    }
    this.messageText = message;  
    tempMsgs.push({
      "attachments" : [],
      "link_preview" : null,
      "chat" : this.chatId,
      "from" : {
        "profile_image" : {
          "url" : null
        },
        id : this.profileId
      },
      "message" : this.messageText,
      "sent_at" : null,
      "unread_by" : ""
    });
    if(this.imagePreview) {      
      tempMsgs[0].attachments.push({
        "url": this.imagePreview
      });
    }
    if(this.preview){      
      tempMsgs[0].link_preview = {'title':this.preview.title,
                                    'image':{
                                            'url':this.preview.image
                                            },
                                    'source':this.preview.domain,
                                    'description':this.preview.description,
                                    'url':this.preview.url};
    }    
    for(var i=0;i<this.chats.length;i++) {
      tempMsgs.push(this.chats[i]);
    }
    this.chats =   tempMsgs; 
    this.content.scrollToBottom(0);        
      let body = {
        "message": this.messageText,
        "attachments"  : this.attachPic       
      }
      let pagination = {
        "page": 1,
        "page_size": 30
      }
      this.messageText = "";
      this.imagePreview = null;
      this.attachPic = [];
      this.preview = "";
      this.isValid = false;      
      this.myHeight = "40px";
      setTimeout(() => { 
        this.myHeight = " ";
        sendButton.setFocus();
      },1000);      
      this.http.post(MyApp.API_ENDPOINT+'/chat/'+this.chatId+'/send/message',body, this.httpOptions).map(res => res.json()).subscribe(data => {         
        this.messageText = "";
        this.attachPic = []; 
        sendButton.setFocus();                    
      },
      err => {
        sendButton.setFocus();        
      });
  }
  
  updateChat(id) {
    let pagination = {
      "page": 1,
      "page_size": 30
    }
    this.http.post(MyApp.API_ENDPOINT+'/chat/'+id+'/messages',pagination, this.httpOptions).map(res => res.json()).subscribe(data => {      
      this.chats = data.data;
      let count = this.chats.length-1;        
        if(this.chats.length > 0) {
          this.sentDate = this.chats[0].sent_at;
        } 
    });
  }

  change() {
    // get elements
    var element   = document.getElementById('messageTextBox');
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
    element.style.height      = scroll_height  + 20 + "px";
    textarea.style.minHeight  = scroll_height  + 20 +"px";
    textarea.style.height     = scroll_height + 20 + "px";
    var width = (element.clientWidth + 1) + "px";
  }
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
          this.attachPic = [];
          this.attachPic.push(data.data.uploaded_urls[0]);                          
        },err => {
          loader.dismiss();         
          alert("Failure : Something went wrong while uploading");        
        });
      });  
    });    
  }
  ionViewWillLeave() {
    this.sg['updateStatus'] = "update";
    this.sg['pusherObj'].unsubscribe(this.webChatId);
  }

  displaySentDate(date, index):string {
    let temp_month = [];        
    let amorpm = "";
    if(date) {
      let tempDt = date.split("T")[0];
      this.sentDate = this.sentDate.split("T")[0];    
      if((this.sentDate == tempDt && index == 0) || (this.sentDate != tempDt)){
        this.sentDate = date.split("T")[0];    
        let dt = new Date(date);    
        let dd = dt.getDate();
        let mm = dt.getMonth();
        let hour:any = dt.getHours(); 
        let min:any = dt.getMinutes();
        let year = dt.getFullYear();
        temp_month.push("Jan");
        temp_month.push("Feb");
        temp_month.push("Mar");
        temp_month.push("Apr");
        temp_month.push("May");
        temp_month.push("Jun");
        temp_month.push("Jul");
        temp_month.push("Aug");
        temp_month.push("Sep");
        temp_month.push("Oct");
        temp_month.push("Nov");
        temp_month.push("Dec");
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
        //return temp_month[mm]+' '+dd+', '+newHr+':'+newMin+" "+amorpm;
        return temp_month[mm]+' '+dd;        
      }
      // else {
      //   return null;
      // }
    }     
  }
  
  displaySentTime(date, index):string {
    let temp_month = [];        
    let amorpm = "";
    if(date) {
      let tempDt = date.split("T")[0];
      // this.sentDate = this.sentDate.split("T")[0];
      // this.sentDate = date.split("T")[0];    
      let dt = new Date(date);    
      let dd = dt.getDate();
      let mm = dt.getMonth();
      let hour:any = dt.getHours(); 
      let min:any = dt.getMinutes();
      let year = dt.getFullYear();
      temp_month.push("Jan");
      temp_month.push("Feb");
      temp_month.push("Mar");
      temp_month.push("Apr");
      temp_month.push("May");
      temp_month.push("Jun");
      temp_month.push("Jul");
      temp_month.push("Aug");
      temp_month.push("Sep");
      temp_month.push("Oct");
      temp_month.push("Nov");
      temp_month.push("Dec");
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
      }
      if(newHr == 12) {
        amorpm = "pm";        
      }      
      if(date_new < 10) {
        date_new = "0"+date_new;
      }
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
        if(newHr < 10) {
          newHr = "0"+newHr;
        }
        if(newMin < 10) {
          newMin = "0"+newMin;
        }
        return newHr+':'+newMin+" "+amorpm;
      }  
    } 
  }
  
  onLongPress(chat, idx) {    
    if(this.messages[idx] == true){
      this.messages[idx] = false;
      this.selectedCount = this.selectedCount-1;        
    }
    else {
      this.messages[idx] = true;
      this.selectedCount = this.selectedCount+1;         
    }     
  }

  viewChat(chat, idx) {
    if(this.selectedCount > 0){
      this.onLongPress(chat, idx);
    }       
  }

  deleteMsgs() {
    /*this.delIds = [];
    let temp_users = [];
    for(var i=0;i<this.messages.length;i++){
      if(this.messages[i]){
        this.delIds.push(i);
      }
      else {
        temp_users.push(this.users[i]);
      }
    }          
    let body = {
      "chats": this.delIds
    }  */  
    let alert = this.alertCtrl.create({ 
      title : "Alert",       
      message: "Are you sure want to delete selected messages(s)?",
      enableBackdropDismiss : false,
      buttons: [{
        text: 'DELETE',
        handler: () => {
          //this.users = temp_users;
          this.selectedCount = 0;
          for(var i=0;i<this.chats.length;i++){
            if(this.messages[i]){
              this.chats.splice(i, 1);
            }           
          }
          this.messages = [];             
          // this.http.post(MyApp.API_ENDPOINT+'/chat/delete', body, this.httpOptions).map(res => res.json()).subscribe(data => {
          //   this.users = temp_users;
            let toast = this.toastCtrl.create({
              message: 'Successfully deleted messages',
              duration: 1000,
              position : "middle"
            });
            toast.present();
            this.selectedCount = 0;                    
          // },err => {
          //   let toast = this.toastCtrl.create({
          //     message: 'Sorry! Something went wrong.',
          //     duration: 3000,
          //     position : "middle"
          //   });
          //   toast.present();      
          // });            
        }
      }, {
        text: 'CANCEL',
        handler: () => {  
                      
        }
      }]
    });
    alert.present();
  }
}