import { Component, OnInit } from '@angular/core';
import { ModelLocator } from '../ModelLocator/ModelLocator';
import { FormBuilder } from '@angular/forms';
import { SocketconnectionService } from '../services/socketconnection.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(public model: ModelLocator, private formBuilder: FormBuilder, public SocketSvc: SocketconnectionService) { }
  playerform: any;

  ngOnInit(): void {
    this.playerform = this.formBuilder.group({
      roomid: [''],
    });
  }

  cancel() {
    this.model.joinPrivateGame = false;
  }


  get f() { return this.playerform.controls; }

  joinPrivateGame() {

    let userObj = {
      userName: this.model.userName,
      coin: 100,
      avatar: "1",
      dbId: Number(this.model.userId),
      mode: 'normal',
      isHost: false
    }
    this.SocketSvc.joinFriendsRoom(userObj, this.f.roomid.value);
  }
}
