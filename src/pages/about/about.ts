import { Component } from '@angular/core';
import { NavController, Platform, AlertController} from 'ionic-angular';
import { AppMinimize } from '@ionic-native/app-minimize';
import { MyApp } from '../../app/app.component';
//import { GooglePlacesAutocompleteComponentModule } from 'ionic2-google-places-autocomplete';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  end: number;
  start: number;
  sub_category:any;
  harvest_categories:any;
  category : any;
  
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
      this.initilizedata();
  }

  initilizedata() {
    this.harvest_categories  = [{
      "cat_name": "Vegetables",
        "cat_id":0,
      "subcat_names": [{
        "name": "Onion",
        "cat_id":0,
      }, {
        "name": "Potato",
        "cat_id":0
        
      }, {
        "name": "Tomato",
        "cat_id":0
      }, {
        "name": "Cauliflower",
        "cat_id":0
      }, {
        "name": "Ladies Finger",
        "cat_id":0
      }, {
        "name": "Carrot",
        "cat_id":0
      }],
    
      "Uom": [{
        "name": "Kg",
        "cat_id":0
      }, {
        "name": "No",
        "cat_id":0
      }, {
        "name": "Ltr",
        "cat_id":0
      }]
    }, {
      "cat_name": "Fruits",
      "cat_id":1,
      "subcat_names": [{
          "name": "Apple",
          "cat_id":1,
        },
        {
          "name": "Akee",
          "cat_id":1
        },
    
        {
          "name": "Banana",
          "cat_id":1
        },
        {
          "name": "Bilberry",
          "cat_id":1
        },
        {
          "name": "Blackberry",
          "cat_id":1
        }
      ],
      "Uom": [{
        "name": "Kg",
        "cat_id":1
      }, {
        "name": "No",
        "cat_id":1
      }, {
        "name": "Ltr",
        "cat_id":1
      }]
    
    }, {
      "cat_name": "Crops",
      "cat_id":2,
      "subcat_names": [{
          "name": "Wheat",
          "cat_id":2,
        },
        {
          "name": "Barley",
          "cat_id":2,
        },
        {
          "name": "Oat",
          "cat_id":2,
        },
        {
          "name": "Corn",
          "cat_id":2,
        },
        {
          "name": "Rye",
          "cat_id":2,
        }
    
      ],
      "Uom": [{
        "name": "Kg",
        "cat_id":2,
      }, {
        "name": "No",
        "cat_id":2,
      }, {
        "name": "Ltr",
        "cat_id":2,
      }]
    
    }, {
      "cat_name": "Greens",
      "cat_id":3,
      "subcat_names": [{
          "name": "Arugula",
          "cat_id":2,
        },
        {
          "name": "Bok Choy",
          "cat_id":2,
        },
        {
          "name": "Broccoli",
          "cat_id":2,
        },
        {
          "name": "Broccoli Rabe",
          "cat_id":2,
        },
        {
          "name": "Endive",
          "cat_id":2,
        }
    
    
      ],
      "Uom": [{
        "name": "Kg",
        "cat_id":2,
    
      }, {
        "name": "No",
        "cat_id":2,
    
      }, {
        "name": "Ltr",
        "cat_id":2,
    
      }]
    
    }]
    }
  
   
}