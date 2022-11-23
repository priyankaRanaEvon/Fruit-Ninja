import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModelLocator } from '../ModelLocator/ModelLocator';
import { SocketconnectionService } from '../services/socketconnection.service';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent implements OnInit {
  protected subscriptions: Subscription[] = [];
  players:any;  lobby:any = null;

  constructor(public router:Router, public model:ModelLocator, public socketsvc:SocketconnectionService) { 
    this.subscribeToEvents();
  }

  ngOnInit(): void {
  }


   subscribeToEvents() {
    this.subscribeToLobbyObject();
    this.subscribeToGameStart();
  }

  subscribeToLobbyObject() {
    console.log("subscribetolobby")
    let temp: Subscription;
    temp = this.socketsvc.setLobbyObject.subscribe((lobby: any) => {
      console.log("subscribetolobby",lobby)
      this.lobby = lobby;
      this.model.roomName = lobby.name;
    });
    this.subscriptions.push(temp);

    temp = this.socketsvc.startPrivateRoom.subscribe((data) => {
      this.lobby.send('PLAYER_JOINED', {message: 'hello'});
    });
    this.subscriptions.push(temp);
  }
  
  close(){
    this.lobby.leave();
    this.model.playersInRoom = [];
    this.model.gamePlayer = [];
    this.model.joinPrivateGame = false;
    this.router.navigateByUrl('', { skipLocationChange: false });
  }

  subscribeToGameStart() {
    let temp: Subscription;
    console.log("subscribetogamestart")
    temp = this.socketsvc.leaveLobby.subscribe((data) => {
      console.log(data,"data");
      if(data) {
        console.log("game start listened ", data, this.lobby);
        this.startGameRoom();
      }
    });
    this.subscriptions.push(temp);
  }

  startGameRoom() {
    for (let subs of this.subscriptions) {
      subs.unsubscribe();
    }
    this.subscriptions = [];
    // this.model.playersInRoom = [];
    this.router.navigateByUrl('/game', { skipLocationChange: false });
  }

}
