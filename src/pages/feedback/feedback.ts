import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppMinimize } from '@ionic-native/app-minimize';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {

	tkn_sb : any;
	feedbackForm : FormGroup;
	submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, private http: Http, private storage: Storage, public loadingCtrl: LoadingController, fb: FormBuilder, private alertCtrl: AlertController, private appMinimize: AppMinimize, 
  public platform: Platform) {
     
     this.storage.get('sbtkn').then((val) => {
          this.tkn_sb = val;
    });

    this.feedbackForm = fb.group({
         feature : ['', Validators.required],
         feedback : ['', Validators.required]                  
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
 
  submit(){

  	this.submitAttempt = true;
 
    if(this.feedbackForm.valid){

  	let headers = new Headers( );
  
     headers.append( 'Content-Type','application/json');
   headers.append( 'Accept', 'application/json');
  	headers.append( 'token', this.tkn_sb);
    let options = new RequestOptions({
                headers: headers                
            });
    let body = {

       		"feature": this.feedbackForm.value.feature,
			"feedback": this.feedbackForm.value.feedback
    }        

    this.http.post(MyApp.API_ENDPOINT+'/user/feedback',body,options)
         .map(res => res.json())
        .subscribe(data => {
        	let alert = this.alertCtrl.create({
                message: "Many thanks, got your feedback!",
                buttons: [{
                    text: 'OK',
                    handler: () => {
                    let page = "menu";
                    this.navCtrl.setRoot(TabsPage, {page});                        
                    }
                }]
            });
           alert.present();          
        },
        err => {
        	console.log(err);
        });

    }    
  }
  

}