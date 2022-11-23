import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalDBService {

  constructor() { }
  public getSessionData() {
    let arr = Array();
    var a: any = localStorage.getItem("SessionDb");
    let localStorageItem = JSON.parse(a);
    return localStorageItem == null ? arr : localStorageItem.id;
  }

  session_id ={};
  public setSessionData(data:any) {
    this.session_id = this.getSessionData();
    console.log(this.session_id,"this.session_id");
    this.session_id = {'roomId':data.roomId,"sessionId":data.sessionId };
    console.log(this.session_id,"this.session_idcccccccc");
    localStorage.setItem('SessionDb',JSON.stringify({id: this.session_id}));
  }

  // public setChecks(data:any){
  //   localStorage.setItem('cards',data);

  // }
}
