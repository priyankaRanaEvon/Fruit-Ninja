import { Component, OnInit } from '@angular/core';
import { GameComponent } from '../game/game.component';
import { ModelLocator } from '../ModelLocator/ModelLocator';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  msg:string="";
  constructor(private model:ModelLocator, public gameComp:GameComponent) { }

  ngOnInit(): void {
  }

  closeChatPanel(){
    this.model.showChatPanel = false;
  }
  messageToSend(data:any){
    // this.model.message=data;
    console.log("message",data);
    this.gameComp.sendMessage(data);
    this.msg="";
    this.model.showChatPanel = false;
  }
  onKeydown(event: any, data: any){
    console.log("Message : ",data);
    console.log(event);
    this.messageToSend(data);
  }

}
