import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Platform} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';
import { AppMinimize } from '@ionic-native/app-minimize';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimpleGlobal } from 'ng2-simple-global';
import { ZoneTimelinePage } from '../zoneTimeline/zoneTimeline';
import { CreateZonePage } from '../create_zone/create_zone';

@Component({
  selector: 'page-email_invitations',
  templateUrl: 'email_invitations.html'
})
export class EmailInvitationsPage {
  status:boolean= true;
  newOptions = [];
  inputs: Array<{placeholder: string, status : boolean}>;
  tkn_sb : any;
  inviteForm : FormGroup;
  submitAttempt: boolean = false;
  emailValidation : boolean = false;
  invitesLength: number;invitearray:boolean;
  regs = "/^[a-z0-9!#$%&'+\/=?^_`{|}~.-]+@\w+([\.-]?\w+)?(\.\w{2,4})+$/i";
  emails=[];
  zoneInfo: any;
  invites = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private http: Http,
    private storage: Storage,
    fb: FormBuilder,
    private loadingCtrl : LoadingController,
    public alertCtrl : AlertController,
    private appMinimize: AppMinimize,
    public platform: Platform,
    public sg: SimpleGlobal) {

      // this.status = false;
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val; 
    });
    this.zoneInfo = this.navParams.get('zone_list');
    this.initializeInputs();
    this.inviteForm = fb.group({
      email: ['', Validators.compose([Validators.pattern(/^[a-z0-9!#$%&'+\/=?^_`{|}~.-]+@\w+([\.-]?\w+)?(\.\w{2,4})+$/i), Validators.required])] 
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

  initializeInputs() {
    if(!this.invites || this.invites.length < 1) {      
      this.invites = [];      
    }
    if(!this.inputs || this.inputs.length < 1) {
      this.inputs = [
        { placeholder:'Email #', status : true }                         
      ];
    }                
  }
  removeId(id, index) {
    this.inputs.splice(index, 1);
    this.invites.splice(index, 1);
  }
  
  inputWatch(invites,idx) {
    this.invites[idx] = this.invites[idx].trim(" ");
    if(invites[idx].trim(" ") && invites[idx].length > 0) {
      if((idx+2) > this.inputs.length) {         
        this.inputs.push({"placeholder":'Email #', "status" : true});          
      }
      if((this.inputs.length-2) == (idx) && invites[idx] == ""){
        this.inputs.pop();
      }
    }       
  }

  invite() {
    //this.navCtrl.pop();
    let count = 0;
    for(var i=0;i<this.invites.length;i++) {
      var reg = /^[a-z0-9!#$%&'+\/=?^_`{|}~.-]+@\w+([\.-]?\w+)?(\.\w{2,4})+$/i;          
      if(reg.test(this.invites[i])){
        this.inputs[i].status = true;
        count = count+1;
      }
      else {
        this.inputs[i].status = false;
      }
    } 
    if(count == this.invites.length) {                  
      let headers = new Headers( ); 
      headers.append( 'Content-Type','application/json');
      headers.append( 'Accept', 'application/json');
      headers.append( 'token', this.tkn_sb);     
      let options = new RequestOptions({
        headers: headers                 
      });
      let body = {      
        "invite_members": {
          "emails": this.invites,
          "users": []
        }
      }
      console.log(body);
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Sending invites'
        //content: this.safeSvg,
      });
      loader.present().then(() => { 
        this.http.post(MyApp.API_ENDPOINT+'/zone/'+this.zoneInfo.id+'/invite',body,options).map(res => res.json()).subscribe(data => {
          loader.dismiss();
          this.invites = [];
          this.inputs = []; 
          this.initializeInputs();                          
          //alert(data.data.message);            
          let alert = this.alertCtrl.create({        
            message: data.data.message,
            enableBackdropDismiss : false,
            buttons: [{
              text: 'OK',
              handler: () => {  
                this.navCtrl.pop();               
              }
            }]
          });
          alert.present();                        
        }, err => {
          loader.dismiss();
          let error = JSON.parse(err._body);
          let alert = this.alertCtrl.create({        
            message: error.error.message,
            buttons: [{
              text: 'OK',
              handler: () => { 
                //this.initializeInputs();                 
              }
            }]
          });
          alert.present();
        });
      });
    }    
  }
}