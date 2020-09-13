import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PeopleService {

  public items: any[];

  constructor(public http: Http) {
    this.items;
  }

 /* load(){
    this.http.get('assets/data/names.json')
    .map(res => res.json())
    .subscribe(
      data => {
        this.names = data;
        console.log(this.names);
        return Promise.resolve(this.names)
      },
      err => {
          console.log("it's seems like there is no users here !");
      }
    );
  }*/

  
  load() {
  if (this.items) {
    
    return Promise.resolve(this.items);
  }

  // don't have the data yet
  return new Promise(resolve => {

    this.http.get('https://randomuser.me/api/?results=10')
      .map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.items = data.results;
        //console.log(this.items);
        resolve(this.items);
      });
  });
}



}


