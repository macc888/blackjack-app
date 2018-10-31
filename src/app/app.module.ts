import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';
import { HandComponent } from './game/hand/hand.component';
import { CardComponent } from './game/card/card.component';
import { LeaderBoardComponent } from './leader-board/leader-board.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GameComponent,
    HandComponent,
    CardComponent,
    LeaderBoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
