import { Component, OnInit, OnDestroy } from '@angular/core';
import { Deck, Card, User, Hand, Outcome, GameState, LeaderBoardEntry } from 'src/app/shared/models/models';
import { DeckService } from './deck.service';
import { StateService } from '../shared/services/state.service';
import { Subscription } from 'rxjs';
import { ScoreService } from '../shared/services/score.service';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private state: string;
  public bet: number;
  public deck: Deck;
  public dealer: User;
  public players: User[] = [];
  public numberOfDecks = 1;
  public userName: string;

  constructor(
    private deckService: DeckService,
    private stateService: StateService,
    private scoreService: ScoreService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initGame();
    this.subscriptions[0] = this.stateService.currentState$.subscribe(state => {
      this.state = state;
      switch (state) {
        case GameState.DEALERS_TURN:
        this.takeDealersTurn();
        break;
        case GameState.ROUND_END:
        this.updateScore();
        break;
      }
    });

    this.subscriptions[1] = this.userService.userName$.subscribe(name => {
      this.userName = name ? name : 'Unknown';
    });
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      if (sub) {
        sub.unsubscribe();
      }
    }
  }

  public deal() {
    this.dealer.hand = [];
    this.dealer.hand[0] = new Hand();
    this.dealer.hand[0].cards = [];
    this.players[0].hand = [];
    this.players[0].hand[0] = new Hand();
    this.players[0].hand[0].cards = [];
    this.dealer.hand[0].cards.push(this.draw());
    this.dealer.hand[0].cards[0].faceDown = true;
    this.players[0].hand[0].cards.push(this.draw());
    this.dealer.hand[0].cards.push(this.draw());
    this.players[0].hand[0].cards.push(this.draw());
  }

  public placeBet(handIndex: number) {
    this.deal();
    this.players[0].hand[handIndex].bet = this.bet;
    this.players[0].score -= this.bet;
    this.scoreService.scoreHand(this.players[0].hand[0]);
    this.scoreService.scoreHand(this.dealer.hand[0]);
    if (this.players[0].hand[0].outcome === Outcome.BlackJack ||
      this.players[0].hand[0].outcome === Outcome.TwentyOne ||
      this.dealer.hand[0].outcome === Outcome.BlackJack) {
      this.stateService.setCurrentState(GameState.ROUND_END);
    } else {
      this.stateService.setCurrentState(GameState.PLAYERS_TURN);
    }
  }

  public hit(handIndex) {
    this.players[0].hand[handIndex].cards.push(this.draw());
    this.scoreService.scoreHand(this.players[0].hand[handIndex]);
    if (this.isPlayerTurnOver()) {
      this.stateService.setCurrentState(GameState.DEALERS_TURN);
    }
  }

  public stand(handIndex) {
    this.players[0].hand[handIndex].outcome = Outcome.Stand;
    if (this.isPlayerTurnOver()) {
      this.stateService.setCurrentState(GameState.DEALERS_TURN);
    }
  }

  public split(handIndex) {
    const cardToSplit = this.players[0].hand[handIndex].cards.pop();
    const splitHandIndex = handIndex + 1;
    this.players[0].hand.splice(splitHandIndex, 0, new Hand());
    this.players[0].hand[handIndex].cards.push(this.draw());
    this.scoreService.scoreHand(this.players[0].hand[handIndex]);
    this.players[0].score -= this.players[0].hand[handIndex].bet;
    this.players[0].hand[splitHandIndex].bet = this.players[0].hand[handIndex].bet;
    this.players[0].hand[splitHandIndex].cards = [];
    this.players[0].hand[splitHandIndex].cards.push(cardToSplit);
    this.players[0].hand[splitHandIndex].cards.push(this.draw());
    this.scoreService.scoreHand(this.players[0].hand[splitHandIndex]);
  }

  public draw(): Card {
    if (this.deck.cards && this.deck.cards.length <= 0) {
      this.deck = this.deckService.shuffleDeck();
    }
    return this.deck.cards.pop();
  }

  public takeDealersTurn() {
    this.dealer.hand[0].cards[0].faceDown = false;
    const scoreToBeat = this.getScoreToBeat(this.players[0].hand);
    while (this.dealer.hand[0].val < scoreToBeat) {
      this.dealer.hand[0].cards.push(this.draw());
      this.scoreService.scoreHand(this.dealer.hand[0]);
    }
    this.stateService.setCurrentState(GameState.ROUND_END);
  }

  public startRound() {
    this.stateService.setCurrentState(GameState.BETTING_ROUND);
  }

  public getHandValueAsString(hand: Hand) {
    if (hand) {
      return hand.val + ' ' + hand.outcome;
    }
  }

  public saveGame() {
    const leaderBoardEntry: LeaderBoardEntry = new LeaderBoardEntry();
    leaderBoardEntry.name = this.userName;
    leaderBoardEntry.score = this.players[0].score;
    this.scoreService.saveLeaderBoardEntry(leaderBoardEntry);
    this.router.navigate(['leader-board']);
  }

  public inBettingState(): boolean {
    return this.state === GameState.BETTING_ROUND;
  }

  public inPlayersTurnState(): boolean {
    return this.state === GameState.PLAYERS_TURN;
  }

  public inDealersTurnState(): boolean {
    return this.state === GameState.DEALERS_TURN;
  }

  public inRoundEndState(): boolean {
    return this.state === GameState.ROUND_END;
  }

  private updateScore() {
    this.players[0].score += this.scoreService.computeBetResult(this.dealer.hand[0], this.players[0].hand);
  }

  private initGame() {
    this.dealer = new User();
    this.players[0] = new User();
    this.players[0].score = 500;
    this.deck = this.deckService.shuffleDeck();
    this.stateService.setCurrentState(GameState.BETTING_ROUND);
  }

  private isPlayerTurnOver(): boolean {
    let turnOver = true;
    for (const hand of this.players[0].hand) {
      if (hand.outcome === Outcome.CanHit || hand.outcome === Outcome.CanSplit) {
        turnOver = false;
      }
    }
    return turnOver;
  }

  private getScoreToBeat(hands: Hand[]): number {
    let scoreToBeat = 0;
    for (const hand of hands) {
      if (hand.outcome !== Outcome.Bust && scoreToBeat < hand.val) {
        scoreToBeat = hand.val;
      }
    }
    return scoreToBeat;
  }
}
