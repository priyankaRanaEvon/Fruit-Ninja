import { Component, OnInit } from '@angular/core';
import { GameComponent } from '../game/game.component';
import { ModelLocator } from '../ModelLocator/ModelLocator';

@Component({
  selector: 'app-exit-pop-up',
  templateUrl: './exit-pop-up.component.html',
  styleUrls: ['./exit-pop-up.component.css']
})
export class ExitPopUpComponent implements OnInit {

  constructor(public model:ModelLocator , public gameComp:GameComponent) { }

  ngOnInit(): void {
  }
  endGame(){
    this.gameComp.leaveGame();
  }
  cancel(){
    this.model.showExitPopUp=false;
  }

}
