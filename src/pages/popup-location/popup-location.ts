import { Component,NgZone} from '@angular/core';
import {  NavController, NavParams, ViewController, AlertController, LoadingController, PopoverController} from 'ionic-angular';
import {SimpleGlobal} from 'ng2-simple-global';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Storage } from '@ionic/storage';
import { MyApp } from '../../app/app.component';
//import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
declare var google;
@Component({
  selector: 'page-popup-location',
  templateUrl: 'popup-location.html',
})
export class PopupLocationPage {
  //mylocation : boolean = true;
  location : any;
  specificLocation:any; statusUpdate:any;
  popup:any;
  selected_image : string;
  locationObj:any;
  places:any;
  myInterests=[];
  httpOptions = {};
  nearMe:any;
  current_address = {};

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public sg: SimpleGlobal,
    private storage: Storage, 
    private http: Http,
    private zone: NgZone,
    public alertCtrl: AlertController,
    public loadingCtrl : LoadingController,
    public popoverCtrl : PopoverController) {
   // this.initialiseItems();        
  }
  ionViewDidEnter() {
    this.myInterests = this.navParams.get('interests');
    this.statusUpdate = "detect automatically";
    this.sg['city'] = null;
    this.sg['specificcity'] = null;
    this.sg['currentcity'] = null;
    this.sg['specific_location'] = null;     
    this.sg['locationStatus'] = 'current';
    this.storage.get('sbtkn').then((val) => {     
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','tenaAcceptnt':'application/json', 'token': val })
      };
    });
  }
  fetchMyLocation(value) {
    this.statusUpdate = "detecting...";
    if(value == 'specific'){
      this.zone.run(() => {
        this.sg['locationStatus'] = 'specific';
      });             
    }
    else {
      this.zone.run(() => {
        this.sg['locationStatus'] = 'current';
      });  
    }        
      var that = this;    
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      }  
      function showPosition(position) {
        /*let loader = that.loadingCtrl.create({
          spinner: 'dots',
          content: 'Fetching your location'      
        });
        loader.present().then(() => { */     
        var location = [];       
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //var latlng = new google.maps.LatLng("1.3330761", "103.74363390000008");
        var geocoder = geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              var temp = results[0].formatted_address;
              that.zone.run(() => {
                console.log(results[0]);
                //loader.dismiss();           
                location = temp.split(",");
                var count = location.length;
                //that.sg['city'] = location;                                      
                that.current_address = {
                  'country':null,
                  'name': null,
                  'city':null,
                  'components':{},
                  'sublocality':null
                };
                that.current_address['components'] = results[0];
                var geocoder = new google.maps.Geocoder;                
                  if(location && location.length == 1){
                    that.current_address['country'] = location[0].trim(" ");
                    that.sg['city'] = location[0].trim(" ");
                    //that.sg['selectedCity'] = location[0].trim(" "); 
                  }
                  else if(location && location.length == 2){
                    that.current_address['country'] = location[1].trim(" ");
                  // that.current_address['state'] = location[0].trim(" ");
                    that.sg['city'] = location[0].trim(" ")+', '+location[1].trim(" "); 
                    //that.sg['selectedCity'] = location[0].trim(" ")+', '+location[1].trim(" "); 
                  }
                  else if(location && location.length == 3){
                    that.current_address['country'] = location[2].trim(" ");               
                    that.current_address['city'] = location[0].trim(" ");
                    that.sg['currentcity'] =  location[0].trim(" ");
                    that.sg['city'] = location[0].trim(" ")+', '+location[1].trim(" ")+' ...'; 
                    //that.sg['selectedCity'] = location[0].trim(" ")+', '+location[1].trim(" ")+' ...';              
                  }
                  else if(location && location.length > 3){
                    let count = location.length;
                    that.current_address['country'] = location[count-1].trim(" ");               
                    that.current_address['city'] = location[count-3].trim(" ");
                    that.sg['currentcity'] =  location[count-3].trim(" "); 
                    that.current_address['sublocality'] = location[count-4].trim(" ");
                    that.sg['city'] = location[count-4].trim(" ")+', '+location[count-3].trim(" ")+' ...'; 
                    //that.sg['selectedCity'] = location[count-4].trim(" ")+', '+location[count-3].trim(" ")+' ...'; 
                  }                
                })
              }          
            }          
          });
        //});
        //alert(that.current_address);
      }   
    }
  
   /* location functionality*/ 

  selectLocation(value){   
    if(value == 'specific'){
      this.zone.run(() => {
        this.sg['locationStatus'] = 'specific';
      });             
    }
    else {
      this.zone.run(() => {
        this.sg['locationStatus'] = 'current';
      });  
    }
  }  
  detail(event){    
    //this.locationObj = event;
    //this.specificLocation = event.description;
    this.sg['specific_location'] = event.description;    
  }
  done(){
    this.zone.run(() => {      
      if(this.sg['locationStatus'] == 'specific'){
        let location = []; 
        let address = {
          'country':null,
          'name': null,
          'city':null,
          'components':{},
          'sublocality':null
        };        
        var geocoder = new google.maps.Geocoder;
        location = this.sg['specific_location'].split(",");
        //this.sg['selectedCity'] = this.sg['specific_location'];
          if(location && location.length == 1){
            address['country'] = location[0].trim(" ");
            this.sg['city'] = location[0].trim(" ");
          }
          else if(location && location.length == 2){
            address['country'] = location[1].trim(" ");
            address['state'] = location[0].trim(" ");
            this.sg['city'] = location[0].trim(" ")+', '+location[1].trim(" ");
          }
          else if(location && location.length == 3){
            address['country'] = location[2].trim(" ");            
            address['city'] = location[0].trim(" ");
            this.sg['specificcity'] = location[0].trim(" ");
            this.sg['city'] = location[0].trim(" ")+', '+location[1].trim(" ")+' ...';            
          }
          else if(location && location.length > 3){
            let count = location.length;
            address['country'] = location[count-1].trim(" ");            
            address['city'] = location[count-3].trim(" ");
            this.sg['specificcity'] = location[count-3].trim(" ");
            address['sublocality'] = location[count-4].trim(" ");
            this.sg['city'] = location[count-4].trim(" ")+', '+location[count-3].trim(" ")+' ...'; 
          }
          address['name'] = this.specificLocation;          
          let that = this;   
          geocoder.geocode({'placeId': that.locationObj.place_id}, function(results, status) {
            if (status === 'OK') {
              if (results[0]) {                  
                address['components'] = results[0];
                let loader = that.loadingCtrl.create({
                  spinner: 'dots',
                  content: 'Updating your location'      
                });
                loader.present().then(() => {
                  that.http.post(MyApp.API_ENDPOINT+'/user/location/update', address, that.httpOptions).map(res => res.json()).subscribe(data => {                    
                    that.sg['selectedCity'] = that.sg['city'];
                    that.sg['showLocationOption'] = false;          
                    if(that.myInterests && that.myInterests.length > 1){
                      that.sg['showInterestOption'] = false;        
                    }
                    else {
                      that.sg['showInterestOption'] = true;        
                    }
                    loader.dismiss();
                    that.viewCtrl.dismiss(that.sg['selectedCity']);                    
                  }, 
                  err => {                  
                    that.sg['selectedCity'] = null;
                    loader.dismiss();
                    that.viewCtrl.dismiss(that.sg['selectedCity']);                  
                    let error = JSON.parse(err._body);        
                    let alert = that.alertCtrl.create({
                      title: "Alert",        
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
          });
        }
      else {
        //this.sg['selectedCity'] = this.sg['city'];
        let loader = this.loadingCtrl.create({
          spinner: 'dots',
          content: 'Updating your location'      
        });
        loader.present().then(() => {        
          this.http.post(MyApp.API_ENDPOINT+'/user/location/update', this.current_address, this.httpOptions).map(res => res.json()).subscribe(data => {
            this.sg['selectedCity'] = this.sg['city'];
            this.sg['showLocationOption'] = false;          
            if(this.myInterests && this.myInterests.length > 1){
              this.sg['showInterestOption'] = false;        
            }
            else {
              this.sg['showInterestOption'] = true;        
            }
            loader.dismiss();
            this.viewCtrl.dismiss(this.sg['selectedCity']);
          }, 
          err => {
            loader.dismiss();
            this.sg['selectedCity'] = null; 
            this.viewCtrl.dismiss(this.sg['selectedCity']);         
            let error = JSON.parse(err._body);        
            let alert = this.alertCtrl.create({
              title: "Alert",
              enableBackdropDismiss:false,        
              message: error.error.message,
                buttons: [{
                  text: 'OK',
                  handler: () => {
                    //this.fetchMyLocation(this.sg['locationStatus']);                   
                  }
                }]
            });
            alert.present(); 
          });
        });  
      }       
      
    });         
  }
  getItems(event) {
    this.zone.run(() => {    
      let body = {
        "query" : event.target.value
      }
      this.http.post(MyApp.API_ENDPOINT+'/util/google/location/suggestions', body).map(res => res.json()).subscribe(data => {
        this.places = data.data.predictions;
        //alert("Succeeded with google autocomplete service:"+JSON.stringify(data.predictions));
        console.log("Succeeded with google autocomplete service:"+JSON.stringify(data.predictions));
      }, err => {
          //alert("Error with google autocomplete service:"+JSON.stringify(err));
          console.log("Error with google autocomplete service:"+JSON.stringify(err));
      });
    });            
  }
  selectedPlace(selectedPlace){
    this.zone.run(() => {
      this.locationObj = selectedPlace;
      this.sg['specific_location'] = selectedPlace.description;
      this.places = null;
    });  
  }
     
}
