import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerjoinService {
  static instance: PlayerjoinService;
  public newPlayerInGame: Subject<any> = new Subject<any>();

  constructor() { 
    if(PlayerjoinService.instance == undefined || PlayerjoinService.instance == null ) 
    {
      PlayerjoinService.instance = this;
    }
  }

  addPlayerToGame(data:any) {
    console.log("setting value");
    this.newPlayerInGame.next(data);
  } 
}
