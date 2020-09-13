import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Platform} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import { MyApp } from '../../app/app.component';
import { AppMinimize } from '@ionic-native/app-minimize';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-invitefriends',
  templateUrl: 'invitefriends.html'
})
export class InvitefriendsPage {
status:boolean= true;
newOptions = [];

inputs: Array<{placeholder: string}>;
invites:Array<any> = [];
tkn_sb : any;
inviteForm : FormGroup;
submitAttempt: boolean = false;
emailValidation : boolean = false;
  invitesLength: number;invitearray:boolean;
  regs = "/^[a-z0-9!#$%&'+\/=?^_`{|}~.-]+@\w+([\.-]?\w+)?(\.\w{2,4})+$/i";
  emails=[];
  
// inputs: Array<{placeholder: string}>;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private http: Http,
              private storage: Storage,
              fb: FormBuilder,
              private loadingCtrl : LoadingController,
              public alertCtrl : AlertController,
              private appMinimize: AppMinimize,
              public platform: Platform) {
                // this.status = false;
              this.storage.get('sbtkn').then((val) => {
                this.tkn_sb = val; 
              });
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
           
               this.inputs=[
                {placeholder:'email id #1'}                         
              ];
               
 }

  inputWatch(invites,idx) {
   if(this.invites) {     
          let tempEmail = this.invites[this.invites.length-1];
          var reg = /^[a-z0-9!#$%&'+\/=?^_`{|}~.-]+@\w+([\.-]?\w+)?(\.\w{2,4})+$/i;
          
        if(reg.test(tempEmail)){
          this.status = true;
          //  this.newOptions.push(tempEmail); 
           console.log(this.invites);
       
          if((idx+2) > this.inputs.length) {         
            this.inputs.push({placeholder:'email id #'+(idx+2)}); 
           
            }
          if((this.inputs.length-3) == (idx) && invites[idx] == ""){
            this.inputs.pop();
          }
        }          
        else{
          this.status = false;
        }
     }    
  }


invite(){
  /*let alert = this.alertCtrl.create({
    title: 'Alert',
    subTitle: 'Invitations currently locked. Will be unlocked soon.',
    buttons: [{
      text: 'OK',
      handler: () => {          
                        
      }
    }],
    enableBackdropDismiss:false
  });
  alert.present();*/


          let headers = new Headers( ); 
          headers.append( 'Content-Type','application/json');
          headers.append( 'Accept', 'application/json');
          headers.append( 'token', this.tkn_sb);     
          let options = new RequestOptions({
                      headers: headers                 
                  });
            let body = {
              "emails" :  this.invites 
            }
       console.log(body);
       let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Sending invites',
        //content: this.safeSvg,
      });
      loader.present().then(() => { 
       this.http.post(MyApp.API_ENDPOINT+'/user/member/invite',body,options).map(res => res.json()).subscribe(data => {
         loader.dismiss();
          for(var i = 0; i < this.invites.length; i++){
            this.invites[i] = "" ;
          }                           
            //alert(data.data.message);            
            let alert = this.alertCtrl.create({        
              message: data.data.message,
              buttons: [{
                text: 'OK',
                handler: () => {  
                  this.navCtrl.setRoot(TabsPage);                 
                }
              }]
            });
            alert.present();                        
          }, err => {
            loader.dismiss();
            let error = JSON.parse(err._body);              
            //alert(error.error.message);
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