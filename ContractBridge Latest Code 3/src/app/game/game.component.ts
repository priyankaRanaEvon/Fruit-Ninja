import { Component, OnDestroy, OnInit ,HostListener, ViewChild} from '@angular/core';
import * as Phaser from 'phaser';
import { GameScreen } from '../phaserscreens/game-screen';
import { SocketconnectionService } from '../services/socketconnection.service';
import { ModelLocator } from '../ModelLocator/ModelLocator';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PlayerjoinService } from '../services/playerjoin.service';
import { MessagePopupComponent } from '../message-popup/message-popup.component';
import { LocalDBService } from '../services/local-db.service';
import { map } from 'rxjs/operators';



declare function leaveGame(element: any): any;



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  providers: [GameScreen]
})
export class GameComponent implements OnInit  {
 
  // Extends: Phaser.Scene 
  constructor(private gameScreen: GameScreen, private socketsvc: SocketconnectionService, 
    public model: ModelLocator, public router: Router, public playerJoinService: PlayerjoinService,
    public localDb: LocalDBService) { }
  protected gamePlaySubscriptions: Subscription[] = [];
  private game: any;
  public readonly phaser = Phaser;
  public gameLoaded = true;
  public playersInGame:string = '';
  public playersNotInGame = '';
  public message = '';
  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;

  public timeInterval:any;


  

  // call this event handler before browser refresh
  @HostListener("window:beforeunload", ["$event"])beforeunloadHandler(event: Event) {

    console.log("Processing beforeunload...",);
    // this.model.showExitPopUp=true;
    // alert("Are you confirm to close")
    // return false;


  }


  //Phaser Setup;
  public readonly GameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      width: window.innerWidth * window.devicePixelRatio,
      height: window.innerHeight * window.devicePixelRatio,
      parent: 'game',
      enableDebug: false,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    renderer: Phaser.AUTO,
    enableDebug: false,
    scene: this.gameScreen,
    physics: {
      default: 'arcade',
    },
    backgroundColor: '#333333',
    banner: true
  }


  

  ngOnInit(): void {
    this.checkNetworkStatus();
    if (!this.model.userName && !this.model.userId) {
      // this.router.navigateByUrl("");
      
      this.router.navigateByUrl('', { skipLocationChange: false });
    }
    console.log("game component init")
    this.subscribeToGameEvents();
    this.game = new Phaser.Game(this.GameConfig);
    console.log("phaser created ", this.game)
    this.gameScreen.gameComponent = this;
    this.gameScreen.socketConnection = this.socketsvc;


   
    
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
  this.model.networkState=status;

  if(this.networkStatus){
    if(this.model.isReconnect){
      // this.model.messagePopupVisible=false;
      console.log("Need To  Reconnect",this.model.gameLoad);
      if(this.model.gameLoad){
      this.check();
      }
      else if(!this.model.gameLoad){
        // this.ngOnInit();
    //     this.game.scene.remove('GameScreen');
    // this.game.scene.remove('Background');
    // this.game.scene.remove('Table');
    // this.game.scene.remove('Cards');
    // this.game.scene.remove('BidPanel');
    // this.game.scene.remove('WinScreen');
    // this.game.scene.remove('Header');
    // this.game.scene.remove('GameTimer');
    // this.game.scene.remove('GameScreen');
    // this.game.destroy(true);
    //  this.GameConfig = {
    //   type: Phaser.AUTO,
    //   scale: {
    //     mode: Phaser.Scale.FIT,
    //     width: window.innerWidth * window.devicePixelRatio,
    //     height: window.innerHeight * window.devicePixelRatio,
    //     parent: 'game',
    //     enableDebug: false,
    //     autoCenter: Phaser.Scale.CENTER_BOTH
    //   },
    //   renderer: Phaser.AUTO,
    //   enableDebug: false,
    //   scene: this.gameScreen,
    //   physics: {
    //     default: 'arcade',
    //   },
    //   backgroundColor: '#333333',
    //   banner: true
    // }
//     console.log("game scene",this.game.scene,this.game.scene.scenes)
    this.game.registry.destroy();
this.game.events.off();
// console.log("game scene",this.game)


// this.game.scene.restart();

    // this.game = new Phaser.Game(this.GameConfig);
    this.subscribeToGameEvents();


      }
      
        console.log("Some player is offline",this.model.leavePlayerName)
      
      
    }
    else if(! this.model.isReconnect){
      console.log("Work normal");
    }
  }
  else if(! this.networkStatus){
    console.log("Network Is gone Reconnection is Active");
    this.model.isReconnect=true;
    // this.model.message="You are offline";
    // this.model.messagePopupVisible=true;
    
   

    // clearInterval(this.model.roomInterval)
    // this.model.blackBg=true;

  }
});
}





check(){
  var dataSession = this.localDb.getSessionData();
  console.log(dataSession, 'dataSessiondataSession');
  console.log("gameLoad",this.model.gameLoad);
  if(this.model.gameLoad){
    if (dataSession.length != 0) {
    this.socketsvc.reconnect(dataSession.roomId,dataSession.sessionId);

  }}
  else if(!this.model.gameLoad){
    console.log("gameLoad",this.model.gameLoad);
    // this.router.navigateByUrl('game', { skipLocationChange: false });
    

  }
}

  
  
  subscribeToGameEvents() {
    this.subscribeToPlayerJoin();
    this.subscribeToGameDestroy();
    // this.subscribeToMyTurn(); 
    // this.subscribeToNewCard();
    console.log("events subscribed")
  }
  subscribeToGameDestroy(){
    let temp=this.socketsvc.gameDestroy.subscribe((data)=>{
      console.log("disconneced",data);
      if(data){
        this.leaveGame();
      }
    })

  }

  subscribeToPlayerJoin() {
    console.log('subscribe to player join');
    let temp: Subscription;
    let playerInGame = false;

    // let self = this;
    temp = this.socketsvc.newPlayerInGameSo.subscribe((data) => {
      console.log("player joined ", data, this.model.allPlayers);
      if (data) {
        this.playersNotInGame = "Waiting for" + ": ";
        this.savePlayerData(data);
        this.model.joinGamePlayers.push(data.playerName);
        this.playersInGame = "Loaded for" + ": ";
        this.message = "Note: "
        for (var i = 0; i < this.model.playersInRoom.length; i++) {
          playerInGame = false
         
          for (var j = 0; j < this.model.joinGamePlayers.length; j++) {
            if (this.model.playersInRoom[i].userName == this.model.joinGamePlayers[j]) {
              console.log('the user', this.model.joinGamePlayers[j], 'is in the game');
              // this.playersInGame = this.playersInGame + ' ' + this.model.playersInRoom[i].userName;
              playerInGame = true;
            }
          }
          if (playerInGame) {
            this.playersInGame = this.playersInGame + "\n " + this.model.playersInRoom[i].userName + ',';
          }
          else {
            this.playersNotInGame = this.playersNotInGame + "\n " + this.model.playersInRoom[i].userName + ',';
            this.message = this.message + ' ' + this.model.playersInRoom[i].userName + ',';
          }
        }
        this.message = this.message + " must have the game screen in focus for the game to start.";
        // this.model.gamePlayers.push(data);
        console.log('these are the total player and joined players', this.model.allPlayers, this.model.joinGamePlayers, this.model.playersInRoom)
        this.playerJoinService.addPlayerToGame(data);
        if(this.model.joinGamePlayers.length>3){
          this.gameLoaded = false;
        }
        // this.playersNotInGame = message;
        // message = message + "\n \n" + 'To Join Game';
        // this.socketsvc.playerJoinGame.next(message);
        
      }
    });
    this.gamePlaySubscriptions.push(temp);
  }

 
  subscribeToNewCard() {
    let temp: Subscription;
    temp = this.socketsvc.newCard.subscribe((data) => {
      if (data) {
        console.log("player joined ", data);
        // this.playerJoinService.addPlayerToGame(data);
        this.socketsvc.newCard.next();
      }
    });
    this.gamePlaySubscriptions.push(temp);
  }

  subscribeToMyTurn() {

    let temp: Subscription;
    temp = this.socketsvc.myTurn.subscribe((data) => {
      if (data) {
        console.log("player joined ", data);
        // this.playerJoinService.addPlayerToGame(data);
        this.socketsvc.myTurn.next();
      }
    });
    this.gamePlaySubscriptions.push(temp);
  }

  startGame() {
    console.log("starting server game")
    this.socketsvc.connectToPhaserRoom();

    this.timeInterval= setInterval(()=>{this.checkingPing()},2000);

  }
  checkingPing(){
    // console.log("Checking Ping")
    let temp,check;
    if(this.model.checkingNetwork){


      // temp= this.socketsvc.gettingPing.subscribe((data)=>{
      //   console.log(data);

      this.model.checkingNetwork=false;  
    }
    else{
      if(this.model.gameLoad){console.log("Reconntion is active")
      this.check();}
    //   if(this.model.gameStarted){
    //     this.model.message="Your network is slow!"
    //   this.model.messagePopupVisible=true;
    // }
      
     
    }
    
    
  }
  

  public sendSelectedBidToServer(betNumber: any, betSuit: any) {
    console.log("sending bid from game comp");
    this.model.gameRoom.send("BID", { bid: betNumber, trump: betSuit });
  }

  public sendSelectedCard(card: any, index: any) {
    console.log("played server card sending ", card)
    this.model.gameRoom.send("CARD", { cardId: card, indexId: index });
  }
  public sendMessage(message: any) {
    this.model.gameRoom.send("CHAT", {
      text: message,
      type: "Sending Message"
    });
    console.log("Message sent");
  }


  savePlayerData(data: any) {
    let index, name;
    index = data.index;
    name = data.playerName
    // let temp={data.index : data.playerName}
    console.log("name and index", name, index)
    // this.model.playerData.push({index:name})

  }

  leaveGame() {
    clearInterval(this.timeInterval);

    this.socketsvc.gameWin.next();
    this.socketsvc.roundWin.next();
    this.socketsvc.pointsUpdate.next();
    this.socketsvc.setBid.next();
    this.socketsvc.newCard.next();
    this.socketsvc.updateCardStatus.next();
    this.socketsvc.getDummyPlayerCard.next();
    this.socketsvc.myPlayingTurn.next();
    this.socketsvc.playedCard.next();
    this.socketsvc.handWin.next();
    this.socketsvc.reDisrtibute.next();
    this.socketsvc.bidOptions.next();
    this.socketsvc.hideBidOptions.next();
    this.socketsvc.getDouble.next();
    this.socketsvc.getReDouble.next();
    this.socketsvc.bidWinner.next();
    this.socketsvc.newPlayerInGameSo.next();
    this.socketsvc.myTurn.next();
    this.model.gamePlayer = [];
    this.model.roomName = "";
    this.model.teamName = "";
    this.model.allPlayers = [];
    this.model.playersInRoom = [];
    this.socketsvc.leaveLobby.next();
    this.model.gameRoom.leave();
    this.socketsvc.nameDirection.next();
   
    this.model.BidEnable = [];
    this.model.Bidcount = 0;
    this.model.isBidPanel = false;
    this.model.showExitPopUp = false;
    this.model.handComplete = false;
    this.model.sortedArray = [];
    this.model.cardNewArray = [];
    this.model.areYouDummy = false;
    this.model.bidWin = false;
    this.model.playerData = [];
    this.model.joinGamePlayers = [];
    // this.model.blackBg = true;
    this.model.gameOver = false;
    this.model.showTimerPopup = false;
    this.model.bidDestroy = false;
    this.model.contractOnTable = false;
    this.model.contractBidText = ""
    this.model.contractBidSuit = '';
    this.model.messagePopupVisible = false;
    this.model.message = "";
    this.model.isTimer = false;
    this.model.wayofWin = "";
    this.model.leaveCount = 0;
    this.model.isReconnect = false;
    this.model.messageClose = false;
    this.model.nameCount=0;
    this.model.cardDistibuted=false;
    this.model.joinPrivateGame = false;
    this.model.isHost=false;
    this.model.leavePlayerName=[];
    this.model.checkingNetwork=false;
    this.model.youStats = "";
    this.model.oppoStats = "";
    this.model.loader=false;
    this.model.gameLoad=false;
    this.model.networkState=false;
     let data={"roomId":"","sessionId":""}
     this.localDb.setSessionData(data);
     
    



    // localStorage.clear();
    for (let subs of this.gamePlaySubscriptions) {
      subs.unsubscribe();
    }
    this.gamePlaySubscriptions = [];
    // this.registry.destroy();
    this.game.scene.remove('GameScreen');
    this.game.scene.remove('Background');
    this.game.scene.remove('Table');
    this.game.scene.remove('Cards');
    this.game.scene.remove('BidPanel');
    this.game.scene.remove('WinScreen');
    this.game.scene.remove('Header');
    this.game.scene.remove('GameTimer');
    this.game.scene.remove('GameScreen');
    this.game.destroy(true);
    // this.game = null;
    // this.soundService.startMusic();
    console.log("game destroyed ", this.game);
    this.router.navigateByUrl('', { skipLocationChange: false });
  }


}
