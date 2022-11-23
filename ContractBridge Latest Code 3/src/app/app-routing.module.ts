import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChoosePartnerComponent } from './choose-partner/choose-partner.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { JoinGameComponent } from './join-game/join-game.component';
import { NewGameComponent } from './new-game/new-game.component';
import { RandomGameComponent } from './random-game/random-game.component';
import { ResultComponent } from './result/result.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameComponent},
  { path: 'random-game', component: RandomGameComponent },
  { path: 'choose-partner', component: ChoosePartnerComponent},
  { path: 'join-game', component: JoinGameComponent},
  { path: 'random-game', component: RandomGameComponent},
  { path: 'result', component: ResultComponent},
  { path: 'new-game', component: NewGameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
