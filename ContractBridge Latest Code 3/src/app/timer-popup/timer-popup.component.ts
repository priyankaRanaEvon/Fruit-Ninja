import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModelLocator } from '../ModelLocator/ModelLocator';
import { SocketconnectionService } from '../services/socketconnection.service';

@Component({
  selector: 'app-timer-popup',
  templateUrl: './timer-popup.component.html',
  styleUrls: ['./timer-popup.component.css']
})
export class TimerPopupComponent implements OnInit {

  constructor(public model:ModelLocator,public router:Router,public SocketSvc:SocketconnectionService) { }

  ngOnInit(): void {
  }

  yes(){
    this.model.isTimer=true;
    let userObj;
    if(!this.model.isHost){
      userObj = {
      userName: this.model.userName,
      coin: 100,
      avatar: "1",
      dbId: Number(this.model.userId),
      mode: 'normal',
      isTimer:this.model.isTimer,
      roomId: 'alice',
    }
    this.SocketSvc.connectServer(userObj);
  }
  else if(this.model.isHost){
    userObj = {
      userName: this.model.userName,
      coin: 100,
      avatar: "1",
      dbId: Number(this.model.userId),
      mode: 'normal',
      roomId: (Math.random() + 1).toString(36).substring(7),
      isHost:true,
      isTimer:this.model.isTimer,


    }
    this.SocketSvc.connectServerFriend(userObj);


  }
    
    // this.router.navigateByUrl('random-game');
    this.model.showTimerPopup=false;
  }
  no(){
    this.model.isTimer=false;
    let userObj;
    if(!this.model.isHost){
      console.log("Random is called");
      userObj = {
      userName: this.model.userName,
      coin: 100,
      avatar: "1",
      dbId: Number(this.model.userId),
     

      mode: 'normal',
      isTimer:this.model.isTimer,
      roomId: 'JayShreeRam',
    }
    console.log("userobj",userObj)
    this.SocketSvc.connectServer(userObj);
  }
  else if(this.model.isHost){
    console.log("create room ie called");
    userObj = {
      userName: this.model.userName,
      coin: 100,
      avatar: "1",
      dbId: Number(this.model.userId),
      mode: 'normal',
      roomId: (Math.random() + 1).toString(36).substring(7),
      isHost:true,
      isTimer:this.model.isTimer,


    }
    this.SocketSvc.connectServerFriend(userObj);


  }
    
    // this.router.navigateByUrl('random-game');
    this.model.showTimerPopup=false;
  }

}
