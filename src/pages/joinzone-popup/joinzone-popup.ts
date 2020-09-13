import { Component } from '@angular/core';
import { NavController, NavParams,App, ViewController, AlertController,ToastController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { MyApp } from '../../app/app.component';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {SimpleGlobal} from 'ng2-simple-global';
import { ZoneTimelinePage } from '../zoneTimeline/zoneTimeline';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-joinzone-popup',
  templateUrl: 'joinzone-popup.html',
})
export class JoinzonePopupPage {
  activatePadding : boolean = true;
  httpOptions = {};
  tkn_sb: any;
  inviteCode:any;
  zoneInfo: any;
  inviteForm : FormGroup;
  submitAttempt: boolean = false;
  errorMessage: any;
  constructor(public sg: SimpleGlobal,fb: FormBuilder,
    public viewCtrl : ViewController,
    public alertCtrl : AlertController,
    public app: App,public navCtrl: NavController, public toastCtrl: ToastController, 
    public navParams: NavParams, private http: Http,public loadingCtrl: LoadingController, private storage: Storage) {

      this.storage.get('sbtkn').then((val) => {
        this.tkn_sb = val;
      });
      this.inviteForm = fb.group({
        code : ['', Validators.required]              
      });  
  }
  
  joinZone(){
    //this.viewCtrl.dismiss();
    if(this.inviteForm.valid){
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Loading'  
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
          "invite_code":  this.inviteCode      
        }          
        this.http.post(MyApp.API_ENDPOINT+'/zone/join',body,options).map(resp => resp.json()).subscribe(data => {
          loader.dismiss();
          this.errorMessage = '';
          let zoneId = data.data.zone.id;
          let message = data.data.message;
          let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position : "middle"
          });
          toast.present();          
          let data1 = {
            'invite' : 'success',
            'succs_msg':message,
            'id': zoneId,
          }
          this.viewCtrl.dismiss(data1); 
          // this.navCtrl.setRoot(ZoneTimelinePage , { 'page' : "joinZone", 'succs_msg':message});          
        }, err => {
          loader.dismiss();
          let error = JSON.parse(err._body);        
          this.errorMessage = error.error.message;
          //console.log(this.errorMessage);
        });
      }); 
    }
  }

}
