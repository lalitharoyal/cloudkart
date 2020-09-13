import { Component } from '@angular/core';
import { NavController, Platform, AlertController} from 'ionic-angular';
import { AppMinimize } from '@ionic-native/app-minimize';
import { MyApp } from '../../app/app.component';
//import { GooglePlacesAutocompleteComponentModule } from 'ionic2-google-places-autocomplete';

@Component({
  selector: 'page-test',
  templateUrl: 'test.html'
})
export class TestPage {
  end: number;
  start: number;
 
  
  constructor(public navCtrl: NavController, 
    private appMinimize: AppMinimize, 
    public platform: Platform,              
    public alertCtrl :AlertController ) { 		
    this.platform.registerBackButtonAction(() => {
      if(this.navCtrl.canGoBack()){
        this.navCtrl.pop();
      }
      else {         
        this.appMinimize.minimize();
      }         
    });  
      
  }

  
   
}