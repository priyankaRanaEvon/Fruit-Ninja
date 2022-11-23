import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { ResultComponent } from './result/result.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { RandomGameComponent } from './random-game/random-game.component';
import { ModalComponent } from './modal/modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewGameComponent } from './new-game/new-game.component';
import { JoinGameComponent } from './join-game/join-game.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ExitPopUpComponent } from './exit-pop-up/exit-pop-up.component';
import { TimerPopupComponent } from './timer-popup/timer-popup.component';
import { MessagePopupComponent } from './message-popup/message-popup.component';
import { LoaderComponent } from './loader/loader.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    ResultComponent,
    ChatboxComponent,
    RandomGameComponent,
    ModalComponent,
    NewGameComponent,
    JoinGameComponent,
    ExitPopUpComponent,
    TimerPopupComponent,
    MessagePopupComponent,
    LoaderComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    HttpClientModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
