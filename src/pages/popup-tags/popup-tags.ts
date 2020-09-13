import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { MyApp } from '../../app/app.component';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {SimpleGlobal} from 'ng2-simple-global';
@Component({
  selector: 'page-popup-tags',
  templateUrl: 'popup-tags.html',
})
export class PopupTagsPage {
  selectedHashTags = []; hashtagInput:any; tags:any;
  httpOptions = {};
  tkn_sb: any;
  constructor(public navCtrl: NavController,
    public viewCtrl:  ViewController,
    public navParams: NavParams, private http: Http,public loadingCtrl: LoadingController, private storage: Storage,public sg:SimpleGlobal) {
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopupTagsPage');
  }

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
  /* ------------------------------- Adding hashtags while card creation ends -------------------------------------------------- */

  /* ------------------------------- Editing hashtags while card creation starts -------------------------------------------------- */
  editHashTag(value, idx) {    
    this.selectedHashTags.splice(idx, 1);
    this.hashtagInput = value.trim(" "); 
    //this.hashtagInput = this.hashtagInput.split("#");
    //this.hashtagInput = this.hashtagInput[1];    
  }
  /* ------------------------------- Editing hashtags while card creation starts -------------------------------------------------- */

  // selectHashTag(value) {
  //   value = value.trim(" ");
  //   this.selectedHashTags.push(value);
  //   this.tags = [];
  //   this.hashtagInput = "";
  // }
  deleteHashTag(value, idx) {
    this.selectedHashTags.splice(idx, 1);    
  }
  // enterTag(hashtag) {
  //   hashtag.trim(" ");
  //   this.selectedHashTags.push(hashtag);   
  //   this.hashtagInput = "";
  // } 

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

  next() {
    console.log(this.selectedHashTags);
    // this.selectedHashTags.push(value);
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Updating your #tags'      
    });
    loader.present().then(() => {
      let headers = new Headers();      
      headers.append( 'Content-Type','application/json');
      headers.append( 'Accept', 'application/json');
      headers.append( 'token', this.tkn_sb);
      let options = new RequestOptions({
        headers: headers                    
      });
      let body = {
        "hashtags": this.selectedHashTags,
        "action":  "APPEND"      
      }
          
      this.http.post(MyApp.API_ENDPOINT+'/me/hashtags/update',body,options).map(resp => resp.json()).subscribe(data => {
        loader.dismiss();
        let data1 = "yes";
        this.viewCtrl.dismiss(data1);    
        
      }, err => {
        loader.dismiss();
      });
    }); 
  }

}
