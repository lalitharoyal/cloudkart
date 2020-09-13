import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';


@Component({
  selector: 'page-popup-avatar',
  templateUrl: 'popup-avatar.html'
})
export class PopupAvatarPage {
  images: string[];	
  avatarGrid: any[];
  selected_image: any;
  streetName: any;

  constructor(public navCtrl: NavController,
    public navParams : NavParams,
    public viewCtrl : ViewController) {

    this.images = [ 'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/2015-11-06benatky-maska-10-radynacestu-pavel-spurek-2015.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/Cheche.JPG',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/EFatima_in_UAE_with_niqab.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/Jackie_Martinez_with_a_mask.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/Nefertiti_30-01-2006.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/RBCM_-_Haida_old_woman_mask.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/Woman_in_rabbit_mask_and_nude.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/art-739658_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/avatar-769056_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/body-2976731_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/butterflies-2346164_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/carneval-3094815_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/carnival-2313234_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/carnival-2999783_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/carnival-3075912_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/carnival-3633589_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/carnival-411494_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/carnival-costume-masquerade-59826.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/child-188655_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/costume-3061807_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/download+(1).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/download+(2).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/download+(3).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/download.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/face-1013518_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/face-486707_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/fashion-3043754_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/fashion-3157027_960_720.jpg',                  
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/gas-mask-2343654_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/girl-689137_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/gothic-2097966_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/gothic-3166762_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/gothic-3396372_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/hair-3697439_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/hat-1540582_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(1).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(10).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(11).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(12).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(13).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(1a).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(2).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(3).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(5).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(6).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(7).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(8).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images+(9).jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/images.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/lick-2378544_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-1269102_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-141740_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-185992_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2028211_960_720.png',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2313237_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2321301_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2378574_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2424137_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2454442_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2483080_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2483082_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2506059_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-2872819_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/mask-3035037_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/maska2.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/painted.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/pexels-photo-190589.jpeg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1498954238841-25f28eeeff60.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1510933844587-60d4a40d74dd.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1512870020808-19a2edae0477.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1513774497165-501460a8a88c.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1517242296655-0a451dd85b30.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1518882300677-48cc76cc8463.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1519070813808-1d7a33907487.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1520748799498-9c879574ec7b.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/photo-1524499982521-1ffd58dd89ea.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/portrait-2616767_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/portrait-3204955_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/thumb-350-288090.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/venice-2100155_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/venice-3403623_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/venice.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/woman-2060851_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/woman-2086453_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/woman-2126955_960_720.png',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/woman-3422895_960_720.jpg',
                    'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/woman-3600521_960_720.jpg'
                  ];
    this.selected_image = this.navParams.get('image');
    this.streetName = this.navParams.get('avatarName');
    this.avatarGrid = Array(Math.ceil(this.images.length/3)); //MATHS!
    let rowNum = 0; //counter to iterate over the rows in the grid
    for (let i = 0; i < this.images.length; i+=3) { 
      this.avatarGrid[rowNum] = Array(3); //declare two elements per row
      if (this.images[i]) { //check file URI exists
        this.avatarGrid[rowNum][0] = this.images[i] ; //insert image
      }
      if (this.images[i+1]) { //repeat for the second image
        this.avatarGrid[rowNum][1] = this.images[i+1] ;
      }
      if (this.images[i+2]) { //repeat for the third image
        this.avatarGrid[rowNum][2] = this.images[i+2] ;
      }
      rowNum++; //go on to the next row
    }
  }

  chooseMask(value, idx){
    this.selected_image = value;     
  }
  street_name(value){
    if(value) {
      this.streetName = value.trim(" ");
    }        
  }
  next(id, img){
    let data = {"image" : img ,
                "avatarName" : this.streetName};
    this.viewCtrl.dismiss(data);
  }
     
}
