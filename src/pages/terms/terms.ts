import { Component } from '@angular/core';
import { NavController , Platform} from 'ionic-angular';
import { AppMinimize } from '@ionic-native/app-minimize';


@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html'
})
export class TermsPage {



  constructor(public navCtrl: NavController, private appMinimize: AppMinimize, public platform: Platform) {
 
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