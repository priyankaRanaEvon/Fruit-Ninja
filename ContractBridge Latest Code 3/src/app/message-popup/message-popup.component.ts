import { Component, Injectable, OnInit } from '@angular/core';
import { ModelLocator } from '../ModelLocator/ModelLocator';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.css']
})
export class MessagePopupComponent implements OnInit {
  isVisible:boolean=false;
  message:string=""
  constructor(public model:ModelLocator) { }

  ngOnInit(): void {

    
  }
  
  close(){
    this.model.messageClose=false;
    this.model.messagePopupVisible=false;


  }

}
