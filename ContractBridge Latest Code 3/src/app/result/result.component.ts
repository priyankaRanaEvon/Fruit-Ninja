import { Component, OnInit } from '@angular/core';
import { ModelLocator } from '../ModelLocator/ModelLocator';
import { GameComponent } from '../game/game.component';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  name1:string="";name2:string="";
  name3:string="";name4:string='';

  constructor(public model:ModelLocator, public gameComp:GameComponent) { }

  ngOnInit(): void {
   this.nameupdate();
   
  }
nameupdate(){
  if(this.model.teamMemberA){
    if(this.model.teamMemberA[0].length >8){
      this.name1=this.model.teamMemberA[0].slice(0,5)+".."
    }
    if(this.model.teamMemberA[1].length >8){
      this.name2=this.model.teamMemberA[1].slice(0,5)+".."
    }
    if(this.model.teamMemberA[0].length <=8){
      this.name1=this.model.teamMemberA[0];
      
    }
    if(this.model.teamMemberA[1].length <=8){
      this.name2=this.model.teamMemberA[1];
    }

  }
 if(this.model.teamMemberB){
    if(this.model.teamMemberB[0].length >8){
      this.name3=this.model.teamMemberB[0].slice(0,5)+".."
    }
    if(this.model.teamMemberB[1].length >8){
      this.name4=this.model.teamMemberB[1].slice(0,5)+".."
    }
    if(this.model.teamMemberB[0].length <=8){
      this.name3=this.model.teamMemberB[0];
      
    }
    if(this.model.teamMemberB[1].length <=8){
      this.name4=this.model.teamMemberB[1];
    }
    
  }
}
  cancel(){
  
    // this.model.show;
    if(this.model.wayofWin =="walkOver" || this.model.gameOver){
      this.model.showResult = false;

        this.gameComp.leaveGame();
  
      }
      else{this.model.showResult = false;}
  }

}
