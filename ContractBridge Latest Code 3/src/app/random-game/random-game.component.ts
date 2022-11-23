import { Component, OnInit ,HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { SocketconnectionService } from '../services/socketconnection.service';
import { ModelLocator } from '../ModelLocator/ModelLocator';
import { fromEvent, merge, of, Subscription } from 'rxjs';
import { LocalDBService } from '../services/local-db.service';
import { map } from 'rxjs/operators';

// declare function sendUserData(element:any):any;

@Component({
  selector: 'app-random-game',
  templateUrl: './random-game.component.html',
  styleUrls: ['./random-game.component.css']
})



export class RandomGameComponent implements OnInit {
  protected subscriptions: Subscription[] = [];
  players:any;  lobby:any = null;
  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;

  
  

  // playerName1:any;playerName2:any;playerName3:any;playerName4:any;
  constructor(public router:Router, public socketsvc:SocketconnectionService, public model:ModelLocator,public localDB:LocalDBService) { 
    this.subscribeToEvents()
  }

  ngOnInit(): void {
  //  this.checkNetworkStatus();
   
    // const userObj = {
    //   userName: "contractBridge",
    //   dbId: Math.floor(Math.random() * 10000)
    // };

    // sendUserData(userObj);
    
   
  }
  ngOnDestroy(): void {
    this.networkStatus$.unsubscribe();
  }
   // To check internet connection stability
checkNetworkStatus() {
  this.networkStatus = navigator.onLine;
  this.networkStatus$ = merge(
    of(null),
    fromEvent(window, 'online'),
fromEvent(window, 'offline')
)
.pipe(map(() => navigator.onLine))
.subscribe(status => {
      console.log('status', status);
  this.networkStatus = status;

  if(this.networkStatus){
    if(this.model.isReconnect){
      console.log("Need To  Reconnect");
      this.check();
      
    }
    else if(! this.model.isReconnect){
      console.log("Work normal");
    }
  }
  else if(! this.networkStatus){
    console.log("Network Is gone Reconnection is Active");
    this.model.isReconnect=true;

    // clearInterval(this.model.roomInterval)
    // this.model.blackBg=true;

  }
});
}

  // @HostListener('window:userDetails', ['$event'])
  // Onsuccess(event:any): void {
  //   console.log(event.detail);
  //   this.model.userName = event.detail.userName;
  //   this.model.userId = event.detail.dbId;
  //   this.JoinRandom();
  // }

  check(){
    var dataSession = this.localDB.getSessionData();
    console.log(dataSession, 'dataSessiondataSession');
    if (dataSession.length != 0) {
      // this.socketsvc.lobbyReconnect(dataSession.lobbyId,dataSession.lobbySessionId);

    }

    
  }

  JoinRandom() {
 

    if (!this.model.userName && !this.model.userId) {
      this.model.userName = prompt("Please enter your name:");
      this.model.userId = prompt("Please enter your dbId:");
    }
    // this.model.showTimerPopup=true;
    // let userObj = {
    //   userName: this.model.userName,
    //   coin: 100,
    //   avatar: "1",
    //   dbId: Number(this.model.userId),
    //   mode: 'normal'
    // }

    // this.socketsvc.connectServer(userObj);
    // this.router.navigateByUrl('random-game');
  }

  JoinGame() {
    if (!this.model.userName && !this.model.userId) {
      this.model.userName = prompt("Please enter your name:");
      this.model.userId = prompt("Please enter your dbId:");
    }
    this.model.joinPrivateGame = true;
  }

  CreateGame() {
    if (!this.model.userName && !this.model.userId) {
      this.model.userName = prompt("Please enter your name:");
      this.model.userId = prompt("Please enter your dbId:");
    }
    let userObj = {
      userName: this.model.userName,
      coin: 100,
      avatar: "1",
      dbId: Number(this.model.userId),
      mode: 'normal'
    }
    this.socketsvc.connectServerFriend(userObj);
    this.router.navigateByUrl('new-game');
  }

  subscribeToEvents() {
    this.subscribeToLobbyObject();
    this.subscribeToGameStart();
  }


  subscribeToLobbyObject() {
    console.log("subscribetolobby")
    let temp: Subscription;
    let data;
    temp = this.socketsvc.setLobbyObject.subscribe((lobby: any) => {
      console.log("subscribetolobby",lobby)
      this.lobby = lobby;
      this.model.roomName = lobby.name;
      data={"lobbyId":lobby.id,"lobbySessionId":lobby.sessionId}
      this.localDB.setSessionData(data);
    });
    this.subscriptions.push(temp);
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
    // this.model.joinGamePlayers = this.model.playersInRoom;
    this.router.navigateByUrl('/game', { skipLocationChange: false });
  }
  leaveLobby(){
    this.lobby.leave();
    this.model.playersInRoom = [];
    localStorage.clear();
    this.router.navigateByUrl('', { skipLocationChange: false });
  }

}
