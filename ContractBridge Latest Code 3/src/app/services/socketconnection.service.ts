import { Injectable } from '@angular/core';
import { Client } from 'colyseus.js';
import { ModelLocator } from '../ModelLocator/ModelLocator';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { playersvo } from '../vo/playersvo';
import { LocalDBService } from './local-db.service';



@Injectable({
  providedIn: 'root'
})
export class SocketconnectionService {
  client: any;
  currentGameStatus: any = "NONE";
  localData: any;

  public pointsUpdate: ReplaySubject<{ [key: string]: string; }>;
  public handWin: ReplaySubject<{ [key: string]: string; }>;
  public roundWin: ReplaySubject<{ [key: string]: string; }>;
  public gameWin: ReplaySubject<{ [key: string]: string; }>;
  public playedCard: ReplaySubject<{ [key: string]: string; }>;
  public updateCardStatus: ReplaySubject<{ [key: string]: string; }>;
  public myPlayingTurn: ReplaySubject<{ [key: string]: string; }>;
  public bidOptions: ReplaySubject<{ [key: string]: string; }>;
  public hideBidOptions: ReplaySubject<{ [key: string]: string; }>;
  public newCard: ReplaySubject<{ [key: string]: string; }>;
  public myTurn: ReplaySubject<{ [key: string]: string; }>;
  public bidWinner: ReplaySubject<{ [key: string]: string; }>;
  public leaveLobby: ReplaySubject<{ [key: string]: string; }>;
  public setLobbyObject: ReplaySubject<{ [key: string]: string; }>;
  public setRoomObject: ReplaySubject<{ [key: string]: string; }>;
  public newPlayerInGameSo: ReplaySubject<{ [key: string]: any; }>;
  public getPlayerBid: ReplaySubject<{ [key: string]: any; }>;
  public getDummyPlayerCard: ReplaySubject<{ [key: string]: any; }>;
  public getDouble: ReplaySubject<{ [key: string]: any; }>;
  public getReDouble: ReplaySubject<{ [key: string]: any; }>;
  public reDisrtibute: ReplaySubject<string>;
  public setBid: ReplaySubject<{ [key: string]: any; }>;
  public setMessage: ReplaySubject<{ [key: string]: any; }>;
  public nameDirection: ReplaySubject<{ [key: string]: any; }>;
  public startPrivateRoom: ReplaySubject<{ [key: string]: any; }>;
  public gameTimer: ReplaySubject<{ [key: string]: any; }>;
  public playerJoinGame: ReplaySubject<string>;
  public gameDestroy: ReplaySubject<any>;
  public gettingPing:ReplaySubject<any>;


  constructor(public model: ModelLocator, public router: Router, public localDb: LocalDBService) {

    this.pointsUpdate = new ReplaySubject<{ [key: string]: string; }>(1);
    this.handWin = new ReplaySubject<{ [key: string]: string; }>(1);
    this.roundWin = new ReplaySubject<{ [key: string]: string; }>(1);
    this.gameWin = new ReplaySubject<{ [key: string]: string; }>(1);
    this.playedCard = new ReplaySubject<{ [key: string]: string; }>(1);
    this.updateCardStatus = new ReplaySubject<{ [key: string]: string; }>(1);
    this.myPlayingTurn = new ReplaySubject<{ [key: string]: string; }>(1);
    this.bidOptions = new ReplaySubject<{ [key: string]: string; }>(1);
    this.hideBidOptions = new ReplaySubject<{ [key: string]: string; }>(1);
    this.newCard = new ReplaySubject<{ [key: string]: string; }>(1);
    this.myTurn = new ReplaySubject<{ [key: string]: string; }>(1);
    this.leaveLobby = new ReplaySubject<{ [key: string]: string; }>(1);
    this.setLobbyObject = new ReplaySubject<{ [key: string]: string; }>(1);
    this.setRoomObject = new ReplaySubject<{ [key: string]: string; }>(1);
    this.newPlayerInGameSo = new ReplaySubject<{ [key: string]: any; }>(1);
    this.bidWinner = new ReplaySubject<{ [key: string]: any; }>(1);
    this.getPlayerBid = new ReplaySubject<{ [key: string]: any; }>(1);
    this.getDummyPlayerCard = new ReplaySubject<{ [key: string]: any; }>(1);
    this.getDouble = new ReplaySubject<{ [key: string]: any; }>(1);
    this.getReDouble = new ReplaySubject<{ [key: string]: any; }>(1);
    this.reDisrtibute = new ReplaySubject<string>(1);
    this.setBid = new ReplaySubject<{ [key: string]: any; }>(1);
    this.setMessage = new ReplaySubject<{ [key: string]: any; }>(1);
    this.nameDirection = new ReplaySubject<{ [key: string]: any; }>(1);
    this.startPrivateRoom = new ReplaySubject<{ [key: string]: any; }>(1);
    this.gameTimer = new ReplaySubject<{ [key: string]: any; }>(1);
    this.playerJoinGame = new ReplaySubject<string>(1);
    this.gameDestroy = new ReplaySubject<{ [key: string]: any; }>(1);
    this.gettingPing = new ReplaySubject<{ [key: string]: any; }>(1);




  }

  //Random Room
  public connectServer(userObj: any): any {
    const port = 'wss://api.anytimebridge.com/';
    // const port = 'ws://52.86.225.76:3001';
    this.client = new Client(port);
    this.router.navigateByUrl('/random-game', { skipLocationChange: false });
    console.log("client is ", this.client, " port is ", port)
    if (userObj.isTimer) {
      this.joinOrCreate('tlobby', userObj);
    }
    else {
      this.joinOrCreate('lobby', userObj);
    }
  }

  //Create or Join Random Room
 
   public joinOrCreate(type: any, userObj: any) {
    this.client.getAvailableRooms(type).then((rooms: any) => {
      console.log("rooms are ", rooms)
      let roomExist = false;
      if (rooms.length == 0) {
        this.client.create(type, userObj).then((lobby: any) => {
          this.setLobbyObject.next(lobby);
          console.log("Room created successfully >>", lobby, userObj);
          this.startLobby(lobby, 'random');
        }).catch((e: any) => {
          console.log("Lobby JOIN ERROR", e);
          alert("errror in connecting with lobby")
        });
      }
      else {
        for (var i = 0; i < rooms.length; i++) {
          console.log("matching rooms ", rooms[i].roomId);
          if (rooms[i].roomId == userObj.roomId) {
            roomExist = true;
            this.client.joinById(rooms[i].roomId, userObj).then((lobby: any) => {
              this.setLobbyObject.next(lobby);
              console.log("lobby joined successfully >>", lobby);
              this.startLobby(lobby, 'Random');
            }).catch((e: any) => {
              console.log("JOIN ERROR", e);
            });
          }
          else if (!roomExist && i == (rooms.length - 1)) {
            this.client.create(type, userObj).then((lobby: any) => {
              this.setLobbyObject.next(lobby);
              console.log("Room created successfully >>", lobby, userObj);
              this.startLobby(lobby, 'random');
            }).catch((e: any) => {
              console.log("Lobby JOIN ERROR", e);
            });
          }
        }
      }
    }).catch((e: any) => {
      console.log("get avl rooms Room Join ERROR", e);
    });
  }

  //Start Random Lobby
  startLobby(lobby: any, roomtype: any) {
    lobby.onMessage("JOINFINAL", (message: any) => {
      // console.log("ALL PLAYERS 141", this.model.playersInRoom);
      // if (message.gamePlayerList.length > this.model.playersInRoom.length)
      {
        this.model.playersInRoom = message.gamePlayerList;
        console.log("ALL PLAYERS", this.model.playersInRoom);
      }

    });

    lobby.onMessage("ROOMCONNECT", (message: any) => {
      console.log("Room Connected", message);
      this.model.teamName = message.team;
      this.model.seatOnServer = message.seat;
      this.model.userServerIndex = message.userIndex;
      lobby.leave();
      this.leaveLobby.next(message);
    });

    // lobby.state.onChange = (changes: any) => {
    //   changes.forEach((change: any) => {
    //     switch (change.field) {
    //       case "waitTimerCount":
    //         break;
    //       case "status":

    //         break;
    //       case "winner":
    //         break;
    //       case "chatMessage":
    //         console.log("CHat log>>", change.value);
    //     }
    //   });
    // };
    lobby.onLeave((code: any) => {
      console.log("client left the lobby random", code);
    });
  }

  //connect to game
  connectToPhaserRoom() {
    console.log("CONNECT TO PHASER ROOM", this.model.userId)
   try {this.client.consumeSeatReservation(this.model.seatOnServer).then((room: any) => {
      console.log("user joined game room successfully ", room);
      this.localData = { "roomId": room.id, "sessionId": room.sessionId }
      this.model.roomId = room.id;
      this.setRoomObject.next(room);
      this.model.gameLoad=true;
      if (this.model.gameType == 'Friends') {
        this.startGame(room);
      }
      else {
        this.startGame(room);
      }
    })}catch{}
  }

  //Initialize all the in game events
  startGame(room: any) {
    console.log('inside start game');
    this.model.gameRoom = room;

       

    //onMessage Event For Room
    room.onMessage("HANDWINNER", (message: any) => {
      console.log("handwinner animation >>", message);
      let map1: { [key: string]: string; } = {};
      map1['points'] = message.points;
      map1['myTeam'] = this.model.teamName;
      this.pointsUpdate.next(map1);

      let map2: { [key: string]: string; } = {};
      map2['seat'] = '0';
      for (let currentPlayer of this.model.allPlayers) {
        if (currentPlayer.index == message.winnerIndex) {
          map2['seat'] = currentPlayer.seat;
          break;
        }
      }
      console.log("map is ", map2)
      this.handWin.next(map2);
    });
    // Getting ping
    room.onMessage("ping_from_server",(message:any)=>{
      this.gettingPing.next(message);
      this.model.checkingNetwork=true;
      

    })

    //BIDWINNER
    room.onMessage("BIDWINNER", (message: any) => {
      console.log("BIDWINNER animation >>", message);
      this.model.bidWin = true;
      this.bidWinner.next(message);
    });

    room.onMessage("BIDDETAILS", (message: any) => {
      console.log("BIDDETAILS >>", message);
      this.setBid.next(message);

    });
    room.onMessage("DUMMYPLAYER", (message: any) => {
      console.log("DUMMYPLAYER >>", message);
      this.model.DummyPlayerIndex = message.index;
      if (this.model.DummyPlayerIndex == this.model.userServerIndex)
        this.model.areYouDummy = true;
      this.getDummyPlayerCard.next(message);
      this.model.sortedArray = [];
      this.model.cardNewArray = [];

    });

    room.onMessage("DECLAREROUNDWINNER", (message: any) => {
      console.log("DECLAREROUNDWINNER popup >>", message, this.model.teamName);
      this.roundWin.next(message);
    });

    room.onMessage("DECLAREGAMEWINNER", (message: any) => {
      console.log("DECLAREGAMEWINNER popup >>", message, message.team);
      this.gameWin.next(message);
    });

    room.onMessage("DISCONNECT", (message: any) => {
      this.gameDestroy.next("DISCONNECT");
      // this.router.navigateByUrl("");
      alert("Disconnect Room");

    });

    room.onMessage("REDISTRIBUTE", (message: any) => {
      console.log("please Redistribute the cards", message);
      var text: any = 1;
      this.model.cardDistibuted = false;
      this.reDisrtibute.next('1');
      this.model.sortedArray = [];
      this.model.cardNewArray = [];
    });

    room.onMessage("Leave_Player", (message: any) => {
      console.log("Leave_Player", message);
      if (!message.consented && this.model.userId != message.dbId) {
        this.model.leavePlayerName.push(message.userName)
        let leavePlayer=""

        if (this.model.isTimer) {
          this.model.leavePlayerName.forEach((element:any,index:any)=>{
            if(index==0){
              leavePlayer=element;
            }
            else 
           { leavePlayer=element+","+leavePlayer;}
         });
          this.model.message = leavePlayer + " is offline. Cards will be played by server until player do not come online.";
          this.model.messageClose = true;
          this.model.messagePopupVisible = true;
          setTimeout(() => {
            this.model.messagePopupVisible = false;
            this.model.messageClose = false;
          }, 10000);
        }
        else if (!this.model.isTimer) {
          
          this.model.leavePlayerName.forEach((element:any,index:any)=>{
            if(index==0){
              leavePlayer=element;
            }
            else 
           { leavePlayer=element+","+leavePlayer;}
         });
         this.model.message=leavePlayer+ "  is offline. Please wait for player to join the game again.";

          // this.model.message = message.userName + "  is offline. Please wait for player to join the game again.";
          this.model.messagePopupVisible = true;

        }
      }

      if (this.model.leaveCount == 0 && message.consented && !this.model.isTimer) {
        this.model.message = message.userName + " Left, game ended";
        this.model.leaveCount++;
        this.model.messagePopupVisible = true;
        setTimeout(() => {
          this.model.messagePopupVisible = false;
        }, 5000);
        // this.playerLeave.next(message);
      }
      else if( this.model.isTimer && message.consented ){
        this.model.message = message.userName + " Left. Cards will be played by server until player do not come online.";
        this.model.messageClose = true;
        this.model.messagePopupVisible = true;
        setTimeout(() => {
          this.model.messagePopupVisible = false;
          this.model.messageClose = false;

        }, 5000);
      }


    });
    room.onMessage("playerStatus",(message:any)=>{
      setTimeout(()=>{this.model.loader=false;},5000);
      let leavePlayer="";
      this.model.leavePlayerName=[];
      let count=0;
      console.log("reconnection player list==>",message);
      message.forEach((element:any,index:any)=>{
        if(element.leftPlayer){
          this.model.leavePlayerName.push(element.userName);
          count++;
          leavePlayer=element.userName+"," +leavePlayer;
        }

     });
     if(leavePlayer.length>0){
      if (!this.model.isTimer){
        this.model.messagePopupVisible=true;
     this.model.message=leavePlayer+ "  is offline. Please wait for player to join the game again.";
    }
     else if (this.model.isTimer) {
      this.model.message=leavePlayer+ "  is offline. Cards will be played by server until player do not come online.";
      this.model.messageClose = true;
      setTimeout(() => {
        this.model.messagePopupVisible = false;
        this.model.messageClose = false;
      }, 10000);
      }
    }

     if(count==0){
      this.model.messagePopupVisible=false;
     }



    })

    // on Player Reconnected
    room.onMessage("player_Reconnected", (message: any) => {
      console.log("player_Reconnected", message);
      let leavePlayer=" ";

      if(this.model.leavePlayerName.lenght==1){
        if(message.userName==this.model.leavePlayerName[0]){
        this.model.leavePlayerName=[];
        this.model.messagePopupVisible = false;
  }
      }
     else{ this.model.leavePlayerName.forEach((element:any,index:any)=>{
        if(element==message.userName) this.model.leavePlayerName.splice(index,1);
     });}
     this.model.leavePlayerName.forEach((element:any,index:any)=>{
      if(index==0){
        leavePlayer=element;
      }
      else 
     { leavePlayer=element+","+leavePlayer;}
     })
     if(!this.model.isTimer){
      this.model.message=leavePlayer+ "  is offline. Please wait for player to join the game again.";
     console.log("leavePlayerList",this.model.leavePlayerName);
    }
      // if (this.model.isTimer) {
      // this.model.message=leavePlayer+ "  is offline. Cards will be played by server until player do not come online.";
      // this.model.messageClose = true;
      // setTimeout(() => {
      //   this.model.messagePopupVisible = false;
      //   this.model.messageClose = false;
      // }, 10000);
      // }
      if(this.model.leavePlayerName.length==0)
      {this.model.messagePopupVisible = false;
        this.model.messageClose = false;
      }

    });

    room.onMessage('chatMessage', (message: any) => {
      console.log('here is the chat', message);
      this.setMessage.next(message);
    });

    //on state events in game
    room.state.players.onAdd = (player: any, key: any) => {
      console.log(player, "has been added at", key);
      console.log("friends player>>>>", player, player.coin, player.userName);
      // this.model.friendProfile.push(player);
      let map: { [key: string]: string; } = {};
      map['playerName'] = player.userName;
      map['playerId'] = key;
      map['itsMe'] = 'false';
      map['type'] = "Random";
      map['userId'] = player.dbId;
      map['avatar'] = player.avatar;
      map['index'] = player.index;

      console.log(player.dbId, "comparing", this.model.userId, this.model.userServerIndex, "inside room connect");

      if (player.dbId == this.model.userId) {
        map['itsMe'] = 'true';
        this.model.teamName = player.team;
        // console.log("updating room connect index ", key)
        this.model.userServerIndex = player.index;
        map['chairId'] = '1';
      }
      else {
        console.log("user server index in switch ", this.model.userServerIndex)
        switch (this.model.userServerIndex.toString()) {
          case '0':
            // console.log("case 0 and key ", key)
            if (player.index == 2) {
              map['chairId'] = '2';
            }
            else if (player.index == 1) {
              map['chairId'] = '3';
            }
            else if (player.index == 3) {
              map['chairId'] = '4';
            }
            break;
          case '1':
            // console.log("case 1 and key ", key)
            if (player.index == 3) {
              map['chairId'] = '2';
            }
            else if (player.index == 2) {
              map['chairId'] = '3';
            }
            else if (player.index == 0) {
              map['chairId'] = '4';
            }
            break;
          case '2':
            // console.log("case 2 and key ", key)

            if (player.index == 0) {
              map['chairId'] = '2';
            }
            else if (player.index == 3) {
              map['chairId'] = '3';
            }
            else if (player.index == 1) {
              map['chairId'] = '4';
            }
            break;
          case '3':
            // console.log("case 3 and key ", key)
            if (player.index == 1) {
              map['chairId'] = '2';
            }
            else if (player.index == 0) {
              map['chairId'] = '3';
            }
            else if (player.index == 2) {
              map['chairId'] = '4';
            }
            break;
        }
      }

      let anObj = { userName: player.userName, index: player.index, team: player.team, userId: player.dbId, seat: map.chairId, avatar: map.avatar };
      // console.log("adding player ", player, map.chairId, key);
      this.model.allPlayers.push(anObj);
      this.newPlayerInGameSo.next(map);
      this.nameDirection.next(player);


      let self = this;
      player.onChange = function (changes: any) {
        // console.log('this is the index of dummy player', changes);

        changes.forEach((change: any) => {
          switch (change.field) {
            case "cardPlayed":
              // update card played
              var card = change.value;
              console.log('here is the data of player>>>>>>>>>', change.value, self.model.allPlayers);
              if (change.value != null) {
                let map1: { [key: string]: string; } = {};
                map1['seat'] = '0';
                for (let currentPlayer of self.model.allPlayers) {
                  if (currentPlayer.userId == player.dbId) {
                    map1['seat'] = currentPlayer.seat;
                    break;
                  }
                }
                map1['card'] = change.value;
                console.log("card played ", card)
                self.playedCard.next(map1);
                console.log("played server card received ", change.value.id)
              }
              break;

            case 'canDouble':
              if (self.model.userServerIndex == player.index) {
                console.log("Can Double is found", change.value, player.index, (self.model.userServerIndex == player.index));
                // if (this.model.allPlayers.length == 4) 
                self.getDouble.next(change.value);
              }
              break;

            case 'canReDouble':

              if (self.model.userServerIndex == player.index) {
                console.log("Can ReDouble is found", change.value);
                // if (this.model.allPlayers.length == 4) 
                self.getReDouble.next(change.value);
              }
          }
        });
      };
      // console.log('this is the index of dummy player', player.index)
      if ((this.model.userServerIndex == player.index) || ((this.model.userServerIndex + 2) == player.index) || ((this.model.userServerIndex - 2) == player.index)) {
        let self = this;
        player.cards.onAdd = function (card: any, key: any) {
          if (self.model.userServerIndex == player.index  && !self.model.cardDistibuted ) {
            
            let map1: { [key: string]: string; } = {};
            map1['id'] = card.id;
            map1['value'] = card.card;
            map1['isActive'] = card.isActive;
            self.model.sortedArray.push(card.id);
            self.model.cardNewArray.push(map1);
            console.log("cards========>",card.id,card.card);
            if (self.model.sortedArray.length > 12) {
              self.model.cardDistibuted = true;
              let lowestToHighest = self.model.sortedArray.sort((a: number, b: number) => b - a);
              for (var i = 0; i < self.model.cardNewArray.length; i++) {
                self.model.cardNewArray[i].id = lowestToHighest[i];
                self.newCard.next(self.model.cardNewArray[i]);
              }
              // console.log('the sorted array is', lowestToHighest);
            }

            // self.newCard.next(map1);
          }

          card.onChange = function (changes: any) {
            changes.forEach((change: any) => {
              switch (change.field) {
                case "isActive":
                  let map1: { [key: string]: string; } = {};
                  map1['id'] = card.id;
                  map1['isActive'] = change.value;
                  map1['index'] = player.index;
                  self.updateCardStatus.next(map1);
                  // UI.setCard(change.value, card.id);
                  break;
              }
            });
          }

        }
      }

      room.state.players.onRemove = (player: any, key: any) => {
        console.log("players on remove ", player);
        // UI.removeGamePlayer(player, key);
      }
      room.onMessage("PLAYER_LEFT", (message: any) => {
        room.leave();
        alert("Game has completed");
        // location.reload();

      });
      player.triggerAll();

    };

    room.onError((code: any, message: any) => {
      console.log("oops, error ocurred:", message);
    });

    room.state.onChange = (changes: any) => {
      changes.forEach((change: any) => {
        switch (change.field) {
          case 'status':
            // console.log("status >>", change);
            this.currentGameStatus = change.value;
            if (change.value == "GAMEPLAY" && change.previousValue == "BIDDING") {
              this.hideBidOptions.next(change);
            }
            break;
          case 'turnIndex':
            // console.log("turnIndex >>", change);
            let map: { [key: string]: string; } = {};
            map['playerIndex'] = change.value;
            map['seat'] = '0';
            for (let player of this.model.allPlayers) {
              if (player.index == change.value) {
                map['seat'] = player.seat;
                break;
              }
            }
            this.myTurn.next(map);
            // console.log("status last >>", change.value, this.currentGameStatus);
            if (this.currentGameStatus == "BIDDING") {
              console.log('these are the hide options before if condition', change.value, this.model.userServerIndex);
              if (change.value == this.model.userServerIndex) {
                console.log('these are the hide options', change.value);
                this.bidOptions.next(change);
              }
              else {
                let map: { [key: string]: string; } = {};
                map['previousValue'] = change.previousValue;
                map['value'] = change.value;
                map['myIndex'] = this.model.userServerIndex.toString();
                this.hideBidOptions.next(map);
              }
            }
            if (this.currentGameStatus == "GAMEPLAY") {
              // console.log('I am inside the current game');
              this.myPlayingTurn.next(change.value);
            }
            break;

          case 'currentTurnTimer':
            this.gameTimer.next(change.value);
        }
      });
    }

    room.state.teamScore.onChange = (changes: any) => {

      console.log("score changes >>>>>>", changes);
      changes.forEach((change: any) => {
        switch (change.field) {
          case 'A':
            console.log("team A score update", change.value)
            // UI.updateTeamScore( 'A', change.value )
            break;
          case 'B':
            console.log("team B score update", change.value)
            // UI.updateTeamScore( 'B', change.value );
            break;
        }
      });
    }
    if (!this.model.isReconnect) {
      this.localDb.setSessionData(this.localData);
    }
    // room.onLeave(() => {
    //   room.removeAllListeners();
    //   this.reconnect(room.id,room.sessionId);
    // });
  }

  ///////////Private Lobby Room/////////
  public connectServerFriend(userObj: any): any {
    const port = 'wss://api.anytimebridge.com/';
    // const port = 'ws://52.86.225.76:3001';
    this.client = new Client(port);
    this.router.navigateByUrl('new-game', { skipLocationChange: false });
    this.client.create('friendInvite', userObj).then((lobby: any) => {
      this.setLobbyObject.next(lobby);
      console.log("lobby Info friend >>", lobby, this.setLobbyObject);
      this.model.roomCodeToJoinAndShare = userObj.roomId;
      this.startLobbyFriend(lobby, 'Random');
    }).catch((e: any) => {
      console.log("Lobby JOIN ERROR", e);
      alert("errror in connecting with lobby");
    });
  }
  startLobbyFriend(friendsRoom: any, roomtype: any) {
    console.log("inside FriendsRoom", friendsRoom.onMessage);
    friendsRoom.state.players.onAdd = (player: any, key: any) => {
      console.log("125", player);
      this.updatePlayersInLobbyFriend(player);
      let map: { [key: string]: any; } = {};
      map['userName'] = player.userName;
      map['userId'] = player.dbId;
      map['isPartner'] = '';
      map['id'] = 0;
      this.model.gamePlayer.push(map);
      // friendsRoom.leave();
      this.updatePlayersInLobbyFriend(this.model.gamePlayer);
    }

    this.friendRoomConnect(friendsRoom);
    friendsRoom.onMessage("ROOM_CONNECT", (message: any) => {
      console.log("room connect ", message);
      console.log("ALL PLAYERS", this.model.playersInRoom);

      this.model.teamName = message.team;
      this.model.seatOnServer = message.seat;
      this.model.userServerIndex = message.userIndex;
      console.log('this is the value of timer', this.model.isTimer);
      this.model.isTimer = message.isTimer;
      console.log(message.userIndex, "inside room connect");
      friendsRoom.leave();
      this.leaveLobby.next(message);
      this.model.players = [];
      this.model.roomCodeToJoinAndShare = 0;

    });

    friendsRoom.state.players.onRemove = (player: any, key: any) => {
      console.log("player12560988", player);
      let map: { [key: string]: any; } = {};
      map['player'] = player;

      for (var i = 0; i < this.model.gamePlayer.length; i++) {
        if (this.model.gamePlayer[i].userId == player.dbId) {
          // this.model.playerLefted.push({playerId:this.model.gamePlayer[i].playerId,playerName:this.model.gamePlayer[i].playerName})
          this.model.gamePlayer.splice(i, 1)
        }
      }
      // this.playerLeave.next(map);
    }


    friendsRoom.state.onChange = (changes: any) => {
      changes.forEach((change: any) => {
        // console.log("client left the lobb change ", change);
        switch (change.field) {
          case "waitTimerCount":
            break;
          case "status":

            break;
          case "winner":
            break;
          case "chatMessage":
            console.log("CHat log>>", change.value);
        }
      });
    };

    friendsRoom.onLeave((code: any) => {
      console.log("client left the lobby", code);
      // alert("lobby onleave")
    });
  }

  updatePlayersInLobbyFriend(playerDetails: any) {
    console.log("players are ", playerDetails);
    const p: playersvo[] = [];
    if (this.model.players.length != this.model.gamePlayer.length) {
      this.model.players = []
      this.model.hostPlayer = this.model.gamePlayer[0];
      for (let player of this.model.gamePlayer) {
        const participant: playersvo = new playersvo(player.userName, player.id, player.userId, player.isPartner);
        this.model.players.push(participant);
        console.log(this.model.players, "this.model.players");
      }
      this.model.playersInRoom = this.model.gamePlayer;
      if (this.model.playersInRoom.length == 4) {
        this.startPrivateRoom.next();
      }

    }
  }

  public joinFriendsRoom(userObj: any, roomId: any) {
    console.log("inside funcnjoin friend")
    const port = 'wss://api.anytimebridge.com/';
    // const port = 'ws://52.86.225.76:3001';
    this.client = new Client(port);
    let roomExist = false;
    this.client.getAvailableRooms("friendInvite").then((rooms: any) => {
      console.log("rooms are ", rooms)
      if (rooms.length == 0) {
        console.log("")
      }
      else {
        for (var i = 0; i < rooms.length; i++) {
          console.log("matching rooms ", rooms[i].metadata.data.roomcode, "and ", roomId)
          if (rooms[i].metadata.data[0].roomcode == roomId) {
            roomExist = true;
            this.client.joinById(rooms[i].roomId, userObj).then((lobby: any) => {
              console.log("lobby joined successfully >>", lobby);
              this.startFriendsRoom(lobby, 'Random');
              this.model.joinPrivateGame = false;

              this.router.navigateByUrl('/join-game', { skipLocationChange: false });

              this.setLobbyObject.next(lobby);

            }).catch((e: any) => {
              console.log("JOIN friendivite ERROR", e);
            });
          }
          else if (!roomExist && i == (rooms.length - 1)) {
            console.log("elseif 595");
          }
        }
      }
    }).catch((e: any) => {
      console.log("get avl rooms friendivite ERROR", e);
      alert("room join error")
    });
  }

  startFriendsRoom(friendsRoom: any, roomType: any) {
    console.log('inside start friends room', friendsRoom);
    friendsRoom.state.players.onAdd = (player: any, key: any) => {
      console.log('inside start friends room', player);
      let map: { [key: string]: any; } = {};
      map['userName'] = player.userName;
      map['userId'] = player.dbId;
      map['isPartner'] = '';
      map['id'] = 0;
      this.model.gamePlayer.push(map);

      this.updatePlayersInLobbyFriend(this.model.gamePlayer);
      console.log(player, "player628");
    }

    this.friendRoomConnect(friendsRoom);

    friendsRoom.state.onChange = (changes: any) => {
      changes.forEach((change: any) => {
        console.log("client lobb change ", change);
        switch (change.field) {
          case "customRoomCode":
            console.log("room code found ", change.value);
            this.model.roomCodeToJoinAndShare = change.value;
            break;
        }
      });
    };

    friendsRoom.state.players.onRemove = (player: any, key: any) => {
      console.log("player12560988", player);
      let map: { [key: string]: any; } = {};
      map['player'] = player;
      for (var i = 0; i < this.model.gamePlayer.length; i++) {
        if (this.model.gamePlayer[i].userId == player.dbId) {
          this.model.gamePlayer.splice(i, 1)
        }
      }
    }

    friendsRoom.onLeave((code: any) => {
      console.log("client left the lobby", code);
    });
  }

  friendRoomConnect(friendsRoom: any) {

    friendsRoom.onMessage("ROOM_CONNECT", (message: any) => {
      console.log("room connect ", message);
      console.log("ALL PLAYERS", this.model.playersInRoom);
      this.model.teamName = message.team;
      this.model.seatOnServer = message.seat;
      this.model.isTimer = message.isTimer;
      this.model.userServerIndex = message.userIndex;
      console.log(message.userIndex, "inside room connect");
      friendsRoom.leave();
      this.leaveLobby.next(message);
      this.model.players = [];
      this.model.roomCodeToJoinAndShare = 0;
    });

  }

  //Reconnection Code
  async reconnect(roomId: any, sessionId: any) {
    let temp;
    const port = 'wss://api.anytimebridge.com/';
    // const port = 'ws://52.86.225.76:3001';
    this.client = new Client(port);
    console.log("roomid and sessionId", roomId, sessionId);
    if (roomId){if (roomId.length > 0) {
      try {
        // this.model.loader=true;

        temp = await this.client.reconnect(roomId, sessionId);
        this.model.loader=true;

        console.log("reconnection", temp);
        // this.model.loader=true;
        this.startGame(temp);
      } catch (e) {
        console.log("error in reconnection ", e);
        this.model.isReconnect = false;
        this.model.loader=false;

        

      }
    }}

  }
  // async lobbyReconnect(roomId:any,sessionId:any){	
  //   let temp;	
  //   const port = 'wss://api.anytimebridge.com/';	
  //   this.client = new Client(port);	
  //   console.log("roomid and sessionId", roomId, sessionId);	
  //   if (roomId.length > 0) {	
  //     try {	
  //       temp = await this.client.reconnect(roomId, sessionId);	
  //       console.log("reconnection", temp);	

  //      this.startLobby(temp,'random')	
  //       // this.model.blackBg = false;	
  //       // this.router.navigateByUrl('/game', { skipLocationChange: false });	
  //     } catch (e) {	
  //       console.log("error in reconnection ", e);	

  //     }	
  //   }	
  // }	

}


