import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-partner',
  templateUrl: './choose-partner.component.html',
  styleUrls: ['./choose-partner.component.css']
})
export class ChoosePartnerComponent implements OnInit {

  constructor(public router:Router) { }

  ngOnInit(): void {
  }

  StartGame(){
    this.router.navigateByUrl('game');

  }

}
