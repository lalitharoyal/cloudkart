import { Injectable, VERSION, ElementRef,Renderer2, ViewChild} from '@angular/core';
import 'rxjs/add/operator/map';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Storage } from '@ionic/storage';
//import { MyApp } from '../../app/app.component';
import 'rxjs/Rx';

@Injectable()
export class UserInterestService {

  @ViewChild('fileInput') el:ElementRef;

   data: any;
   data1: any;
    message2 : any;
    attachPic :any;
    tkn_sb : any;
    API_ENDPOINT :any;
    
  
  constructor(public http: Http,private storage: Storage) {

 this.API_ENDPOINT='https://c8nzq7klb6.execute-api.us-east-1.amazonaws.com/dev';
  //this.API_ENDPOINT='https://ur9wxaaufb.execute-api.us-east-1.amazonaws.com/testing';

      this.storage.get('sbtkn').then((val) => {
        this.tkn_sb = val;
      });
  }


  load() {
    if (this.data) {
      
      return Promise.resolve(this.data);
    }
  
  return new Promise(resolve => {

    this.http.get('assets/interests.json')
      .map(res => res.json())
      .subscribe(data => {
        
        this.data = data.data.preferences;
      
        resolve(this.data);
      });
  });
}

 fileuploadGlobal(fileupload) {

        
    this.message2 = "File type :"+fileupload.type;

let headers = new Headers( );
  
     headers.append( 'Content-Type','application/json');

     let options = new RequestOptions({
                headers: headers
                
            });

            let body = {

            "content_type": this.message2,
             
            }
    return new Promise(resolve => {

    this.http.post(this.API_ENDPOINT+'/util/upload_url/create',body,options)
         .map(res => res.json())
        .subscribe(data => {

          let url = data.data.upload_url;
          this.attachPic = data.data.download_url;

          resolve(this.attachPic);

          let headers = new Headers();
  
        
   headers.append( 'Content-Type',this.message2 );

    let options = new RequestOptions({
                headers: headers
                
            }); 

            
          this.http.put(url,fileupload,options)
         .map(res => res.json())
        .subscribe(data => {

                         },
        err => {});
       }); 

       }); 
  }

globalLike(id) {

//console.log(id);

   let headers = new Headers( );
  
     headers.append( 'Content-Type','application/json');
   headers.append( 'Accept', 'application/json');
   headers.append( 'token', this.tkn_sb);
    
        let options = new RequestOptions({
                headers: headers
                
            });

     return new Promise(resolve => {

    this.http.post(this.API_ENDPOINT+'/story/'+id+'/like',{},options)
         .map(res => res.json())
        .subscribe(data => {
            
      if(data.status == true) {

      let post_story = data.data;
      resolve(post_story);
     // console.log(post_story);
          
          }     
            },
            err => {

            }); 

             });  

}

globalUnlike(id : any){
  
   let headers = new Headers();
  
     headers.append( 'Content-Type','application/json');
   headers.append( 'Accept', 'application/json');
   headers.append( 'token', this.tkn_sb);
    
        let options = new RequestOptions({
                headers: headers
                
            });

    return new Promise(resolve => {

    this.http.post(this.API_ENDPOINT+'/story/'+id+'/unlike',{},options)
         .map(res => res.json())
        .subscribe(data => {
            //  alert("data :"+ JSON.stringify(data));

      if(data.status == true) {

        let post_story = data.data;
        resolve(post_story);
          
          }     
            },
            err => {

        //   alert("Error :" + JSON.stringify(err));
            
            }); 

        });  

}

globalUnfollow(id : any){
  
  let headers = new Headers( );
  
     headers.append( 'Content-Type','application/json');
   headers.append( 'Accept', 'application/json');
   headers.append( 'token', this.tkn_sb);
    
        let options = new RequestOptions({
                headers: headers
                
            });

            return new Promise(resolve => {

    this.http.post(this.API_ENDPOINT+'/story/'+id+'/unfollow',{},options)
         .map(res => res.json())
        .subscribe(data => {
            //  alert("data :"+ JSON.stringify(data));

      if(data.status == true) {

        let post_story = data.data;
        resolve(post_story);
          
          }     
            },
            err => {

           console.log("Error :" + JSON.stringify(err));
            
            });

        });    

}

globalFollow(id) {
  
  let headers = new Headers( );
  
     headers.append( 'Content-Type','application/json');
   headers.append( 'Accept', 'application/json');
   headers.append( 'token', this.tkn_sb);
    
        let options = new RequestOptions({
                headers: headers
                
            });

            return new Promise(resolve => {

    this.http.post(this.API_ENDPOINT+'/story/'+id+'/follow',{},options)
         .map(res => res.json())
        .subscribe(data => {
            //  alert("data :"+ JSON.stringify(data));

      if(data.status == true) {
      
      let post_story = data.data;
      resolve(post_story);
          
          }     
            },
            err => {

        //   alert("Error :" + JSON.stringify(err));
            
            });

        });    

}

}


