import { Component } from '@angular/core';
import { NavController, NavParams , MenuController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { DomSanitizer } from '@angular/platform-browser';
import { MyApp } from '../../app/app.component';
import { InvitecodePage } from '../invitecode/invitecode';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';
import { AppMinimize } from '@ionic-native/app-minimize';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  authForm : FormGroup;
  userEmail : string;
  login_id : any;
  safeSvg : any;
  submitAttempt: boolean = false;
  showLoader: boolean = false;

  constructor(public navCtrl: NavController,
    fb: FormBuilder,
    public params: NavParams,
    private menu: MenuController, 
    private http: Http, 
    public loadingCtrl: LoadingController,
    //private sanitizer: DomSanitizer,
    private storage: Storage,
    private appMinimize: AppMinimize,
    public platform: Platform) { 	
      this.authForm = fb.group({      
        email: ['', Validators.compose([Validators.pattern(/^[a-z0-9!#$%&'+\/=?^_`{|}~.-]+@\w+([\.-]?\w+)?(\.\w{2,4})+$/i), Validators.required])]
        /* Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/i) */       
    });    
    this.storage.get('sbtkn').then((val) => {
      console.log(val);
    });
    this.userEmail = params.get("emailid");
    this.platform.registerBackButtonAction(() => {      
      if(this.navCtrl.canGoBack()){
        this.navCtrl.pop();
      }
      else {
        this.appMinimize.minimize();
      }
    }); 
    
       
  }
  
  next() {
    this.submitAttempt = true; 
    if(this.authForm.valid){
      //this.showLoader = true;
      let loader = this.loadingCtrl.create({
        spinner: 'dots'
      });
      loader.present().then(() => {   
        let headers = new Headers( );  
        headers.append( 'Content-Type','application/json');
        headers.append( 'Accept', 'application/json');      
        let body = {
          "email" : this.userEmail,
          "data" : 'app'
        }
        let options = new RequestOptions({
          headers: headers                
        });
        this.http.post(MyApp.API_ENDPOINT+'/user/invite/request',body, options).map(res => res.json()).subscribe(data => {
          //this.showLoader = false;
          if(data.status == true) {
            loader.dismiss();      
            let icode = data.data.data.code;
            let emailid = data.data.data.email;             
            this.navCtrl.push(InvitecodePage, {icode,emailid});
          }     
        },
        err => {
          //this.showLoader = false;
          loader.dismiss();
          alert("error :" +JSON.stringify(err));
        });
      });       
    }
  }
  ionViewDidEnter() {
    this.menu.swipeEnable(false, 'menu1');
  }
}









