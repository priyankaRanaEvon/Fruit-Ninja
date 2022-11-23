import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModelLocator } from '../ModelLocator/ModelLocator';
import { LocalDBService } from '../services/local-db.service';
import { SocketconnectionService } from '../services/socketconnection.service';

// declare function sendUserData(element:any):any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public router: Router, public model: ModelLocator, public SocketSvc: SocketconnectionService,public localDb: LocalDBService) { }
  username: any;

  ngOnInit(): void {
    // this.check();
    // global.dbId = prompt("Please enter your dbId:");
    // const userObj = {
    //   userName: "contractBridge"+Math.floor(Math.random() * 10000),
    //   dbId: Math.floor(Math.random() * 10000)
    // };

    // sendUserData(userObj);

      this.model.userName = "ram" + Math.floor(Math.random() * 10000).toString();
      this.model.userId = Math.floor(Math.random() * 10000);
  
  }
  check(){
    var dataSession = this.localDb.getSessionData();
    console.log(dataSession, 'dataSessiondataSession');
    if (dataSession.length != 0) {

    }
  }
  @HostListener('window:userDetails', ['$event'])
  Onsuccess(event:any): void {
    console.log(event.detail);
    this.model.userName = event.detail.userName;
    this.model.userId = event.detail.dbId;
    // this.JoinRandom();
  }

  JoinRandom() {
    this.model.showTimerPopup=true;
    if (!this.model.userName && !this.model.userId) {
      this.model.userName = prompt("Please enter your name:");
      this.model.userId = prompt("Please enter your dbId:");
    }

    // let userObj = {
    //   userName: this.model.userName,
    //   coin: 100,
    //   avatar: "1",
    //   dbId: Number(this.model.userId),
    //   mode: 'normal',
    //   timer:this.model.isTimer
    // }

    // this.SocketSvc.connectServer(userObj);
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
    this.model.isHost=true;
    this.model.showTimerPopup=true;
    // if (!this.model.userName && !this.model.userId) {
    //   this.model.userName = prompt("Please enter your name:");
    //   this.model.userId = prompt("Please enter your dbId:");
    // }
    // let userObj = {
    //   userName: this.model.userName,
    //   coin: 100,
    //   avatar: "1",
    //   dbId: Number(this.model.userId),
    //   mode: 'normal',
    //   roomId: (Math.random() + 1).toString(36).substring(7),
    //   isHost:true

    // }
    // this.SocketSvc.connectServerFriend(userObj);
    // this.router.navigateByUrl('new-game');
  }

}
